import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { initUserModel } from "@/lib/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const User = await initUserModel();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Check if there are any existing users in the table
    const totalUsers = await User.count();
    const isFirstUser = totalUsers === 0;

    // 1st user is Admin and automatically Approved; subsequent users are user role and pending
    const role = isFirstUser ? "admin" : "user";
    const status = isFirstUser ? "approved" : "pending";

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
      status,
      refreshToken: null,
    });

    if (isFirstUser) {
      const payload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await newUser.update({ refreshToken });

      const response = NextResponse.json({
        message: "First user registered as Admin and automatically approved!",
        isFirstUser: true,
        user: payload,
      });

      // Set httpOnly cookies
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60, // 15 mins
      });

      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    return NextResponse.json({
      message:
        "Registration successful! Your account is currently pending approval by an administrator before you can access the portal.",
      isFirstUser: false,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error: unknown) {
    console.error("Sign-up error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to register user. Ensure the MySQL database is running." },
      { status: 500 }
    );
  }
}

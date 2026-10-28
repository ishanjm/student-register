import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { initUserModel } from "@/lib/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const User = await initUserModel();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password credentials" },
        { status: 401 }
      );
    }

    // Check approval status
    if (user.status === "pending") {
      return NextResponse.json(
        {
          error:
            "Your account is pending approval by an administrator. Please wait until your access is activated.",
          status: "pending",
        },
        { status: 403 }
      );
    }

    if (user.status === "rejected") {
      return NextResponse.json(
        {
          error:
            "Your account registration has been rejected or suspended. Contact an administrator.",
          status: "rejected",
        },
        { status: 403 }
      );
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await user.update({ refreshToken });

    const response = NextResponse.json({
      message: "Login successful",
      user: payload,
      accessToken,
    });

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
  } catch (error: unknown) {
    console.error("Login error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Login failed. Please check MySQL server connection." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initUserModel } from "@/lib/models/User";
import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 403 });
    }

    const User = await initUserModel();
    const user = await User.findOne({ where: { id: payload.id, refreshToken } });

    if (!user || user.status !== "approved") {
      return NextResponse.json({ error: "User unauthorized or not approved" }, { status: 403 });
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    const response = NextResponse.json({ accessToken: newAccessToken });
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}

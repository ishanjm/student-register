import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initUserModel } from "@/lib/models/User";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        const User = await initUserModel();
        await User.update({ refreshToken: null }, { where: { id: payload.id } });
      }
    }

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error: unknown) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { initUserModel } from "@/lib/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const User = await initUserModel();
    const user = await User.findByPk(payload.id, {
      attributes: ["id", "name", "email", "role", "status", "createdAt"],
    });

    if (!user || user.status !== "approved") {
      return NextResponse.json({ user: null }, { status: 403 });
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

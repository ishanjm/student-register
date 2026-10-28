import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { initUserModel } from "@/lib/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const User = await initUserModel();
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({ users });
  } catch (error: unknown) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { userId, status } = await request.json();

    if (!userId || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid userId or status" }, { status: 400 });
    }

    const User = await initUserModel();
    const userToUpdate = await User.findByPk(userId);

    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await userToUpdate.update({ status });

    return NextResponse.json({
      message: `User status successfully updated to ${status}`,
      user: {
        id: userToUpdate.id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role,
        status: userToUpdate.status,
      },
    });
  } catch (error: unknown) {
    console.error("Update user status error:", error);
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
  }
}

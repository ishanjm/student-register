import { NextResponse } from "next/server";
import { initStudentModel } from "@/lib/models/Student";

export async function GET() {
  try {
    const StudentModel = await initStudentModel();
    const students = await StudentModel.findAll({
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({ students });
  } catch (error: unknown) {
    console.error("GET /api/students error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to fetch students from database." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, year, status, enrolledDate } = body;

    if (!name || !email || !phone || !year || !status || !enrolledDate) {
      return NextResponse.json(
        { error: "Name, email, phone, year, status, and enrolled date are required" },
        { status: 400 }
      );
    }

    const StudentModel = await initStudentModel();

    // Check duplicate email
    const existing = await StudentModel.findOne({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "A student with this email address already exists" },
        { status: 409 }
      );
    }

    const newId =
      body.id || `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const avatar =
      body.avatar ||
      `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`;

    const newStudent = await StudentModel.create({
      id: newId,
      name,
      email,
      phone,
      avatar,
      course: body.course || "General Studies",
      year,
      status,
      gpa: body.gpa !== undefined ? Number(body.gpa) : 3.5,
      enrolledDate,
      dateOfBirth: body.dateOfBirth || null,
      address: body.address || null,
      emergencyContact: body.emergencyContact || null,
      guardianName: body.guardianName || null,
      bio: body.bio || null,
    });

    return NextResponse.json(
      { message: "Student registered successfully", student: newStudent },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/students error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to create student record." },
      { status: 500 }
    );
  }
}

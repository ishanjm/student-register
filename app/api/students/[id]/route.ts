import { NextResponse } from "next/server";
import { initStudentModel } from "@/lib/models/Student";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    const StudentModel = await initStudentModel();
    const student = await StudentModel.findByPk(decodedId);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error: unknown) {
    console.error("GET /api/students/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const body = await request.json();

    const StudentModel = await initStudentModel();
    const student = await StudentModel.findByPk(decodedId);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await student.update({
      name: body.name !== undefined ? body.name : student.name,
      email: body.email !== undefined ? body.email : student.email,
      phone: body.phone !== undefined ? body.phone : student.phone,
      year: body.year !== undefined ? body.year : student.year,
      status: body.status !== undefined ? body.status : student.status,
      enrolledDate: body.enrolledDate !== undefined ? body.enrolledDate : student.enrolledDate,
      dateOfBirth: body.dateOfBirth !== undefined ? body.dateOfBirth : student.dateOfBirth,
      address: body.address !== undefined ? body.address : student.address,
      emergencyContact: body.emergencyContact !== undefined ? body.emergencyContact : student.emergencyContact,
      guardianName: body.guardianName !== undefined ? body.guardianName : student.guardianName,
      bio: body.bio !== undefined ? body.bio : student.bio,
    });

    return NextResponse.json({
      message: "Student record updated successfully",
      student,
    });
  } catch (error: unknown) {
    console.error("PUT /api/students/[id] error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to update student record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    const StudentModel = await initStudentModel();
    const student = await StudentModel.findByPk(decodedId);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await student.destroy();

    return NextResponse.json({
      message: "Student record removed successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/students/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete student record" },
      { status: 500 }
    );
  }
}

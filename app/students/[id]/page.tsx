import { INITIAL_STUDENTS } from "@/lib/studentData";
import StudentDetailsClient from "./StudentDetailsClient";

export function generateStaticParams() {
  return INITIAL_STUDENTS.map((student) => ({
    id: student.id,
  }));
}

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentDetailsClient studentId={decodeURIComponent(id)} />;
}

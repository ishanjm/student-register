import { Suspense } from "react";
import StudentDetailsClient from "./StudentDetailsClient";

export const dynamic = "force-dynamic";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-xs text-slate-500">
          Loading student profile...
        </div>
      }
    >
      <StudentDetailsClient studentId={decodeURIComponent(id)} />
    </Suspense>
  );
}

import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const admin = verifyToken(token);

    const body = await req.json();
    const { class_id, subject_id, date, records } = body;

    if (!class_id || !subject_id || !date || !records)
      return Response.json({ error: "Missing fields" }, { status: 400 });

    // Remove old attendance for that date (admin update)
    await query(
      `DELETE FROM attendance WHERE class_id = ? AND subject_id = ? AND date = ?`,
      [class_id, subject_id, date]
    );

    // Insert new records
    for (const r of records) {
      await query(
        `INSERT INTO attendance (student_id, class_id, subject_id, marked_by_teacher, date, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [r.student_id, class_id, subject_id, admin.id, date, r.status]
      );
    }

    return Response.json({ message: "Attendance Saved" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}

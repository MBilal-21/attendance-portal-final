import { query } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getUserFromToken(req);

    if (!user || user.role !== "student") {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const student_user_id = user.id;

    // Fetch student record
    const student = await query(
      "SELECT id, class_id FROM students WHERE user_id = ?",
      [student_user_id]
    );

    if (!student.length) {
      return Response.json({ error: "Student record not found" }, { status: 404 });
    }

    const student_id = student[0].id;

    // Fetch attendance for this student
    const attendance = await query(
      `
      SELECT date, status 
      FROM attendance
      WHERE student_id = ?
      ORDER BY date DESC
      `,
      [student_id]
    );

    return Response.json({
      student_id,
      user_id: student_user_id,
      student_name: user.name,
      attendance,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

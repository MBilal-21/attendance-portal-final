import { query } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getUserFromToken(req);

    if (!user || user.role !== "student") {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const user_id = user.id;

    // student → students table
    const studentRows = await query(
      `SELECT s.id AS student_id, s.roll_no, s.class_id 
       FROM students s WHERE s.user_id = ?`,
      [user_id]
    );

    if (studentRows.length === 0) {
      return Response.json({ error: "Student profile not found" }, { status: 404 });
    }

    const student = studentRows[0];

    // class info
    const classRows = await query(
      `SELECT c.semester, c.section, c.start_year, 
              p.program_name
       FROM classes c
       JOIN programs p ON c.program_id = p.id
       WHERE c.id = ?`,
      [student.class_id]
    );

    const classInfo = classRows.length ? classRows[0] : {};

    // Attendance summary
    const summaryRows = await query(
      `SELECT 
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) AS absent,
        SUM(CASE WHEN status = 'Excused' OR status='Late' THEN 1 ELSE 0 END) AS leave_days
       FROM attendance
       WHERE student_id = ?`,
      [student.student_id]
    );

    const summary = summaryRows[0];

    // latest 5 attendance
    const latestAttendance = await query(
      `SELECT date, status 
       FROM attendance
       WHERE student_id = ?
       ORDER BY date DESC
       LIMIT 5`,
      [student.student_id]
    );

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      student: {
        student_id: student.student_id,
        roll_no: student.roll_no,
      },
      class: classInfo,
      attendance_summary: summary,
      latest_attendance: latestAttendance,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

import { query } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const class_id = searchParams.get("class_id");

  if (!class_id)
    return Response.json({ error: "Missing class_id" }, { status: 400 });

  try {
    const students = await query(`
      SELECT s.id, s.roll_no, u.name AS student_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.class_id = ?
      ORDER BY u.name ASC
    `, [class_id]);

    return Response.json(students);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
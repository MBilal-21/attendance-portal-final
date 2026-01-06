


import { query } from "@/lib/db";

export async function GET() {
  try {
    const students = await query(
      `SELECT s.id, s.roll_no, u.name, u.email, c.semester, p.program_name, c.section
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN classes c ON s.class_id = c.id
       JOIN programs p ON c.program_id = p.id`
    );

    // Add class_name for frontend table
    const result = students.map((s) => ({
      id: s.id,
      roll_no: s.roll_no,
      name: s.name,
      email: s.email,
      class_name: `${s.program_name} - Sem ${s.semester} (${s.section})`,
    }));

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch students" }), { status: 500 });
  }
}

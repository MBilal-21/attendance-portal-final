import { query } from "@/lib/db";

export async function GET() {
  try {
    const classes = await query(`
      SELECT c.id, 
             CONCAT(p.program_name, ' Sem-', c.semester, ' ', c.section) AS class_name
      FROM classes c
      JOIN programs p ON c.program_id = p.id
    `);

    return Response.json(classes);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

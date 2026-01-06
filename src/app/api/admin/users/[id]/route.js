import { query } from "@/lib/db";

export async function GET(req, context) {
  const { id } = await context.params;  // ✔ FIXED

  if (!id)
    return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });

  try {
    const rows = await query(
      `
      SELECT 
        u.id AS user_id,
        u.name,
        u.email,
        u.role,
        s.roll_no,
        s.class_id
      FROM users u
      LEFT JOIN students s ON s.user_id = u.id
      WHERE u.id = ?
      `,
      [id]
    );

    return new Response(JSON.stringify(rows[0] || {}), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}

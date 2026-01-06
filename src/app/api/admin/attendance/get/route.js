import { query } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const class_id = searchParams.get("class_id");
  const date = searchParams.get("date");

  if (!class_id || !date)
    return Response.json({ error: "Missing params" }, { status: 400 });

  try {
    const rows = await query(
      `
      SELECT student_id, status 
      FROM attendance 
      WHERE class_id = ? AND date = ?
    `,
      [class_id, date]
    );

    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

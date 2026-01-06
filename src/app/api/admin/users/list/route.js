import { query } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req) {
  const admin = await getUserFromToken(req);
  if (!admin || admin.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const users = await query(`
      SELECT 
        u.id, u.name, u.email, u.role, 
        s.class_id, s.roll_no
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      ORDER BY u.role, u.name
    `);

    return Response.json(users, { status: 200 });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

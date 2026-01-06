import { query } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function DELETE(req) {
  try {
    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) return new Response(JSON.stringify({ error: "Missing user id" }), { status: 400 });

    // Prevent admin from deleting themselves (safety)
    if (Number(id) === Number(admin.id)) {
      return new Response(JSON.stringify({ error: "You cannot delete your own account" }), { status: 400 });
    }

    // Ensure user exists
    const rows = await query("SELECT id, role FROM users WHERE id = ?", [id]);
    if (!rows.length) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Optionally: perform any pre-delete cleanup here (audit log, revoke tokens, etc.)

    // Delete from users table — ON DELETE CASCADE will remove dependent rows (students, assignments, attendance)
    await query("DELETE FROM users WHERE id = ?", [id]);

    return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("Delete user error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

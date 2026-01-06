import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserFromToken } from "@/lib/auth";

export async function PUT(req) {
  try {
    // Auth
    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const body = await req.json();
    const { id, name, email, password, class_id, roll_no } = body;

    // Basic validation
    if (!id || !name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: id, name, email" }), { status: 400 });
    }

    // Ensure user exists
    const userRows = await query("SELECT id, role FROM users WHERE id = ?", [id]);
    if (!userRows.length) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    const userRole = userRows[0].role;

    // Email uniqueness (exclude current user)
    const emailCheck = await query("SELECT id FROM users WHERE email = ? AND id != ?", [email, id]);
    if (emailCheck.length) {
      return new Response(JSON.stringify({ error: "Email already in use by another user" }), { status: 400 });
    }

    // If updating password: validate length (only if provided / non-empty)
    let hashedPassword = null;
    if (typeof password !== "undefined" && password !== null && String(password).trim() !== "") {
      if (String(password).length < 6) {
        return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), { status: 400 });
      }
      hashedPassword = await bcrypt.hash(String(password), 10);
    }

    // Update users table (name + email)
    await query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id]);

    // If password provided → update it
    if (hashedPassword) {
      await query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);
    }

    // If user is a student, update students table (class_id and roll_no)
    if (userRole === "student") {
      // both class_id and roll_no are required to update student mapping
      if (!class_id || !roll_no) {
        return new Response(JSON.stringify({ error: "Students must include class_id and roll_no" }), { status: 400 });
      }

      // ensure roll number uniqueness within class (exclude current user)
      const rollCheck = await query(
        "SELECT id FROM students WHERE class_id = ? AND roll_no = ? AND user_id != ?",
        [class_id, roll_no, id]
      );
      if (rollCheck.length) {
        return new Response(JSON.stringify({ error: "Roll number already assigned in this class" }), { status: 400 });
      }

      // Update or insert into students table (in case record missing)
      const studentRows = await query("SELECT id FROM students WHERE user_id = ?", [id]);
      if (studentRows.length) {
        await query("UPDATE students SET class_id = ?, roll_no = ? WHERE user_id = ?", [class_id, roll_no, id]);
      } else {
        await query("INSERT INTO students (user_id, class_id, roll_no) VALUES (?, ?, ?)", [id, class_id, roll_no]);
      }
    }

    // If role change occurred (unlikely in edit flow) - not allowed here for safety
    // (If you want to support role change, add careful logic and migrations)

    return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
  } catch (err) {
    console.error("Update user error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const admin = await getUserFromToken(req);

    if (!admin || admin.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role, class_id, roll_no } = body;

    if (!name || !email || !password || !role) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["teacher", "student"].includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    // ------------------------------------------
    // CHECK EMAIL UNIQUE
    // ------------------------------------------
    const existingEmail = await query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingEmail.length > 0) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    // ------------------------------------------
    // CHECK ROLL NUMBER UNIQUE IN CLASS
    // ------------------------------------------
    if (role === "student") {
      if (!class_id || !roll_no) {
        return Response.json({ error: "Student must have class & roll number" }, { status: 400 });
      }

      const existingRoll = await query(
        "SELECT id FROM students WHERE class_id = ? AND roll_no = ?",
        [class_id, roll_no]
      );

      if (existingRoll.length > 0) {
        return Response.json(
          { error: "Roll number already assigned in this class" },
          { status: 400 }
        );
      }
    }

    // ------------------------------------------
    // CREATE USER
    // ------------------------------------------
    const hashed = await bcrypt.hash(password, 10);

    const insertUser = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashed, role]
    );

    const user_id = insertUser.insertId;

    // ------------------------------------------
    // IF STUDENT -> ADD TO STUDENTS TABLE
    // ------------------------------------------
    if (role === "student") {
      await query(
        `INSERT INTO students (user_id, class_id, roll_no)
         VALUES (?, ?, ?)`,
        [user_id, class_id, roll_no]
      );
    }

    return Response.json(
      { message: "User added successfully", user_id },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// /app/api/admin/create-user/route.js
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req) {
  const authUser = await getUserFromToken(req);
  if (!authUser || authUser.role !== 'admin') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });

  const body = await req.json();
  const { name, email, password, role, class_id, roll_no } = body;
  if (!name || !email || !password || !role) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  if (!['teacher','student'].includes(role)) return new Response(JSON.stringify({ error: 'Invalid role' }), { status: 400 });

  // Check email uniqueness
  const exists = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (exists.length) return new Response(JSON.stringify({ error: 'Email already used' }), { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const result = await query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role]);
  const userId = result.insertId;

  if (role === 'student') {
    if (!class_id || !roll_no) return new Response(JSON.stringify({ error: 'class_id and roll_no are required for students' }), { status: 400 });
    await query('INSERT INTO students (user_id, class_id, roll_no) VALUES (?, ?, ?)', [userId, class_id, roll_no]);
  } else if (role === 'teacher') {
    await query('INSERT INTO teachers (user_id, name) VALUES (?, ?)', [userId, name]);
  }

  return new Response(JSON.stringify({ message: 'User created', userId }), { status: 201 });
}

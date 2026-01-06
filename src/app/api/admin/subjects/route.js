// /app/api/admin/subjects/route.js
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req) {
  const authUser = await getUserFromToken(req);
  if (!authUser || authUser.role !== 'admin') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });

  const { subject_name, subject_code } = await req.json();
  if (!subject_name || !subject_code) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

  const r = await query('INSERT INTO subjects (subject_name, subject_code) VALUES (?, ?)', [subject_name, subject_code]);
  return new Response(JSON.stringify({ message: 'Subject created', id: r.insertId }), { status: 201 });
}

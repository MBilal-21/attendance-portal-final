// /app/api/admin/assign/route.js
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req) {
  const authUser = await getUserFromToken(req);
  if (!authUser || authUser.role !== 'admin') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });

  const { teacher_id, class_id, subject_id } = await req.json();
  if (!teacher_id || !class_id || !subject_id) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

  // Optionally check teacher exists and class/subject exist
  await query('INSERT INTO teacher_assignments (teacher_id, class_id, subject_id) VALUES (?, ?, ?)', [teacher_id, class_id, subject_id]);
  return new Response(JSON.stringify({ message: 'Assigned' }), { status: 201 });
}

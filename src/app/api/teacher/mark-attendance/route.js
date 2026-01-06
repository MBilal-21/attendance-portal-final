// /app/api/teacher/mark-attendance/route.js
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req) {
  const authUser = await getUserFromToken(req);
  if (!authUser || authUser.role !== 'teacher') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });

  const body = await req.json();
  const { class_id, subject_id, attendance } = body;
  // attendance = [{ student_id: 1, status: 'Present' }, ...]
  if (!class_id || !subject_id || !Array.isArray(attendance)) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

  // Check teacher is assigned to this class+subject
  const assigned = await query('SELECT * FROM teacher_assignments WHERE teacher_id = ? AND class_id = ? AND subject_id = ?', [authUser.id, class_id, subject_id]);
  if (!assigned.length) return new Response(JSON.stringify({ error: 'Not assigned to this class/subject' }), { status: 403 });

  const today = new Date().toISOString().slice(0,10);

  // Optionally delete existing entries for today to prevent duplicates
  await query('DELETE FROM attendance WHERE class_id = ? AND subject_id = ? AND date = ? AND marked_by_teacher = ?', [class_id, subject_id, today, authUser.id]);

  for (const a of attendance) {
    const { student_id, status } = a;
    await query('INSERT INTO attendance (student_id, class_id, subject_id, marked_by_teacher, date, status) VALUES (?, ?, ?, ?, ?, ?)', [student_id, class_id, subject_id, authUser.id, today, status]);
  }

  return new Response(JSON.stringify({ message: 'Attendance marked' }), { status: 201 });
}

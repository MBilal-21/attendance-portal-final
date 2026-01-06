

// /app/api/admin/classes/route.js
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req) {
  const authUser = await getUserFromToken(req);
  if (!authUser || authUser.role !== 'admin') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });

  const { program_id, semester, section, intake, start_year, class_code } = await req.json();
  if (!program_id || !semester || !section || !start_year) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

  const r = await query(
    'INSERT INTO classes (program_id, semester, section, intake, start_year) VALUES (?, ?, ?, ?, ?)',
    [program_id, semester, section, intake || 'No', start_year]
  );
  // Optionally update class_code afterwards
  if (class_code) await query('UPDATE classes SET class_code = ? WHERE id = ?', [class_code, r.insertId]);

  return new Response(JSON.stringify({ message: 'Class created', id: r.insertId }), { status: 201 });
}

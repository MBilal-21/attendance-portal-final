// /app/api/admin/programs/route.js
import { query } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req) {
  const authUser = await getUserFromToken(req);
  if (!authUser || authUser.role !== 'admin') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  const { program_name } = await req.json();
  if (!program_name) return new Response(JSON.stringify({ error: 'Missing program_name' }), { status: 400 });
  const r = await query('INSERT INTO programs (program_name) VALUES (?)', [program_name]);
  return new Response(JSON.stringify({ message: 'Program added', id: r.insertId }), { status: 201 });
}

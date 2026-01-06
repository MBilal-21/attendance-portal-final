import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, setTokenCookie } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) 
    return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 });

  const users = await query('SELECT * FROM users WHERE email = ?', [email]);
  if (!users.length) 
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

  const user = users[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) 
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

  const token = signToken({ id: user.id, role: user.role });
  const res = new Response(JSON.stringify({ message: 'Logged in', role: user.role }), { status: 200 });
  setTokenCookie(res, token);
  return res;
}

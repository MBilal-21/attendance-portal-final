// /app/api/auth/logout/route.js
import cookie from 'cookie';

export async function POST() {
  const serialized = cookie.serialize(process.env.COOKIE_NAME || 'token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });
  const res = new Response(JSON.stringify({ message: 'Logged out' }), { status: 200 });
  res.headers.set('Set-Cookie', serialized);
  return res;
}

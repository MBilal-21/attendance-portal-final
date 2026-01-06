// /lib/auth.js
import jwt from 'jsonwebtoken';
import { query } from './db';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2d';
const COOKIE_NAME = process.env.COOKIE_NAME || 'token';
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || '172800'); // seconds

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function setTokenCookie(res, token) {
  const serialized = cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  res.headers.set('Set-Cookie', serialized);
}

export async function getUserFromToken(req) {
  // Try Authorization header: Bearer <token>
  const authHeader = req.headers.get('authorization') || '';
  let token = null;
  if (authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];

  // If not in header, try cookie
  if (!token) {
    const cookieHeader = req.headers.get('cookie') || '';
    if (cookieHeader) {
      const parsed = Object.fromEntries(cookieHeader.split(';').map(c => {
        const [k,v] = c.split('=');
        return [k.trim(), (v||'').trim()];
      }));
      token = parsed[process.env.COOKIE_NAME || 'token'];
    }
  }

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    // fetch user to ensure still exists
    const rows = await query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) return null;
    return { ...rows[0], tokenPayload: decoded };
  } catch (err) {
    return null;
  }
}

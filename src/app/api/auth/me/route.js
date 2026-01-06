// src/app/api/auth/me/route.js
import { getUserFromToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    // return only the fields needed by the client
    const { id, name, email, role } = user;
    return new Response(JSON.stringify({ id, name, email, role }), { status: 200 });
  } catch (err) {
    console.error("me route error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
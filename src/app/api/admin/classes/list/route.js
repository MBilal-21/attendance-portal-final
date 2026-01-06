import { query } from "@/lib/db";

export async function GET() {
  try {
    const classes = await query(
      `SELECT c.id, c.semester, c.section, p.program_name
       FROM classes c
       JOIN programs p ON c.program_id = p.id
       ORDER BY p.program_name, c.semester`
    );

    return Response.json(classes);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load classes" }, { status: 500 });
  }
}


// import { getUserFromToken } from '@/lib/auth';
// import { query } from '@/lib/db';

// export async function GET(req) {
//   const authUser = await getUserFromToken(req);
//   if (!authUser || authUser.role !== 'admin') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });

//   const rows = await query('SELECT c.*, p.program_name FROM classes c JOIN programs p ON c.program_id = p.id ORDER BY p.program_name, c.semester, c.start_year');
//   return new Response(JSON.stringify(rows), { status: 200 });
// }

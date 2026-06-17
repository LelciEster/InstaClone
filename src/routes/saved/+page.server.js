import { redirect } from '@sveltejs/kit';
import db from '$lib/server/database';

export async function load({ locals }) {
  const user = locals.user;
  if (!user) redirect(303, '/login');

  const [saved] = await db.query(`
    SELECT i.id, i.image_url, i.description
    FROM saves s
    JOIN images i ON s.image_id = i.id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC
  `, [user.id]);

  return { saved };
}

// User-Suche mit SQL LIKE
import { getUser } from '$lib/server/auth';
import db from '$lib/server/database';

export async function load({ url, cookies }) {
  const user  = await getUser(cookies);
  const query = url.searchParams.get('q')?.trim() ?? '';

  let results = [];

  if (query.length > 0) {
    const [rows] = await db.query(
      `SELECT username, first_name, last_name, avatar_url
       FROM users
       WHERE is_banned = 0
         AND (username LIKE ? OR first_name LIKE ? OR last_name LIKE ?)
       LIMIT 20`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    results = rows;
  }

  return { user, results, query };
}

// Lädt die Top 25 Bilder für den Feed
import db from '$lib/server/database';
import { getUser } from '$lib/server/auth';

export async function load({ cookies }) {
  const user = await getUser(cookies);

  // Top 25 Bilder mit Author-Info, Like- und Kommentar-Anzahl
  const [images] = await db.query(`
    SELECT
      i.id, i.image_url, i.description, i.filter, i.votes, i.created_at,
      u.username, u.avatar_url,
      COUNT(DISTINCT c.id) AS comment_count
    FROM images i
    JOIN users u ON i.author_id = u.id
    LEFT JOIN comments c ON c.image_id = i.id
    WHERE u.is_banned = 0
    GROUP BY i.id, u.username, u.avatar_url
    ORDER BY i.votes DESC, i.created_at DESC
    LIMIT 25
  `);

  // Welche Bilder hat der User schon geliked?
  let likedIds = [];
  if (user) {
    const [likes] = await db.query(
      'SELECT image_id FROM likes WHERE user_id = ?',
      [user.id]
    );
    likedIds = likes.map(l => l.image_id);
  }

  return { images, user, likedIds };
}
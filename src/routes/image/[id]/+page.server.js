// Detailseite: Bild, Like, Save, Kommentare, Report
import { error, redirect } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';
import db from '$lib/server/database';
 
export async function load({ params, cookies }) {
  const user = await getUser(cookies);
 
  // Bild mit Author laden
  const [rows] = await db.query(`
    SELECT i.*, u.username, u.avatar_url
    FROM images i
    JOIN users u ON i.author_id = u.id
    WHERE i.id = ?
  `, [params.id]);
 
  if (rows.length === 0) error(404, 'Bild nicht gefunden');
 
  // Kommentare laden
  const [comments] = await db.query(`
    SELECT c.*, u.username, u.avatar_url
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.image_id = ?
    ORDER BY c.created_at ASC
  `, [params.id]);
 
  // Like / Save Status
  let hasLiked = false;
  let hasSaved = false;
 
  if (user) {
    const [liked] = await db.query(
      'SELECT id FROM likes WHERE image_id = ? AND user_id = ?',
      [params.id, user.id]
    );
    hasLiked = liked.length > 0;
 
    const [saved] = await db.query(
      'SELECT id FROM saves WHERE image_id = ? AND user_id = ?',
      [params.id, user.id]
    );
    hasSaved = saved.length > 0;
  }
 
  return { image: rows[0], comments, user, hasLiked, hasSaved };
}
 
export const actions = {
 
  // Like toggle
  like: async ({ params, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');
 
    const [existing] = await db.query(
      'SELECT id FROM likes WHERE image_id = ? AND user_id = ?',
      [params.id, user.id]
    );
 
    if (existing.length > 0) {
      await db.query('DELETE FROM likes WHERE image_id = ? AND user_id = ?', [params.id, user.id]);
      await db.query('UPDATE images SET votes = votes - 1 WHERE id = ?', [params.id]);
    } else {
      await db.query('INSERT INTO likes (image_id, user_id) VALUES (?, ?)', [params.id, user.id]);
      await db.query('UPDATE images SET votes = votes + 1 WHERE id = ?', [params.id]);
    }
 
    return { success: true };
  },

  // Save toggle
  save: async ({ params, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');
 
    const [existing] = await db.query(
      'SELECT id FROM saves WHERE image_id = ? AND user_id = ?',
      [params.id, user.id]
    );
 
    if (existing.length > 0) {
      await db.query('DELETE FROM saves WHERE image_id = ? AND user_id = ?', [params.id, user.id]);
    } else {
      await db.query('INSERT INTO saves (image_id, user_id) VALUES (?, ?)', [params.id, user.id]);
    }
 
    return { success: true };
  },
 
  // Kommentar hinzufügen
  comment: async ({ params, request, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');
 
    const data = await request.formData();
    const text = data.get('text')?.toString().trim();
    if (!text) return { error: 'Leer.' };
 
    await db.query(
      'INSERT INTO comments (image_id, user_id, text) VALUES (?, ?, ?)',
      [params.id, user.id, text]
    );
 
    return { success: true };
  },
 
  // Kommentar löschen
  deleteComment: async ({ request, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');
 
    const data       = await request.formData();
    const comment_id = data.get('comment_id');
 
    await db.query(
      'DELETE FROM comments WHERE id = ? AND user_id = ?',
      [comment_id, user.id]
    );
 
    return { success: true };
  },
 
  // Bild melden
  report: async ({ params, request, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');
 
    const data    = await request.formData();
    const reason  = data.get('reason')?.toString() ?? 'spam';
    const message = data.get('message')?.toString().trim() ?? '';
 
    await db.query(
      'INSERT INTO reports (image_id, user_id, reason, message) VALUES (?, ?, ?, ?)',
      [params.id, user.id, reason, message]
    );
 
    return { success: true };
  }
};
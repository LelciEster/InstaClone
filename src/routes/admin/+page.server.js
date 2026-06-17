import { redirect, fail } from '@sveltejs/kit';
import { del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import db from '$lib/server/database';

export async function load({ locals }) {
  const user = locals.user;
  if (!user || user.role !== 'admin') redirect(303, '/');

  const [reports] = await db.query(`
    SELECT
      r.id, r.reason, r.message, r.created_at,
      r.image_id,
      i.image_url,
      reporter.username AS reporter,
      author.username   AS author
    FROM reports r
    JOIN images  i        ON r.image_id  = i.id
    JOIN users   reporter ON r.user_id   = reporter.id
    JOIN users   author   ON i.author_id = author.id
    WHERE r.resolved = 0
    ORDER BY r.created_at DESC
  `);

  return { reports };
}

export const actions = {

  // Report ignorieren
  dismiss: async ({ request, locals }) => {
    const user = locals.user;
    if (!user || user.role !== 'admin') redirect(303, '/');

    const data = await request.formData();
    const id   = data.get('id');
    await db.query('UPDATE reports SET resolved = 1 WHERE id = ?', [id]);
    return { success: true };
  },

  // Bild löschen + alle Reports dazu schliessen
  deleteImage: async ({ request, locals }) => {
    const user = locals.user;
    if (!user || user.role !== 'admin') redirect(303, '/');

    const data     = await request.formData();
    const image_id = data.get('image_id');

    const [rows] = await db.query('SELECT image_url FROM images WHERE id = ?', [image_id]);
    if (rows.length > 0) {
      try { await del(rows[0].image_url, { token: BLOB_READ_WRITE_TOKEN }); } catch (_) {}
    }

    await db.query('DELETE FROM images WHERE id = ?', [image_id]);
    await db.query('UPDATE reports SET resolved = 1 WHERE image_id = ?', [image_id]);
    return { success: true };
  },

  // User sperren
  ban: async ({ request, locals }) => {
    const user = locals.user;
    if (!user || user.role !== 'admin') redirect(303, '/');

    const data     = await request.formData();
    const username = data.get('username');
    await db.query('UPDATE users SET is_banned = 1 WHERE username = ?', [username]);
    await db.query(`
      UPDATE reports SET resolved = 1
      WHERE image_id IN (
        SELECT id FROM images WHERE author_id = (SELECT id FROM users WHERE username = ?)
      )
    `, [username]);
    return { success: true };
  }

};

// Profilseite: User-Info, Bilder, Edit, Delete
import { error, redirect, fail } from '@sveltejs/kit';
import { del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { getUser } from '$lib/server/auth';
import db from '$lib/server/database';

export async function load({ params, cookies }) {
  const currentUser = await getUser(cookies);

  // Profil laden
  const [users] = await db.query(
    `SELECT id, username, first_name, last_name, bio, avatar_url, created_at
     FROM users WHERE username = ? AND is_banned = 0`,
    [params.username]
  );

  if (users.length === 0) error(404, 'User nicht gefunden');

  const profile = users[0];

  // Bilder laden
  const [images] = await db.query(
    `SELECT id, image_url, description, filter, votes, created_at
     FROM images WHERE author_id = ? ORDER BY created_at DESC`,
    [profile.id]
  );

  return {
    profile,
    images,
    isOwn: currentUser?.id === profile.id
  };
}

export const actions = {

  // Caption oder Filter bearbeiten
  edit: async ({ request, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');

    const data        = await request.formData();
    const id          = data.get('id');
    const description = data.get('description')?.toString().trim() ?? '';
    const filter      = data.get('filter')?.toString() ?? 'none';

    // Sicherstellen dass das Bild dem User gehört
    const [rows] = await db.query(
      'SELECT id FROM images WHERE id = ? AND author_id = ?',
      [id, user.id]
    );
    if (rows.length === 0) return fail(403, { error: 'Nicht erlaubt.' });

    await db.query(
      'UPDATE images SET description = ?, filter = ? WHERE id = ?',
      [description, filter, id]
    );

    return { success: true };
  },

  // Bild löschen
  delete: async ({ request, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');

    const data = await request.formData();
    const id   = data.get('id');

    const [rows] = await db.query(
      'SELECT * FROM images WHERE id = ? AND author_id = ?',
      [id, user.id]
    );
    if (rows.length === 0) return fail(403, { error: 'Nicht erlaubt.' });

    // Aus Vercel Blob löschen
    try {
      await del(rows[0].image_url, { token: BLOB_READ_WRITE_TOKEN });
    } catch (_) {
      // Blob schon weg – trotzdem aus DB löschen
    }

    await db.query('DELETE FROM images WHERE id = ?', [id]);

    return { success: true };
  }
};
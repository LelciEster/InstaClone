// Settings: Account löschen
import { redirect, fail } from '@sveltejs/kit';
import { getUser, invalidateSession, clearSessionCookie } from '$lib/server/auth';
import { del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import bcrypt from 'bcrypt';
import db from '$lib/server/database';

export async function load({ cookies }) {
  const user = await getUser(cookies);
  if (!user) redirect(303, '/login');
  return { user };
}

export const actions = {
  // Account löschen
  delete: async ({ cookies, request }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');

    const data     = await request.formData();
    const password = data.get('password')?.toString();

    if (!password) return fail(400, { error: 'Passwort erforderlich.' });

    // Passwort prüfen
    const [rows] = await db.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [user.id]
    );
    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return fail(400, { error: 'Falsches Passwort.' });

    // Alle Bilder aus Vercel Blob löschen
    const [images] = await db.query(
      'SELECT image_url FROM images WHERE author_id = ?',
      [user.id]
    );
    for (const img of images) {
      try { await del(img.image_url, { token: BLOB_READ_WRITE_TOKEN }); } catch (_) {}
    }

    // Session löschen
    const sessionId = cookies.get('session_id');
    if (sessionId) await invalidateSession(sessionId);
    clearSessionCookie(cookies);

    // User löschen (Cascade löscht images, likes, saves, comments, sessions)
    await db.query('DELETE FROM users WHERE id = ?', [user.id]);

    redirect(303, '/register');
  }
};

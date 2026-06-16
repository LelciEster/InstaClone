// Upload-Seite: nur für eingeloggte User
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { getUser } from '$lib/server/auth';
import db from '$lib/server/database';

export async function load({ cookies }) {
  const user = await getUser(cookies);
  if (!user) redirect(303, '/login');
  return { user };
}

export const actions = {
  upload: async ({ request, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login');

    const formData = await request.formData();
    const file        = formData.get('image');
    const description = formData.get('description')?.toString().trim() ?? '';
    const filter      = formData.get('filter')?.toString() ?? 'none';

    // Datei validieren
    if (!file || file.size === 0) {
      return fail(400, { error: 'Bitte wähle ein Bild aus.' });
    }

    if (!file.type.startsWith('image/')) {
      return fail(400, { error: 'Nur Bilder erlaubt.' });
    }

    // Bild zu Vercel Blob hochladen
    const blob = await put(`images/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN
    });

    // In DB speichern
    await db.query(
      'INSERT INTO images (author_id, image_url, description, filter) VALUES (?, ?, ?, ?)',
      [user.id, blob.url, description, filter]
    );

    redirect(303, '/');
  }
};
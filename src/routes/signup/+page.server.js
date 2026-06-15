import { fail, redirect } from '@sveltejs/kit';
import { hashPassword } from '$lib/server/auth';
import db from '$lib/server/database';


export const actions = {
  signup: async ({ request }) => {
    const data = await request.formData();

    const first_name = data.get('first_name')?.toString().trim();
    const last_name  = data.get('last_name')?.toString().trim();
    const username   = data.get('username')?.toString().trim();
    const email      = data.get('email')?.toString().trim();
    const password   = data.get('password')?.toString();

    if (!first_name || !last_name || !username || !email || !password) {
      return fail(400, { error: 'Alle Felder sind erforderlich.' });
    }

    if (password.length < 6) {
      return fail(400, { error: 'Passwort muss mindestens 6 Zeichen lang sein.' });
    }

    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );

    if (existing.length > 0) {
      return fail(400, { error: 'Benutzername oder E-Mail bereits vergeben.' });
    }

    const password_hash = await hashPassword(password);

    await db.query(
      `INSERT INTO users (first_name, last_name, username, email, password_hash, role, is_banned)
       VALUES (?, ?, ?, ?, ?, 'user', 0)`,
      [first_name, last_name, username, email, password_hash]
    );

    redirect(303, '/login');
  }
};
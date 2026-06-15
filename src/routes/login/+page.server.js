import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import db from '$lib/server/database';

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();

    const email    = data.get('email')?.toString().trim();
    const password = data.get('password')?.toString();

    if (!email || !password) {
      return fail(400, { error: 'Alle Felder sind erforderlich.' });
    }

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return fail(400, { error: 'E-Mail oder Passwort falsch.' });
    }

    const user = rows[0];

    if (user.is_banned) {
      return fail(403, { error: 'Dieses Konto wurde gesperrt.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return fail(400, { error: 'E-Mail oder Passwort falsch.' });
    }

    // Session erstellen (crypto.randomUUID – kein extra Package nötig)
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 Tage

    await db.query(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
      [sessionId, user.id, expiresAt]
    );

    cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    });

    redirect(303, '/');
  }
};
import db from '$lib/server/database.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

// ─── Passwort ────────────────────────────────────────────────────────────────

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ─── Session erstellen ────────────────────────────────────────────────────────

export async function createSession(userId) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 Tage

  await db.query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [sessionId, userId, expiresAt]
  );

  return sessionId;
}

// ─── Session validieren ───────────────────────────────────────────────────────
// Gibt den User zurück wenn Session gültig, sonst null.
// Löscht abgelaufene Sessions automatisch.

export async function validateSession(sessionId) {
  const [rows] = await db.query(
    `SELECT u.id, u.username, u.email, u.first_name, u.last_name,
            u.avatar_url, u.bio, u.role, u.is_banned
     FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.id = ? AND s.expires_at > NOW()`,
    [sessionId]
  );

  if (rows.length === 0) {
    // Abgelaufene oder ungültige Session aufräumen
    await db.query('DELETE FROM sessions WHERE id = ? AND expires_at <= NOW()', [sessionId]);
    return null;
  }

  const user = rows[0];

  // Gebannte User werden sofort ausgeloggt
  if (user.is_banned) {
    await db.query('DELETE FROM sessions WHERE id = ?', [sessionId]);
    return null;
  }

  return user;
}

// ─── Session löschen (Logout) ─────────────────────────────────────────────────

export async function invalidateSession(sessionId) {
  await db.query('DELETE FROM sessions WHERE id = ?', [sessionId]);
}

// ─── User aus Cookie holen ────────────────────────────────────────────────────
// Wird in +layout.server.js und Guards verwendet.

export async function getUser(cookies) {
  const sessionId = cookies.get('session_id');
  if (!sessionId) return null;
  return validateSession(sessionId);
}

// ─── Cookie setzen (einheitlich) ──────────────────────────────────────────────

export function setSessionCookie(cookies, sessionId) {
  cookies.set('session_id', sessionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 Tage
  });
}

export function clearSessionCookie(cookies) {
  cookies.delete('session_id', { path: '/' });
}
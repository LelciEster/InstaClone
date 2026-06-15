import { invalidateSession, clearSessionCookie } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ cookies }) => {
    const sessionId = cookies.get('session_id');

    if (sessionId) {
      await invalidateSession(sessionId);
    }

    clearSessionCookie(cookies);
    redirect(303, '/login');
  }
};
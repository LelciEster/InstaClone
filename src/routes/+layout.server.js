import { getUser } from '$lib/server/auth';

export async function load({ cookies }) {
  const user = await getUser(cookies);
  return { user };
}
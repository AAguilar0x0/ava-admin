import RecordToType from '$lib/model';
import type User from '$lib/model/user';
import { defaultUser } from '$lib/model/user';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');

  if (!session) {
    event.locals.user = undefined;
    return await resolve(event);
  }

  event.locals.user = RecordToType<User>(JSON.parse(session), defaultUser);

  return await resolve(event);
};

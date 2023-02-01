import RecordToType from '$lib/model';
import type User from '$lib/model/user';
import { defaultUser } from '$lib/model/user';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
};

export const actions = {
  default: async ({ fetch, cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if (!email || !password) {
      return {
        status: 400,
        body: 'Missing email or password'
      };
    }

    const result = await fetch('/api/users/auth', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });
    if (!result.ok) {
      return {
        status: result.status,
        body: `${result.statusText}: ${await result.text()}`
      };
    }
    cookies.set('session', JSON.stringify(RecordToType<User>(await result.json(), defaultUser)), {
      // send cookie for every page
      path: '/',
      // server side only cookie so you can't use `document.cookie`
      httpOnly: true
      // // only requests from same site can send cookies
      // // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
      // sameSite: 'strict',
      // // only sent over HTTPS in production
      // secure: process.env.NODE_ENV === 'production',
      // // set cookie to expire after a month
      // maxAge: 60 * 60 * 24 * 30,
    });

    throw redirect(302, '/');
  }
} satisfies Actions;

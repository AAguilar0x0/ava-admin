import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';
import { post } from '$lib/template/crud';
import type { RequestHandler } from './$types';

export const POST = (async ({ fetch, request }) => {
  const body = await request.text();
  const result = await post(fetch, `${env.API_URL}/api/users/auth`, body);
  if (!result.ok) {
    return new Response(await result.text(), {
      status: result.status,
      statusText: result.statusText
    });
  }
  try {
    const data = jwt.verify(await result.json(), env.JWT_SECRET);
    return new Response(JSON.stringify(data));
  } catch (err) {
    return new Response('Invalid token', {
      status: 500
    });
  }
}) satisfies RequestHandler;

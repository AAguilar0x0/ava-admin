import { env } from '$env/dynamic/private';
import { getAll, post } from '$lib/template/crud';
import type { RequestHandler } from './$types';

export const POST = (async ({ fetch, request }) => {
  return post(fetch, `${env.API_URL}/api/details`, await request.text());
}) satisfies RequestHandler;

export const GET = (async ({ fetch }) => {
  return getAll(fetch, `${env.API_URL}/api/details`);
}) satisfies RequestHandler;

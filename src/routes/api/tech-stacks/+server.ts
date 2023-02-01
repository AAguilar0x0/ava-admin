import { env } from '$env/dynamic/private';
import { getAll, post } from '$lib/template/crud';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ fetch, request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  return post(fetch, `${env.API_URL}/api/tech-stacks`, await request.text());
}) satisfies RequestHandler;

export const GET = (async ({ fetch, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  return getAll(fetch, `${env.API_URL}/api/tech-stacks`);
}) satisfies RequestHandler;

import { env } from '$env/dynamic/private';
import { del, getOne, put } from '$lib/template/crud';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ fetch, params, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  return getOne(fetch, `${env.API_URL}/api/tech-stacks`, params.slug);
}) satisfies RequestHandler;

export const PUT = (async ({ fetch, request, params, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  return put(fetch, `${env.API_URL}/api/tech-stacks`, params.slug, await request.text());
}) satisfies RequestHandler;

export const DELETE = (async ({ fetch, params, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  return del(fetch, `${env.API_URL}/api/tech-stacks`, params.slug);
}) satisfies RequestHandler;

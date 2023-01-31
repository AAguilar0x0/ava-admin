import { env } from '$env/dynamic/private';
import { del, getOne, put } from '$lib/template/crud';
import type { RequestHandler } from './$types';

export const GET = (async ({ fetch, params }) => {
  return getOne(fetch, `${env.API_URL}/api/tech-stacks`, params.slug);
}) satisfies RequestHandler;

export const PUT = (async ({ fetch, request, params }) => {
  return put(fetch, `${env.API_URL}/api/tech-stacks`, params.slug, await request.text());
}) satisfies RequestHandler;

export const DELETE = (async ({ fetch, params }) => {
  return del(fetch, `${env.API_URL}/api/tech-stacks`, params.slug);
}) satisfies RequestHandler;

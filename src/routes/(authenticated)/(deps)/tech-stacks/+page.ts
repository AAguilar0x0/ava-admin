import RecordToType, { type ValidRecord } from '$lib/model';
import type TechStack from '$lib/model/techStack';
import { defaultTechStack } from '$lib/model/techStack';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  const result = await fetch('/api/tech-stacks');
  if (result.ok) {
    const data = (await result.json()) as ValidRecord[];
    return {
      techStack: data.map((record) => RecordToType<TechStack>(record, defaultTechStack))
    };
  }
  return error(result.status, await result.text());
}) satisfies PageLoad;

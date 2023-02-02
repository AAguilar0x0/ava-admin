import RecordToType, { type ValidRecord } from '$lib/model';
import type Project from '$lib/model/project';
import { defaultProject } from '$lib/model/project';
import type TechStack from '$lib/model/techStack';
import { defaultTechStack } from '$lib/model/techStack';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  try {
    const result = await Promise.all([fetch('/api/tech-stack'), fetch('/api/projects')]);
    for (const response of result) {
      if (!response.ok) {
        throw new Error(await response.text());
      }
    }
    const [techStack, projects]: Array<ValidRecord[]> = await Promise.all(
      result.map((response) => response.json())
    );
    return {
      techStack: techStack.map((record) => RecordToType<TechStack>(record, defaultTechStack)),
      projects: projects.map((record) => RecordToType<Project>(record, defaultProject))
    };
  } catch (err) {
    return error(500, (err as Error).message);
  }
}) satisfies PageLoad;

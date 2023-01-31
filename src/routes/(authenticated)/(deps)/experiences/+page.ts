import RecordToType, { type ValidRecord } from '$lib/model';
import type Experience from '$lib/model/experience';
import { defaultExperience } from '$lib/model/experience';
import type TechStack from '$lib/model/techStack';
import { defaultTechStack } from '$lib/model/techStack';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  try {
    const result = await Promise.all([fetch('/api/tech-stacks'), fetch('/api/experiences')]);
    const [techStack, experiences]: Array<ValidRecord[]> = await Promise.all(
      result.map((response) => response.json())
    );
    return {
      techStack: techStack.map((record) => RecordToType<TechStack>(record, defaultTechStack)),
      experiences: experiences.map((record) => RecordToType<Experience>(record, defaultExperience))
    };
  } catch (err) {
    return error(500, (err as Error).message);
  }
}) satisfies PageLoad;

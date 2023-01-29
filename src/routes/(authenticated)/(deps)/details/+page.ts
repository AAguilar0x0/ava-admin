import RecordToType, { type ValidRecord } from '$lib/model';
import type Detail from '$lib/model/detail';
import { defaultDetail } from '$lib/model/detail';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const result = await fetch('/api/details');
    if (result.ok) {
        const data = (await result.json()) as ValidRecord[];
        return {
            details: data.map((record) => RecordToType<Detail>(record, defaultDetail))
        };
    }
    return error(result.status, await result.text());
}) satisfies PageLoad;

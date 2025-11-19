import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/session';

export const load = async ({ cookies }: { cookies: any }) => {
	deleteSession(cookies);
	throw redirect(302, '/');
};

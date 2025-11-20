import { json } from '@sveltejs/kit';
import { getSession } from '$lib/server/session';
import { getFavorites, setFavorites } from '$lib/server/preferences';

export const GET = async ({ cookies }: { cookies: any }) => {
	const session = getSession(cookies);
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	try {
		const favorites = await getFavorites(session.accountId);
		return json({ favorites });
	} catch (error) {
		console.error('Error getting favorites:', error);
		return json({ error: 'Failed to get favorites' }, { status: 500 });
	}
};

export const POST = async ({ request, cookies }: { request: Request; cookies: any }) => {
	const session = getSession(cookies);
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	try {
		const { favorites } = await request.json();
		
		if (!Array.isArray(favorites)) {
			return json({ error: 'Invalid favorites data' }, { status: 400 });
		}
		
		await setFavorites(session.accountId, favorites);
		return json({ success: true, favorites });
	} catch (error) {
		console.error('Error setting favorites:', error);
		return json({ error: 'Failed to set favorites' }, { status: 500 });
	}
};

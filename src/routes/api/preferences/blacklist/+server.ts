import { json } from '@sveltejs/kit';
import { getSession } from '$lib/server/session';
import { getBlacklist, setBlacklist } from '$lib/server/preferences';

export const GET = async ({ cookies }: { cookies: any }) => {
	const session = getSession(cookies);
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	try {
		const blacklist = await getBlacklist(session.accountId);
		return json({ blacklist });
	} catch (error) {
		console.error('Error getting blacklist:', error);
		return json({ error: 'Failed to get blacklist' }, { status: 500 });
	}
};

export const POST = async ({ request, cookies }: { request: Request; cookies: any }) => {
	const session = getSession(cookies);
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	try {
		const { blacklist } = await request.json();
		
		if (!Array.isArray(blacklist)) {
			return json({ error: 'Invalid blacklist data' }, { status: 400 });
		}
		
		await setBlacklist(session.accountId, blacklist);
		return json({ success: true, blacklist });
	} catch (error) {
		console.error('Error setting blacklist:', error);
		return json({ error: 'Failed to set blacklist' }, { status: 500 });
	}
};

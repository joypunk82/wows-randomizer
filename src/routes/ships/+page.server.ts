import { redirect } from '@sveltejs/kit';
import { getSession } from '$lib/server/session';
import { getPlayerShips, getShipsEncyclopedia, type WargamingShip } from '$lib/server/wargaming';

export const load = async ({ cookies }: { cookies: any }) => {
	const session = getSession(cookies);
	
	// Redirect to home if not logged in
	if (!session) {
		throw redirect(302, '/');
	}
	
	try {
		// Get player's ships
		const playerShips = await getPlayerShips(session.accountId, session.accessToken);
		
		// Filter to only ships currently in the player's garage/port
		const shipsInPort = playerShips.filter(ship => ship.private?.in_garage === true);
		
		// Get ship IDs that the player currently owns
		const playerShipIds = new Set(shipsInPort.map(ship => ship.ship_id));
		
		// Get ship details from encyclopedia
		const shipsData = await getShipsEncyclopedia(Array.from(playerShipIds));
		
		// Convert to array and filter out null/undefined values
		// Also ensure we only include ships that the player actually owns
		const ships: WargamingShip[] = Object.values(shipsData)
			.filter((ship): ship is WargamingShip => ship !== null && ship !== undefined)
			.filter(ship => playerShipIds.has(ship.ship_id));
		
		// Get unique values for filters
		const nations = [...new Set(ships.map(s => s.nation))].sort();
		const tiers = [...new Set(ships.map(s => s.tier))].sort((a, b) => a - b);
		const types = [...new Set(ships.map(s => s.type))].sort();
		
		return {
			ships,
			nations,
			tiers,
			types,
			user: {
				nickname: session.nickname,
				accountId: session.accountId
			}
		};
	} catch (error) {
		console.error('Error loading ships:', error);
		throw redirect(302, '/?error=failed_to_load_ships');
	}
};

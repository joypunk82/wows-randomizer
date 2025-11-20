export interface SearchFilters {
	tiers: string[];
	types: string[];
	nations: string[];
	categories: string[];
	shipName: string;
}

/**
 * Parses a natural language search query and extracts filter parameters
 * Examples:
 * - "tier 10" -> tiers: ["10"]
 * - "high tier battleships" -> tiers: ["8", "9", "10", "11"], types: ["Battleship"]
 * - "Japanese cruiser" -> nations: ["japan"], types: ["Cruiser"]
 * - "premium tier 8" -> tiers: ["8"], categories: ["premium"]
 */
export function parseSearchQuery(query: string): SearchFilters {
	const lowerQuery = query.toLowerCase().trim();
	
	const filters: SearchFilters = {
		tiers: [],
		types: [],
		nations: [],
		categories: [],
		shipName: ''
	};
	
	// If empty, return empty filters
	if (!lowerQuery) {
		return filters;
	}
	
	// Track what we've matched to know if we should treat remainder as ship name
	let matchedSomething = false;
	
	// Parse Tiers
	const tierMatches = parseTiers(lowerQuery);
	if (tierMatches.length > 0) {
		filters.tiers = tierMatches;
		matchedSomething = true;
	}
	
	// Parse Types
	const typeMatches = parseTypes(lowerQuery);
	if (typeMatches.length > 0) {
		filters.types = typeMatches;
		matchedSomething = true;
	}
	
	// Parse Nations
	const nationMatches = parseNations(lowerQuery);
	if (nationMatches.length > 0) {
		filters.nations = nationMatches;
		matchedSomething = true;
	}
	
	// Parse Categories (premium/special/tech tree)
	const categoryMatches = parseCategories(lowerQuery);
	if (categoryMatches.length > 0) {
		filters.categories = categoryMatches;
		matchedSomething = true;
	}
	
	// If nothing matched, treat entire query as ship name search
	if (!matchedSomething) {
		filters.shipName = query.trim();
	} else {
		// Extract ship name by removing matched filter keywords
		const shipNameQuery = extractShipName(lowerQuery);
		if (shipNameQuery) {
			filters.shipName = shipNameQuery;
		}
	}
	
	return filters;
}

function parseTiers(query: string): string[] {
	const tiers: string[] = [];
	
	// High tier: 8-11
	if (/high\s*tier|high\s*lvl|top\s*tier/i.test(query)) {
		return ['8', '9', '10', '11'];
	}
	
	// Mid tier: 5-7
	if (/mid\s*tier|mid\s*lvl|middle\s*tier/i.test(query)) {
		return ['5', '6', '7'];
	}
	
	// Low tier: 1-4
	if (/low\s*tier|low\s*lvl|bottom\s*tier/i.test(query)) {
		return ['1', '2', '3', '4'];
	}
	
	// Superships
	if (/super\s*ship|supership|tier\s*11/i.test(query)) {
		return ['11'];
	}
	
	// Tier ranges (e.g., "tier 7-10", "t5-8", "tier 3 to 6")
	const rangePatterns = [
		/tier\s*(\d+)\s*[-–—to]\s*(\d+)/gi,
		/t(\d+)\s*[-–—to]\s*(\d+)/gi,
		/tier\s*(\d+)\s*[-–—to]\s*tier\s*(\d+)/gi,
	];
	
	for (const pattern of rangePatterns) {
		const matches = [...query.matchAll(pattern)];
		for (const match of matches) {
			const start = parseInt(match[1]);
			const end = parseInt(match[2]);
			if (start >= 1 && start <= 11 && end >= 1 && end <= 11 && start <= end) {
				for (let i = start; i <= end; i++) {
					tiers.push(i.toString());
				}
			}
		}
	}
	
	// If we found range matches, return them
	if (tiers.length > 0) {
		return [...new Set(tiers)];
	}
	
	// Specific tier numbers (tier 10, t10, tier X, etc.)
	const tierPatterns = [
		/tier\s*(\d+)/gi,
		/t(\d+)/gi,
		/tier\s*(i{1,3}|iv|v|vi{0,3}|ix|x)/gi, // Roman numerals
	];
	
	for (const pattern of tierPatterns) {
		const matches = [...query.matchAll(pattern)];
		for (const match of matches) {
			const tierStr = match[1];
			// Convert roman numerals to numbers
			const tier = convertRomanToNumber(tierStr) || tierStr;
			if (tier && parseInt(tier) >= 1 && parseInt(tier) <= 11) {
				tiers.push(tier);
			}
		}
	}
	
	return [...new Set(tiers)]; // Remove duplicates
}

function parseTypes(query: string): string[] {
	const types: string[] = [];
	
	// Battleship patterns
	if (/battleship|battle\s*ship|bb/i.test(query)) {
		types.push('Battleship');
	}
	
	// Cruiser patterns
	if (/cruiser|ca|cl/i.test(query)) {
		types.push('Cruiser');
	}
	
	// Destroyer patterns
	if (/destroyer|dd/i.test(query)) {
		types.push('Destroyer');
	}
	
	// Carrier patterns
	if (/carrier|aircraft\s*carrier|cv/i.test(query)) {
		types.push('AirCarrier');
	}
	
	// Submarine patterns
	if (/submarine|sub|ss/i.test(query)) {
		types.push('Submarine');
	}
	
	return types;
}

function parseNations(query: string): string[] {
	const nations: string[] = [];
	
	const nationMap: Record<string, string[]> = {
		'japan': ['japan', 'japanese', 'jpn', 'ijn'],
		'usa': ['usa', 'american', 'america', 'us', 'usn'],
		'ussr': ['ussr', 'soviet', 'russian', 'russia', 'vmf'],
		'germany': ['germany', 'german', 'kriegsmarine'],
		'uk': ['uk', 'british', 'britain', 'royal navy', 'rn'],
		'france': ['france', 'french'],
		'pan_asia': ['pan asia', 'pan-asia', 'panasia', 'asian'],
		'italy': ['italy', 'italian', 'regia marina'],
		'commonwealth': ['commonwealth'],
		'pan_america': ['pan america', 'pan-america', 'panamerica'],
		'europe': ['europe', 'european'],
		'netherlands': ['netherlands', 'dutch'],
		'spain': ['spain', 'spanish'],
		'portugal': ['portugal', 'portuguese']
	};
	
	for (const [nation, keywords] of Object.entries(nationMap)) {
		for (const keyword of keywords) {
			// Use word boundaries to avoid partial matches
			const regex = new RegExp(`\\b${keyword}\\b`, 'i');
			if (regex.test(query)) {
				nations.push(nation);
				break; // Only add nation once
			}
		}
	}
	
	return nations;
}

function parseCategories(query: string): string[] {
	const categories: string[] = [];
	
	// Premium ships
	if (/\bpremium\b/i.test(query)) {
		categories.push('premium');
	}
	
	// Special ships
	if (/\b(special|promo|event|reward)\b/i.test(query)) {
		categories.push('special');
	}
	
	// Tech tree ships (regular/standard/researchable)
	if (/\b(tech\s*tree|standard|regular|researchable|silver)\b/i.test(query)) {
		categories.push('tech_tree');
	}
	
	return categories;
}

function convertRomanToNumber(roman: string): string | null {
	const romanMap: Record<string, number> = {
		'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
		'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9, 'x': 10
	};
	
	const num = romanMap[roman.toLowerCase()];
	return num ? num.toString() : null;
}

function extractShipName(query: string): string {
	// Remove all known filter keywords to extract potential ship name
	let cleaned = query;
	
	// Remove tier keywords (including ranges)
	cleaned = cleaned.replace(/\b(high|mid|low|top|bottom|middle)\s*(tier|lvl)\b/gi, '');
	cleaned = cleaned.replace(/\btier\s*(\d+|i{1,3}|iv|v|vi{0,3}|ix|x)\s*[-–—to]\s*(\d+|i{1,3}|iv|v|vi{0,3}|ix|x)\b/gi, ''); // Ranges
	cleaned = cleaned.replace(/\bt(\d+)\s*[-–—to]\s*(\d+)\b/gi, ''); // t7-10 style ranges
	cleaned = cleaned.replace(/\btier\s*(\d+|i{1,3}|iv|v|vi{0,3}|ix|x)\b/gi, '');
	cleaned = cleaned.replace(/\bt(\d+)\b/gi, '');
	cleaned = cleaned.replace(/\bsuper\s*ship\b/gi, '');
	
	// Remove type keywords
	cleaned = cleaned.replace(/\b(battleship|battle\s*ship|cruiser|destroyer|carrier|aircraft\s*carrier|submarine|sub|bb|ca|cl|dd|cv|ss)\b/gi, '');
	
	// Remove nation keywords
	const nationKeywords = [
		'japan', 'japanese', 'jpn', 'ijn',
		'usa', 'american', 'america', 'us', 'usn',
		'ussr', 'soviet', 'russian', 'russia', 'vmf',
		'germany', 'german', 'kriegsmarine',
		'uk', 'british', 'britain', 'royal navy', 'rn',
		'france', 'french',
		'pan asia', 'pan-asia', 'panasia', 'asian',
		'italy', 'italian', 'regia marina',
		'commonwealth',
		'pan america', 'pan-america', 'panamerica',
		'europe', 'european',
		'netherlands', 'dutch',
		'spain', 'spanish',
		'portugal', 'portuguese'
	];
	
	for (const keyword of nationKeywords) {
		const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
		cleaned = cleaned.replace(regex, '');
	}
	
	// Remove premium/special/tech tree keywords
	cleaned = cleaned.replace(/\b(premium|special|promo|event|reward|tech\s*tree|standard|regular|researchable|silver)\b/gi, '');
	
	// Remove punctuation (commas, hyphens, etc.) that might be left over
	cleaned = cleaned.replace(/[,;]/g, ' ');
	cleaned = cleaned.replace(/[-–—]/g, ' ');
	
	// Clean up extra whitespace
	cleaned = cleaned.replace(/\s+/g, ' ').trim();
	
	return cleaned;
}

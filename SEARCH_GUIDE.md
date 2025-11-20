# Search Feature Guide

The search box supports both **ship name searches** and **natural language filter queries**.

## How It Works

Type a query in the search box and it will:
1. Parse the query for filter keywords (tiers, types, nations)
2. Automatically update the filter checkboxes
3. Search for ship names in any remaining text

## Example Queries

### Tier Searches
- `tier 10` - Shows only tier 10 ships
- `t8` - Shows only tier 8 ships
- `tier 7-10` - Shows tiers 7, 8, 9, and 10 (range)
- `t5-8` - Shows tiers 5, 6, 7, and 8 (range)
- `tier 3 to 6` - Shows tiers 3, 4, 5, and 6 (range)
- `high tier` - Shows tiers 8-11
- `mid tier` - Shows tiers 5-7
- `low tier` - Shows tiers 1-4
- `supership` - Shows tier 11 ships

### Type Searches
- `battleship` or `BB` - Shows only battleships
- `cruiser` or `CA` or `CL` - Shows only cruisers
- `destroyer` or `DD` - Shows only destroyers
- `carrier` or `CV` - Shows only aircraft carriers
- `submarine` or `sub` or `SS` - Shows only submarines

### Nation Searches
- `Japanese` or `Japan` or `IJN` - Shows Japanese ships
- `American` or `USA` or `USN` - Shows American ships
- `Soviet` or `USSR` or `Russian` - Shows Soviet ships
- `German` or `Germany` - Shows German ships
- `British` or `UK` or `Royal Navy` - Shows British ships
- `French` or `France` - Shows French ships
- `Italian` or `Italy` - Shows Italian ships
- And more...

### Combined Searches
You can combine multiple filters:
- `high tier battleship` - Tiers 8-11 + Battleships only
- `tier 7-10 cruiser` - Tiers 7-10 + Cruisers only
- `Japanese cruiser` - Japanese nation + Cruisers only
- `tier 10 American` - Tier 10 + American ships
- `german bb` - German + Battleships
- `tier 8 destroyer` - Tier 8 + Destroyers
- `t5-7 dd` - Tiers 5-7 + Destroyers

### Ship Name Searches
If no filter keywords are found, the entire query searches ship names:
- `Yamato` - Finds ships with "Yamato" in the name
- `Iowa` - Finds ships with "Iowa" in the name

You can also combine filters with ship names:
- `tier 10 yamato` - Tier 10 ships with "yamato" in name
- `american montana` - American ships with "montana" in name

## Tips
- Searches are case-insensitive
- Filter keywords are automatically applied to checkboxes
- Clear the search box to reset all filters
- Use the "Reset All Filters" button to restore defaults

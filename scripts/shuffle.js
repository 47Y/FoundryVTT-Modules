const tiles = [];
const locations = [];
const overheadTiles = [];

const changes = [];

const scene = canvas.scene;
const allTiles = scene.tiles;

// Store all unlocked tiles and their locations
allTiles.forEach(tile => {
    if (tile.locked) return;
    if (tile.elevation > 0) {
        let underTile = getTileUnderneath(tile);
        let offset = [tile.x - underTile.x, tile.y - underTile.y];
        overheadTiles.push({tile, offset});
        return;
    }
    locations.push([tile.x, tile.y]);
    tiles.push(tile);
});

while (overheadTiles.length > 0) {
    const randomLocationIndex = Math.floor(Math.random() * locations.length);
    const randomLocation = locations[randomLocationIndex];
    let overheadTile = overheadTiles.pop();
    changes.push({_id: overheadTile.tile.id, x: randomLocation[0] + overheadTile.offset[0], y: randomLocation[1] + overheadTile.offset[1]});
}

while (tiles.length > 0) {
    const randomTileIndex = Math.floor(Math.random() * tiles.length);
    const randomLocationIndex = Math.floor(Math.random() * locations.length);
    const randomTile = tiles[randomTileIndex];
    const randomLocation = locations[randomLocationIndex];

    changes.push({_id: randomTile.id, x: randomLocation[0], y: randomLocation[1]});

    // Remove the selected tile and location to avoid duplicates
    tiles.splice(randomTileIndex, 1);
    locations.splice(randomLocationIndex, 1);
}

await scene.updateEmbeddedDocuments('Tile', changes);


function getTileUnderneath(tile) {
    let shortestDistance = Infinity;
    let closestTile = null;

    allTiles.forEach(otherTile => {
        if (tile === otherTile) return;
        const distance = Math.hypot(tile.x - otherTile.x, tile.y - otherTile.y);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestTile = otherTile;
        }
    });
    return closestTile;
}
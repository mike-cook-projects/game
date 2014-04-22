angular.module("game.services.tiles", [])
  .service("Tiles", function(Tile) {
    var tiles = this;

    tiles.list = [];

    tiles.guide = null;

    tiles.addTile = function(position, options) {
      // Check if we already have a tile at this location
      var tile = tiles.findTileByPosition(position);

      // Delete any current tiles at this position
      if (tile) tiles.remove(tile);

      // Create a new tile
      tile = new Tile(position, options);

      // Set the tile index
      tile.index = tiles.list.length;

      // Add the tile
      tiles.list.push(tile);

      // Return the tile we added
      return tile;
    }

    tiles.findTileByPosition = function(position) {
      // The tile
      var foundTile = null;

      // Loop through the tiles
      angular.forEach(tiles.list, function(tile) {
        if (tile.position.x === position.x &&
            tile.position.y === position.y &&
            tile.position.z === position.z) {
          foundTile = tile;
        }
      });

      return foundTile;
    }

    tiles.remove = function(tile) {
      tiles.list.splice(tile.index, 1);
      tile = null;

      tiles.seed();
    }

    tiles.seed = function() {
      // Index set on tiles
      var index = 0;

      // Loop through the tiles and set the index
      angular.forEach(tiles.list, function(tile) {
        tile.index = index++;
      })
    }
  })
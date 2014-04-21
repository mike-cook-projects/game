'use strict';

angular.module('game', [
  'templates',
  'game.factories.tile',
  'game.directives.tile'
])
  .constant("MAP_HEIGHT", 20)
  .constant("MAP_WIDTH", 20)
  .controller("GameCtrl", function(Tile, MAP_HEIGHT, MAP_WIDTH) {
    var game = this;

    game.tileIndex = 0;

    game.tiles = [];

    game.createMap = function() {
      // Loop through the Doodle columns
      for (var x = 0; x < MAP_HEIGHT; x++) {
        // Loop through the Doodle rows
        for (var y = 0; y < MAP_WIDTH; y++) {
          var tile = new Tile(
            game,
            { x: x, y: y, z: 0 },
            { type: 'grass' }
          );
          tile.index = game.tileIndex++;
          game.tiles.push(tile);
        }
      }
    }

    game.findTileByPosition = function(position) {
      // The tile
      var foundTile = null;

      // Loop through the tiles
      angular.forEach(game.tiles, function(tile) {
        if (tile.position.x === position.x &&
            tile.position.y === position.y &&
            tile.position.z === position.z) {
          foundTile = tile;
        }
      });

      return foundTile;
    }

    game.addTile = function(position, options) {
      console.log(arguments);
      var tile = new Tile(game, position, options);

      game.tiles.push(tile);

      return tile;
    }

    game.createMap();

    console.log(game.findTileByPosition({
      x: 1,
      y: 2,
      z: 0
    }));
  })
;

'use strict';

angular.module('game', [
  'templates',
  'game.services.tiles',
  'game.factories.tile',
  'game.directives.tile'
])
  .constant("MAP_HEIGHT", 20)
  .constant("MAP_WIDTH", 20)
  .controller("GameCtrl", function(Tiles, MAP_HEIGHT, MAP_WIDTH) {
    // Namespace the game
    var game = this;

    // The list of tiles the map is tracking (from the tiles service)
    game.tiles = Tiles.list;

    //// Create a game map
    game.createMap = function() {
      // Loop through the map columns
      for (var x = 0; x < MAP_HEIGHT; x++) {
        // Loop through the map rows
        for (var y = 0; y < MAP_WIDTH; y++) {
          // Add a grass tile
          Tiles.addTile({ x: x, y: y, z: 0 }, { type: 'grass' });
        }
      }
    }

    // Create the map
    game.createMap();
  })
;

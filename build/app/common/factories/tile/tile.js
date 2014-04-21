angular.module('game.factories.tile', [])
  .constant("TILE_WIDTH", 45)
  .constant("TILE_HEIGHT", 26)
  .constant("Z_LEVEL_ADJUSTMENT", 2000)
  .constant("Z_ROW_ADJUSTMENT", 100)
  .constant("Z_OFFSET", 22)
  .factory("Tile", function(TILE_WIDTH, TILE_HEIGHT, Z_LEVEL_ADJUSTMENT, Z_ROW_ADJUSTMENT, Z_OFFSET) {
    return function Tile(game, position, options) {
      var tile = this;

      tile.game = game;

      tile.translated = { x: 0, y: 0, z: 0 };
      tile.position = { x: 0, y: 0, z: 0 };

      tile.type = options.type;

      //// Update the tile's position
      tile.setPosition = function(position) {
        // Update the position if we got new coordinates
        tile.position = {
          x: position.x || tile.position.x,
          y: position.y || tile.position.y,
          z: position.z || tile.position.z
        }

        // Update the DOM translated position (What the fuck was I thinking?)
        tile.translated = {
          // Left value
          x: TILE_HEIGHT * position.x * -1 + (position.y * TILE_HEIGHT) - (position.z * Z_OFFSET),
          // Top value
          y: TILE_WIDTH * position.x + (position.y * TILE_WIDTH),
          // Each row on top of the last, each tile in a row below the last
          z: (position.z * Z_LEVEL_ADJUSTMENT) + (position.y * Z_ROW_ADJUSTMENT) - position.x
        }
      }

      tile.remove = function() {

        tile.type = "air";
        console.log(tile.type);
      }

      tile.setPosition(position);

      //return tile;
    }
  })
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

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/directives/tile/tile.html',
    '<div id="{{ tile.data.id }}"\n' +
    '     style="z-index: {{ tile.data.translated.z }}; left: {{ tile.data.translated.y }}px; top: {{ tile.data.translated.x }}px;"\n' +
    '     class="tile {{ tile.data.type }}">\n' +
    '  <div ng-click="tile.onClick($event)"\n' +
    '       ng-mouseenter="tile.onMouseenter($event)"\n' +
    '       ng-mouseout="tile.onMouseout($event)"\n' +
    '       class="face top"></div>\n' +
    '  <div ng-click="tile.onClick($event)"\n' +
    '       ng-mouseenter="tile.onMouseenter($event)"\n' +
    '       ng-mouseout="tile.onMouseout($event)"\n' +
    '       class="face left thin_face"></div>\n' +
    '  <div ng-click="tile.onClick($event)"\n' +
    '       ng-mouseenter="tile.onMouseenter($event)"\n' +
    '       ng-mouseout="tile.onMouseout($event)"\n' +
    '       class="face right thin_face"></div>\n' +
    '</div>');
}]);
})();

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
angular.module('game.factories.tile', [])
  .constant("TILE_WIDTH", 45)
  .constant("TILE_HEIGHT", 26)
  .constant("Z_LEVEL_ADJUSTMENT", 2000)
  .constant("Z_ROW_ADJUSTMENT", 100)
  .constant("Z_OFFSET", 22)
  .factory("Tile", function(TILE_WIDTH, TILE_HEIGHT, Z_LEVEL_ADJUSTMENT, Z_ROW_ADJUSTMENT, Z_OFFSET) {
    return function Tile(position, options) {
      var tile = this;

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

      tile.setPosition(position);
    }
  })
angular.module('game.directives.tile', [])
  .controller("TileCtrl", function(Tiles) {
    var tile = this;

    tile.setupTile = function() {
      // Check if this is a ghost block (you click through it)
      if (tile.data.type === "guide") {
        // Ignore clicks
        tile.element.css("pointer-events", "none");
      }
    }

    tile.onClick = function($event) {
      // Remove any guides
      if (Tiles.guide) {
        Tiles.remove(Tiles.guide);
        Tiles.guide = null;
        console.log("removed it", Tiles.guide);
      }

      // Check if shift is being held
      if ($event.shiftKey) {
        Tiles.remove(tile.data);

        // Exit
        return false;
      }

      // Grab the face we want to monitor
      var face = angular.element($event.toElement);

      // Adjust the position based on the face we are over
      var position = {
        x: face.hasClass("left") ? tile.data.position.x - 1 :
                                   tile.data.position.x,
        y: face.hasClass("right") ? tile.data.position.y + 1 :
                                    tile.data.position.y,
        z: face.hasClass("top") ? tile.data.position.z + 1 :
                                  tile.data.position.z
      }

      Tiles.addTile(position, { type: "grass" });



      // Get the tile id
      /*var id = element.id;

      // Split out the id
      var id_split = id.split("_");

      // Get the various attributes
      var col = parseInt(id_split[1]);
      var row = parseInt(id_split[2]);
      var level = parseInt(id_split[3]);

      // Adjust the values
      col = $(this).hasClass("left") ? col - 1 : col;
      row = $(this).hasClass("right") ? row + 1 : row;
      level = $(this).hasClass("top") ? level + 1 : level;


      // Get the type
      var type = $("#tile_type").val();

      // Create a new tile
      $("#map").append(Doodle.createTile(col, row, level, type));*/
    }

    tile.onMouseenter = function($event) {
      // If this is a guide tile, we don't care
      if (tile.data.type === "guide") return false;

      // Grab the face we want to monitor
      var face = angular.element($event.toElement);

      // Adjust the position based on the face we are over
      var position = {
        x: face.hasClass("left") ? tile.data.position.x - 1 :
                                   tile.data.position.x,
        y: face.hasClass("right") ? tile.data.position.y + 1 :
                                    tile.data.position.y,
        z: face.hasClass("top") ? tile.data.position.z + 1 :
                                  tile.data.position.z
      }

      // Create a new tile
      Tiles.guide = Tiles.addTile(position, { type: "guide" })
    }

    tile.onMouseout = function() {
      console.log("removing?", Tiles.guide);
      if (Tiles.guide) Tiles.remove(Tiles.guide);
    }

    // Set the onClick function
    /*$(tile).children(".top, .left, .right").click(Doodle.onTileClick);

    // Set the over / out functions
    $(tile).children(".top, .left, .right").mouseover(Doodle.onTileOver);
    $(tile).children(".top, .left, .right").mouseout(Doodle.onTileOut);*/

    // Send the tile back
    //return tile;
  })
  .directive("tile", function() {
    return {
      restrict: "E",
      controller: "TileCtrl as tile",
      templateUrl: 'common/directives/tile/tile.html',
      scope: {
        ngModel: "="
      },
      link: function(scope, element, attrs, tile) {
        tile.element = element;
        tile.data = scope.ngModel;

        // Setup any special behavior
        tile.setupTile();
      }
    }
  })
;

//////////////////////////////////////////////////////////////////////////////////////////
// 3D Doodle                      //
// Author: Mike Cook                      //
// Date: 10/03/12                 //
// Description: Controller for drawing and manipulating tiles on the screen   //
//////////////////////////////////////////////////////////////////////////////////////////
/*var Doodle = {
  // "Constants"
  DOODLE_WIDTH: 20, // The number of cells on the x-axis
  DOODLE_HEIGHT: 20, // The number of cells on the y-axis

  // The state of the mouse click
  leftDown: false,

  // The level currently locked
  lockedLevel: -1,

  //// Initialization
  init: function () {
    // Set yp the map
    Doodle.setupMap();

    // The current step
    var current_step = 0;

    // Create the doodle table
    Doodle.createDoodleTable();
  },

  //// Set up the map
  setupMap: function () {
    // Bind the mouse down event
    $("#map").mousedown(function () {
      // Set the flag
      Doodle.leftDown = true;
    });

    // Bind the mouse up event
    $("#map").mouseup(function () {
      // Set the flag
      Doodle.leftDown = false;

      // Reset the locked level
      Doodle.lockedLevel = -1;
    });

    // Bind the mouse out event
    $("#map").mouseout(function () {
      // Set the flag
      Doodle.leftDown = false;

      // Reset the locked level
      Doodle.lockedLevel = -1;
    });
  },

  //// Create the doodle table
  // p_type: The type of tile to use for the base layer
  createDoodleTable: function (p_type) {
    // Set default for type
    p_type = p_type || "grass";

    // Remove any existing table
    $("#map").children().remove();


  },

  //// Create a tile on the map
  // p_position: The position in the row (x-axis)
  // p_row: The row to place the tile in (y-axis)
  // p_level: The level to place the tile on (z-axis)
  // p_type: The type of tile to place
  createTile: function (p_position, p_row, p_level, p_type) {
    // Set default for p_type
    p_type = typeof p_type === "undefined" ? "" : " " + p_type;

    // Create the tile container
    var tile = document.createElement("div");

    // Set the ID and class
    tile.id = "cell_" + p_position + "_" + p_row + "_" + p_level;
    tile.className = "tile" + p_type;

    // Create the left face and set the class
    var left_face = document.createElement("div");
    left_face.className = "face left thin_face";

    // Create the right face and set the class
    var right_face = document.createElement("div");
    right_face.className = "face right thin_face";

    // Create the top face
    var top_face = document.createElement("div");
    top_face.className = "face top";

    // Add the faces to the tile
    tile.appendChild(left_face);
    tile.appendChild(right_face);
    tile.appendChild(top_face);

    // Get the row offset
    var row_left_offset = p_row * 45;
    var row_top_offset = p_row * 26;

    // Get the level offset
    var level_offset_top = p_level * 22;

    // Set the tile's position and z-index information
    $(tile).css({

      zIndex: (p_level * 2000) + (p_row * 100) - p_position,

      left: (45 * p_position + row_left_offset) + 'px',

      top: (26 * p_position * -1 + row_top_offset - level_offset_top) + 'px'
    });

    // Check if this is a ghost block (you click through it)
    if (p_type === " guide") {
      // Ignore clicks
      $(tile).css("pointer-events", "none");
    }

    // Set the onClick function
    $(tile).children(".top, .left, .right").click(Doodle.onTileClick);

    // Set the over / out functions
    $(tile).children(".top, .left, .right").mouseover(Doodle.onTileOver);
    $(tile).children(".top, .left, .right").mouseout(Doodle.onTileOut);

    // Send the tile back
    return tile;
  },

  //// Event for clicking a tile
  // p_event: The event object for the click event
  onTileClick: function (p_event) {
    // Set default for p_event
    p_event = p_event || window.event;

    // The element (this or the parent)
    var element = $(this).hasClass("tile") ? this : $(this).parent()[0];

    // Check if shift is being held
    if (p_event.shiftKey) {
      // Remove the element
      $(element).remove();

      // Remove any guides
      $(".guide").remove();

      // Exit
      return false;
    }

    // Get the tile id
    var id = element.id;

    // Split out the id
    var id_split = id.split("_");

    // Get the various attributes
    var col = parseInt(id_split[1]);
    var row = parseInt(id_split[2]);
    var level = parseInt(id_split[3]);

    // Adjust the values
    col = $(this).hasClass("left") ? col - 1 : col;
    row = $(this).hasClass("right") ? row + 1 : row;
    level = $(this).hasClass("top") ? level + 1 : level;


    // Get the type
    var type = $("#tile_type").val();

    // Create a new tile
    $("#map").append(Doodle.createTile(col, row, level, type));
  },

  //// Event for mouseover on a tile
  // p_event: The mouseover event object
  onTileOver: function (p_event) {
    // Set default for p_event
    p_event = p_event || window.event;

    // The element (this or the parent)
    var element = $(this).hasClass("tile") ? this : $(this).parent()[0];

    // Get the tile id
    var id = element.id;

    // Split out the id
    var id_split = id.split("_");

    // Get the various attributes
    var col = parseInt(id_split[1]);
    var row = parseInt(id_split[2]);
    var level = parseInt(id_split[3]);

    // Adjust the values
    col = $(this).hasClass("left") ? col - 1 : col;
    row = $(this).hasClass("right") ? row + 1 : row;
    level = $(this).hasClass("top") ? level + 1 : level;

    // Create a new tile
    $("#map").append(Doodle.createTile(col, row, level, "guide"));
  },

  //// The mouseout event for a tile
  // p_event: The mouseout event object
  onTileOut: function (p_event) {
    // Remove any guide tiles
    $(".guide").remove();
  },

  //// Set an element to a gradient color based on a 0 to 100 value
  // p_element: Element to set color of
  // p_value: 0 - 100 value to use
  setGradient: function (p_element, p_value) {
    // The numeric gradient value
    var gradient = 0;

    // The hex color string
    var hex_color = "#EEEEEE";

    // Check if we have a 0 value
    if (p_value > 0) {
      // Set the gradient value (and convert to Int)
      gradient = 255 - parseInt((p_value / 100) * 255);
    }

    // Set the color of the element
    $(p_element).css("background-color", "rgb(" + gradient + ", 255, " + gradient + ")");

    // Show the element
    $(p_element).css("visibility", "visible");
  },

  //// DEBUG: Used for creating storage object
  // p_type: Numeric type if of the tile
  getTileType: function (p_type) {
    switch (p_type) {
    case 0:
      return "grass";
      break;
    case 1:
      return "sand";
      break;
    case 2:
      return "grey";
      break;
    case 3:
      return "water";
      break;
    default:
      return "grey";
    }
  },

  //// Convert the tile layout into a JSON object
  mapToJson: function () {
    // Tile string
    var tiles = "";

    // Loop through the doodle rows
    $(".tile").each(function () {
      // Make sure this isn't a guide block
      if ($(this).hasClass("guide")) {
        return false;
      }

      // Split the id
      var id_split = this.id.split("_");

      // The type
      var type = 0;

      // Check if this is sand
      if ($(this).hasClass("sand")) {
        type = 1;
      } else if ($(this).hasClass("grey")) {
        type = 2;
      } else if ($(this).hasClass("water")) {
        type = 3;
      } else {
        type = 0;
      }

      // Get the values
      var col = parseInt(id_split[1]);
      var row = parseInt(id_split[2]);
      var level = parseInt(id_split[3]);

      // Add the tile
      tiles += Doodle.encodeTileFormat(col) +
        Doodle.encodeTileFormat(row) +
        Doodle.encodeTileFormat(level) +
        Doodle.encodeTileFormat(type);
    });

    alert(tiles);
  },

  //// Encode a base19 value for the tile
  // p_tile_value: Convert base10 numeric into base19 alphanumeric
  encodeTileFormat: function (p_tile_value) {
    switch (p_tile_value) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return p_tile_value.toString();
    case 10:
      return "a";
    case 11:
      return "b";
    case 12:
      return "c";
    case 13:
      return "d";
    case 14:
      return "e";
    case 15:
      return "f";
    case 16:
      return "g";
    case 17:
      return "h";
    case 18:
      return "i";
    case 19:
      return "j";
    }
  },

  //// Dencode a base19 value for the tile
  // p_tile_value: Convert base19 alphanumeric into base10 numeric
  decodeTileFormat: function (p_tile_value) {
    switch (p_tile_value) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      return parseInt(p_tile_value);
    case "a":
      return 10;
    case "b":
      return 11;
    case "c":
      return 12;
    case "d":
      return 13;
    case "e":
      return 14;
    case "f":
      return 15;
    case "g":
      return 16;
    case "h":
      return 17;
    case "i":
      return 18;
    case "j":
      return 19;
    }
  }
};

// OnReady function
$(document).ready(function () {
  // Solve the doodle and display the result
  Doodle.init();

  $("#base_type").change(function () {
    Doodle.createDoodleTable($("#base_type").val());
  });
});*/
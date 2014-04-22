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

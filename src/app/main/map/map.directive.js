(function () {
  'use strict';

  angular
    .module('insightImaging')
    .directive('laMap', laMap);

  function laMap(L) {
    function link(scope, element, attrs) {
      var map = L.map('map', {
        zoomControl: true,
        attributionControl: true
      }).setView([51.5252, -0.0902], 15);
      var tileUrl = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>';
      var ostrLayer = L.tileLayer(tileUrl, {
        id: 'OSTR',
        minZoom: 7,
        maxZoom: 18,
        detectRetina: 'False',
        attribution: osmAttrib
      });
      ostrLayer.addTo(map);
    }

    function controller() {
    }

    return {
      priority: 2,
      restrict: 'E',
      templateUrl: 'app/main/map/map.directive.html',
      link: link,
      controller: controller,
      controllerAs: 'vm',
      bindToController: true
    }
  }

})();

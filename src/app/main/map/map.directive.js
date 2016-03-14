(function () {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .directive('iiMap', iiMap);

  function iiMap(L, firebaseService) {
    function link(scope) {
      var osAttrib = '&copy; <a href="https://www.os.uk/copyright">Ordnance Survey</a>';
      var osKey = 'FBgTnDiN4gVpi2a1tGAnWpvXEXcnHOlN';
      var osUrlRoad = 'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/Road 3857/{z}/{x}/{y}.png?key='+osKey;
      var osRoad = L.tileLayer(osUrlRoad, {id: 'OS Road', maxZoom: 20, attribution: osAttrib});

      var osUrlOutdoor = 'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/Outdoor 3857/{z}/{x}/{y}.png?key='+osKey;
      var osOutdoor = L.tileLayer(osUrlOutdoor, {id: 'OS Outdoor', maxZoom: 20, attribution: osAttrib});

      var osUrlLight = 'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/Light 3857/{z}/{x}/{y}.png?key='+osKey;
      var osLight = L.tileLayer(osUrlLight, {id: 'OS Light', maxZoom: 20, attribution: osAttrib});

      var osUrlNight = 'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/Night 3857/{z}/{x}/{y}.png?key='+osKey;
      var osNight = L.tileLayer(osUrlNight, {id: 'OS Night', maxZoom: 20, attribution: osAttrib});

      var googleAttrib = '&copy; <a href="http://maps.google.com">Google</a>';
      var googleTileUrl = 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}';
      var google = L.tileLayer(googleTileUrl, {id: 'Google', maxZoom: 20, attribution: googleAttrib});

      var googleUrlSat ='http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';

      var googleSat = L.tileLayer(googleUrlSat,{
        id:'GoogleSat',
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: googleAttrib
      });

      var googleUrlTerrain = 'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      var googleTerrain = L.tileLayer(googleUrlTerrain,{
        id:'GoogleTerrain',
        maxZoom: 15,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: googleAttrib
      });

      var osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      var osmTileUrl = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osm = L.tileLayer(osmTileUrl, {id: 'OSM', maxZoom: 19, attribution: osmAttrib});

      var baseLayers = {
        'OS Outdoor': osOutdoor,
        'OS Road': osRoad,
        'OS Light': osLight,
        'OS Night': osNight,
        'OpenStreetMap': osm,
        'Google Maps': google,
        'Google Sat': googleSat,
        'Google Terrain': googleTerrain
      };

      var map = L.map('map', {
        center: [51.5252, -0.0902],
        zoom: 18,
        layers: [osRoad]
      });

      L.control.layers(baseLayers).addTo(map);

      var drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      var droneMarker = L.Icon.extend({
        options: {
          iconAnchor: new L.Point(17, 15),
          iconSize: new L.Point(35, 30),
          iconUrl: 'app/main/assets/drone.png'
        }
      });

      var drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          polyline: false,
          circle: false,
          rectangle: false,
          polygon: false,
          marker: { icon: new droneMarker() }
        },
        edit: {
          featureGroup: drawnItems,
          edit: false,
          remove: true
        }
      });
      map.addControl(drawControl);

      function addMarker(key, marker) {
        var icon = droneMarker.extend({ options: { className: 'marker-' + marker.progress } });
        var mark = L.marker(marker.coords, { key: key, icon: new icon });
        var circle = new L.circle(marker.coords, 50, { color: 'red', fillColor: 'red', fillOpacity: 0.5 });
        mark.on('remove', function () {
          circle.setStyle({ opacity: 0, fillOpacity: 0 });
        });
        mark.on('add', function () {
          circle.setStyle({ opacity: 1, fillOpacity: 0.5 });
        });
        drawnItems.addLayer(mark);
        map.addLayer(circle);
        map.addLayer(mark);
      }

      map.whenReady(function () {
        firebaseService.loadUserMarkers().then(function (markers) {
          if (markers) Object.keys(markers).forEach(function (key) {
            addMarker(key, markers[key])
          });
        });
      });

      map.on('draw:created', function (event) {
        var marker = {
          coords: event.layer._latlng,
          progress: 'backlog'
        }
        firebaseService.saveMarker(marker)
          .then(function (result) { addMarker(result.key(), marker); })
      });

      map.on('draw:deleted', function (event) {
        event.layers.eachLayer(function (layer) {
          firebaseService.deleteMarker(layer.options.key)
        });
      });

    }

    return {
      restrict: 'E',
      templateUrl: 'app/main/map/map.directive.html',
      link: link
    };

  }

})();

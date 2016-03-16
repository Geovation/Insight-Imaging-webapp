(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .service('baseLayersService', baseLayersService);

  /** @ngInject */
  function baseLayersService(L) {
      
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

    var service = {
        baseLayers : baseLayers
    };

    return service;

  }

})();

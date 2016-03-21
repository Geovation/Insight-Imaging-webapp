(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .factory('baseLayersService', baseLayersService);

  /** @ngInject */
  function baseLayersService(L, osKey, baseLayerUrl, baseLayerAttr) {

    // Ordnance Survey
    var osRoad = L.tileLayer(baseLayerUrl["OS Road"] + osKey, {
      id: 'OS Road',
      maxZoom: 20,
      attribution: baseLayerAttr["OS"]
    });
    var osOutdoor = L.tileLayer(baseLayerUrl["OS Outdoor"] + osKey, {
      id: 'OS Outdoor',
      maxZoom: 20,
      attribution: baseLayerAttr["OS"]
    });
    var osLight = L.tileLayer(baseLayerUrl["OS Light"] + osKey, {
      id: 'OS Light',
      maxZoom: 20,
      attribution: baseLayerAttr["OS"]
    });
    var osNight = L.tileLayer(baseLayerUrl["OS Night"] + osKey, {
      id: 'OS Night',
      maxZoom: 20,
      attribution: baseLayerAttr["OS"]
    });

    // Google
    var google = L.tileLayer(baseLayerUrl["Google"], {
      id: 'Google',
      maxZoom: 20,
      attribution: baseLayerAttr["Google"]
    });

    var googleSat = L.tileLayer(baseLayerUrl["Google Sat"],{
      id:'GoogleSat',
      maxZoom: 20,
      subdomains: ['mt0','mt1','mt2','mt3'],
      attribution: baseLayerAttr["Google"]
    });

    var googleTerrain = L.tileLayer(baseLayerUrl["Google Terrain"],{
      id:'GoogleTerrain',
      maxZoom: 15,
      subdomains: ['mt0','mt1','mt2','mt3'],
      attribution: baseLayerAttr["Google"]
    });

    // OSM
    var osm = L.tileLayer(baseLayerUrl["OSM"], {
      id: 'OSM',
      maxZoom: 19,
      attribution: baseLayerAttr["OSM"]
    });

    // Tie them all together in an object
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

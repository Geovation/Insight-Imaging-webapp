/* global Firebase, L*/
(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .constant('Firebase', Firebase)
    .constant('L', L)
    .constant('osKey', 'FBgTnDiN4gVpi2a1tGAnWpvXEXcnHOlN')
    .constant('baseLayerUrl', {
      'OS Road' : 'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/Road 3857/{z}/{x}/{y}.png?key=',
      'OS Outdoor': 'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/Outdoor 3857/{z}/{x}/{y}.png?key=',
      'OS Light': 'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/Light 3857/{z}/{x}/{y}.png?key=',
      'OS Night': 'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/Night 3857/{z}/{x}/{y}.png?key=',
      'Google': 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
      'Google Sat': 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      'Google Terrain':'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      'OSM':'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
    .constant('baseLayerAttr', {
      'Google': '&copy; <a href="http://maps.google.com">Google</a>',
      'OS': '&copy; <a href="https://www.os.uk/copyright">Ordnance Survey</a>',
      'OSM': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });



})();

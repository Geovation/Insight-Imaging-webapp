(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .service('mapService', mapService);

  /** @ngInject */
  function mapService(L, baseLayersService, firebaseService, $mdDialog) {
      var map;
      var drawnItems;

      var service = {
          returnMap  : returnMap
      };

      return service;

      ///////////////////////////// LOGIC ////////////////////////////////


      /**
       * returnMap - returns the map object or initialises it if it doesn't exist
       *
       * @return {Object}  returns the map object
       */
      function returnMap(){
          if (!map) {
              _init();
          }
          return map;
      }


      /**
       * _init - initialise the map and all listners
       *
       */
      function _init() {

          var baseLayers = baseLayersService.baseLayers;
          var deleting;
          var editing;

          map = L.map('map', {
            center: [51.5252, -0.0902],
            zoom: 18,
            layers: [ baseLayers["OS Road"] ]
          });

          // Fix for map resize
          angular.element(document).ready(function() {
              map.invalidateSize();
            });

          L.control.layers(baseLayers).addTo(map);

          drawnItems = new L.FeatureGroup();
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
              edit: true,
              remove: true
            }
          });
          map.addControl(drawControl);

          map.whenReady(function () {
            firebaseService.loadUserMarkers().then(function (markers) {
              if (markers) Object.keys(markers).forEach(function (key) {
                addMarker(key, markers[key]);
              });
            });
          });

          map.on('draw:deletestart', function (event) {
            deleting = true;
          });

          map.on('draw:deletestop', function(event) {
            deleting = false;
          });

          map.on('draw:editstart', function (event) {
            editing = true;
          });

          map.on('draw:editstop', function(event) {
            editing = false;
          });

          map.on('draw:created', function (event) {
            var marker = {
              coords: event.layer._latlng,
              progress: 'backlog',
              properties: undefined
            };

            showDialog().then(function(markerDetails){
              marker.properties = markerDetails;
              firebaseService.saveMarker(marker)
                .then(function (result) {
                  addMarker(result.key(), marker);
                });
            });

          });

          map.on('draw:deleted', function (event) {
            event.layers.eachLayer(function (layer) {
              firebaseService.deleteMarker(layer.options.key);
            });
          });


          function showDialog(properties) {
            return $mdDialog.show({
              templateUrl: "app/components/dialog/dialog.html",
              controller : DialogController,
              controllerAs : "vm",
              bindToController : true,
              locals: {
                 properties : properties
               }
            });
          }

          /**
           * addMarker - Adds a marker to the map representing a drone
           *
           * @param  {string} key    the Firebase unique indentifying key
           * @param  {Object} marker an object containing coords and a progress status
           */
          function addMarker(key, marker) {

            var icon = droneMarker.extend({ options: { className: 'marker-' + marker.progress } });
            var mark = L.marker(marker.coords, { key: key, icon: new icon() });
            var circle = new L.circle(marker.coords, 50, { color: '#FF6060', fillColor: '#FF6060', fillOpacity: 0.5 });

            // Change style to see through when we delete and then visible when we add
            mark.on('remove', function () {
              circle.setStyle({ opacity: 0, fillOpacity: 0 });
            });
            mark.on('add', function () {
              circle.setStyle({ opacity: 1, fillOpacity: 0.5 });
            });

            // If we click on a marker and not deleting show the dialog box with the marker info
            mark.on('click', function(){
              if (!deleting) {
                showDialog(marker.properties).then(function(updatedProperties){
                  marker.properties = updatedProperties; // Update clientside marker properties
                  firebaseService.updateMarkerProperties(key, updatedProperties); // Update firebase marker properties
                });
              }
            });

            // Code for moving the circle along with the marker during editing
            mark.on('mousedown', function () {
             if (editing) {
               map.on('mousemove', function (e) {
                 circle.setLatLng(e.latlng);
               });
             }
            });
            map.on('mouseup',function(e){
              map.removeEventListener('mousemove');
            });

            // Add everything to the map
            drawnItems.addLayer(mark);
            map.addLayer(circle);
            map.addLayer(mark);
          }


          /**
           * DialogController - handles the dialog responsible for logging information
           *
           * @return {Object} - The survey data returned from the inputs
           */
          function DialogController(properties) {
              var vm = this;

              if (properties) { // Properties already exists
                vm.surveyRequester = properties.surveyRequester;
                vm.dateRequested = properties.dateRequested;
                vm.surveyIdentifier = properties.surveyIdentifier ;
                vm.surveyDescription = properties.surveyDescription;
                vm.surveyImageryUrl = "https://upload.wikimedia.org/wikipedia/commons/3/35/Gujarat_Satellite_Imagery_2012.jpg"; //properties.surveyImageryUrl;
              }
              else { // Creating dialog for the first time
                vm.surveyRequester = firebaseService.getUserName(); // Perhaps  try to auto complete?
                vm.dateRequested = new Date().getTime();
                vm.surveyIdentifier = "";
                vm.surveyDescription = "";
                vm.surveyImageryUrl = "";
              }

              vm.onChange = onChange;
              vm.closeDialog = closeDialog;


              function onChange() {
                //console.log(vm.name);
              }

              function closeDialog() {
                $mdDialog.hide({
                  "surveyRequester"   : vm.surveyRequester,
                  "dateRequested"     : vm.dateRequested,
                  "surveyIdentifier"  : vm.surveyIdentifier,
                  "surveyDescription" : vm.surveyDescription
                });
              }

          }

      }

  }

})();
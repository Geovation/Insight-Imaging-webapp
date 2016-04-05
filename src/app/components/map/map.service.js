(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .factory('mapService', mapService);

  /** @ngInject */
  function mapService($log, L, baseLayersService, firebaseService, $mdDialog, progressColors, mapConfig) {
      var map;
      var drawnItems;
      var surveys = [];

      var service = {
          returnMap  : returnMap,
          getSurveys : getSurveys
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

      function getSurveys() {
        return surveys;
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
            center: mapConfig["center"],
            zoom: mapConfig["zoom"],
            layers: [ baseLayers["OS Road"] ]
          });

          // Fix for map resize
          angular.element(document).ready(function() {
            map.invalidateSize();
          });

          // Geolocation
          L.control.locate({
            icon: mapConfig["locateIcon"],
            iconLoading: mapConfig["locateIconSpin"]
          }).addTo(map);
          var geolocate = document.querySelector(".leaflet-control-locate .material-icons");
          geolocate.innerHTML = "location_searching"; // Change to the Material Design search icon
          map.on('locationfound', function() {
            geolocate.innerHTML = "my_location"; // Change icon to a Material Design located icon
          });

          // Basemaps
          L.control.layers(baseLayers).addTo(map);

          // Drawn Items
          drawnItems = new L.FeatureGroup();
          map.addLayer(drawnItems);

          var droneIcon = L.Icon.extend({
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
              marker: { icon: new droneIcon() }
            },
            edit: {
              featureGroup: drawnItems,
              edit: true,
              remove: true
            }
          });
          map.addControl(drawControl);


          firebaseService.isAdmin().then(function(admin){
            if (admin) {
              // If the user is an administrator
              $log.log("Admin");
              map.whenReady(function () {
                firebaseService.loadAllUserMarkers().then(function (users) {
                  if (users) Object.keys(users).forEach(function (uid) {
                    var surveys = users[uid].jobs;
                    if (surveys) Object.keys(surveys).forEach(function (key) {
                      addMarker(key, surveys[key]);
                    });
                  });
                }).catch(function(error){
                  $log.log("Error: ", error);
                });
              });
            }
            else {
              // If the user is just a normal user
              $log.log("User");
              map.whenReady(function () {
                firebaseService.loadUserMarkers().then(function (surveys) {
                  if (surveys) {
                    Object.keys(surveys).forEach(function (key) {
                      addMarker(key, surveys[key]);
                    });
                  }
                });
              });
            }
          });

          var search = document.getElementsByClassName("ii-search")[0];
          map.on('draw:deletestart', function () {
            deleting = true;
            search.disabled = true;
            search.style.opacity = 0.15;
          });

          map.on('draw:deletestop', function() {
            deleting = false;
            search.disabled = false;
            search.style.opacity = 1;
          });

          map.on('draw:editstart', function () {
            editing = true;
          });

          map.on('draw:editstop', function() {
            editing = false;
          });

          map.on('draw:created', function (event) {
            if (event.layer && event.layer._latlng) {
              var surveyDetails = {
                coords: event.layer._latlng,
                properties: undefined
              };
              showDialog().then(function(vmSurveyDetails){
                surveyDetails.properties = vmSurveyDetails;

                firebaseService.saveMarker(surveyDetails)
                  .then(function (result) {
                    addMarker(result.key(), surveyDetails);
                  });
              });
            }
          });

          map.on('draw:deleted', function (event) {
            event.layers.eachLayer(function (layer) {

              if (surveys.length) {
                for (var i=0; i< surveys.length; i++) {
                  if (surveys[i].options.key === layer.options.key) {
                    surveys.splice(i, 1);
                  }
                }
              }

              firebaseService.deleteMarker(layer.options.key);
            });
          });


          /**
           * showDialog - Shows a dialog upon clicking on a marker
           *
           * @param   {string} properties - The properties to show in the dialog
           * @return  {Object} - The dialog object
           */
          function showDialog(properties, marker) {
            return $mdDialog.show({
              templateUrl: "app/components/dialog/dialog.html",
              controller : DialogController,
              controllerAs : "vm",
              bindToController : true,
              locals: {
                 properties : properties,
                 marker : marker
               }
            });
          }


          /**
           * createMarker - Returns the Leaflet marker and associated radius
           *
           * @param  {Object} surveyDetails - An object with the necessary properties
           * @param  {string} key           - The firebase key for the survey
           * @param  {string} progress      - The progress of the survey
           * @return {Object}               - The marker and the circle
           */
          function createMarker(surveyDetails, key, progress) {
            if (surveyDetails.coords) {
              var icon = droneIcon.extend({ options: {  } });
              var marker = L.marker(surveyDetails.coords, { key: key, icon: new icon() });

              var circleColor = progressColors[progress];

              var circleOptions = { color: circleColor, fillColor: circleColor, fillOpacity: 0.5 };
              var circle = new L.circle(surveyDetails.coords, 50, circleOptions);

              return { marker : marker, circle : circle };
            }
          }

          /**
           * addMarker - Adds a marker to the map representing a  drone
           *
           * @param  {string} key    - The Firebase unique indentifying key
           * @param  {Object} marker - An object containing coords and a progress status
           */
          function addMarker(key, surveyDetails) {

            var props = surveyDetails.properties;
            if (props) {
              var progress = props.surveyProgress;

              var surveyMarkers = createMarker(surveyDetails, key, progress);

              if (surveyMarkers) {
                var marker = surveyMarkers.marker;
                var circle = surveyMarkers.circle;
                // Change style to see through when we delete and then visible when we add
                marker.on('remove', function () {
                  circle.setStyle({ opacity: 0, fillOpacity: 0 });
                });
                marker.on('add', function () {
                  circle.setStyle({ opacity: 1, fillOpacity: 0.5 });
                });

                // If we click on a marker and not deleting show the dialog box with the marker info
                marker.on('click', function(){

                  if (!deleting && !editing) {

                    showDialog(props, marker).then(function(updatedProperties) {
                      marker.surveyIdentifier = updatedProperties.surveyIdentifier;
                      marker.surveyRequester = updatedProperties.surveyRequester;
                      props = updatedProperties; // Update clientside marker properties
                      firebaseService.updateMarkerProperties(key, updatedProperties); // Update firebase marker properties
                    });
                  }
                });

                marker.changeMarkerProgress = function(progress) {
                  var circleColor = progressColors[progress];
                  var icon = droneIcon.extend({ options: { className: 'marker-' + progress } });
                  marker.setIcon( new icon() );
                  circle.setStyle({ color: circleColor, fillColor: circleColor });
                };

                // Code for moving the circle along with the marker during editing
                marker.on('mousedown', function () {
                 if (editing) {
                   map.on('mousemove', function () {
                     circle.setLatLng(marker.getLatLng());
                   });
                 }
                });
                map.on('mouseup',function(e){
                  map.removeEventListener('mousemove');
                });

                // Add everything to the map
                drawnItems.addLayer(marker);
                map.addLayer(circle);
                marker.bindLabel(props.surveyRequester || "A Drone Survey");
                map.addLayer(marker);

                marker.surveyIdentifier = props.surveyIdentifier;
                marker.surveyRequester  = props.surveyRequester;
                surveys.push(marker);

              }

            }

          }


          /**
           * DialogController - handles the dialog responsible for logging information
           *
           * @return {Object} - The survey data returned from the inputs
           */
          function DialogController(properties, marker) {
              var vm = this;
              var img = "https://upload.wikimedia.org/wikipedia/commons/3/35/Gujarat_Satellite_Imagery_2012.jpg";
              $log.log(img);
              if (properties) { // Properties already exists
                vm.surveyRequester = properties.surveyRequester;
                vm.dateRequested = properties.dateRequested || "";
                vm.surveyIdentifier = properties.surveyIdentifier || "";
                vm.surveyProgress   = properties.surveyProgress || "backlog";
                vm.surveyDescription = properties.surveyDescription || "";
                vm.surveyImageryUrl = properties.surveyImageryUrl || "";
                vm.surveyDataFormat = properties.surveyDataFormat || "tif";
              }
              else { // Creating dialog for the first time
                vm.surveyRequester = ""; // Perhaps  try to auto complete?
                vm.dateRequested = new Date().getTime();
                vm.surveyIdentifier = "";
                vm.surveyProgress   = "backlog";
                vm.surveyDescription = "";
                vm.surveyImageryUrl = "";
                vm.surveyDataFormat = "tif";
              }

              vm.surveyProgressChange = surveyProgressChange;
              vm.closeDialog = closeDialog;

              function surveyProgressChange() {
                if (marker) {
                  marker.changeMarkerProgress(vm.surveyProgress);
                }
              }

              function closeDialog() {
                $mdDialog.hide({
                  "surveyRequester"   : vm.surveyRequester,
                  "dateRequested"     : vm.dateRequested,
                  "surveyIdentifier"  : vm.surveyIdentifier,
                  "surveyProgress"    : vm.surveyProgress,
                  "surveyDescription" : vm.surveyDescription,
                  "surveyImageryUrl"  : vm.surveyImageryUrl,
                  "surveyDataFormat"  : vm.surveyDataFormat
                });
              }

          }

      }

  }

})();

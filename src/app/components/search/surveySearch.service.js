(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .factory('surveySearch', surveySearch);

  /** @ngInject */
  function surveySearch(mapService) {

      var service = {
          searchSurveys : searchSurveys
      };

      return service;


      ///////////////////////////// LOGIC ////////////////////////////////


      /**
       * searchSurveys - gets all the drone identifiers so we can hide / show them
       *
       * @param  {type} vmDroneIdentifier - a list of all the markers for drones
       */
      function searchSurveys(searchMode, searchCriteria){

        var surveys = mapService.getSurveys();
        var map = mapService.returnMap();
        var survey, surveyIdentifier, contains;

        for (var i=0; i < surveys.length; i++){

          survey = surveys[i];
          surveyIdentifier = survey[searchMode].toLowerCase();
          contains = surveyIdentifier.indexOf(searchCriteria);
          searchCriteria = searchCriteria.toLowerCase();

          if (searchCriteria && contains === -1 ) { // If the input doest match any part of the Identifier
            if (map.hasLayer(survey)) {
              map.removeLayer(survey);
            }
          }
          else if (contains !== -1 || !searchCriteria) {
            map.addLayer(survey); // If the input matches a part of the Identifier
          }

        }

      }

  }

})();

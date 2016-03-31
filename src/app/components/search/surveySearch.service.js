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
        console.log(searchMode);
        var surveys = mapService.getSurveys();
        var map = mapService.returnMap();
        console.log(surveys);
        for (var i=0; i < surveys.length; i++){

          var survey = surveys[i];
          var surveyIdentifier = survey[searchMode].toLowerCase();
          searchCriteria = searchCriteria.toLowerCase();

          if (searchCriteria && surveyIdentifier.indexOf(searchCriteria) === -1 ) { // If the input doest match any part of the Identifier
            if (map.hasLayer(survey)) {
              map.removeLayer(survey);
            }
          }
          else if (surveyIdentifier.indexOf(searchCriteria) != -1 || !searchCriteria) {
            console.log(survey);
            map.addLayer(survey); // If the input matches a part of the Identifier
          }

        }

      }

  }

})();

(function () {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .directive('laNav', laNav);

  function laNav() {
    return {
      priority: 2,
      restrict: 'E',
      templateUrl: 'app/main/nav/nav.directive.html'
    }
  }

})();

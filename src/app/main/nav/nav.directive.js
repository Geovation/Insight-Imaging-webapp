(function () {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .directive('iiNav', iiNav);

  function iiNav() {
    return {
      restrict: 'E',
      templateUrl: 'app/main/nav/nav.directive.html'
    }
  }

})();

(function () {
  'use strict';

  angular
    .module('insightImaging')
    .directive('laNav', laNav);

  function laNav() {
    function link(scope, element, attrs) {
    }

    function controller() {
    }

    return {
      priority: 2,
      restrict: 'E',
      templateUrl: 'app/main/nav/nav.directive.html',
      link: link,
      controller: controller,
      controllerAs: 'vm',
      bindToController: true
    }
  }

})();

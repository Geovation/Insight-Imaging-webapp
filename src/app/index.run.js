(function() {
  'use strict';

  angular
    .module('insightImaging')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();

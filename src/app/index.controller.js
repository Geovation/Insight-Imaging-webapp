(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController($log, $window, firebaseService, mapService) {

    var vm = this;

    vm.authenticate = authenticate;
    vm.register = register;
    vm.deauthenticate = deauthenticate;
    vm.userAuth = firebaseService.auth.$getAuth();
    vm.droneIdentifier = "";
    vm.getDroneIdentifiers = getDroneIdentifiers;

    function getDroneIdentifiers(){

      var drones = mapService.getDroneIdentifiers();
      var map = mapService.returnMap();
      for (var i=0; i < drones.length; i++){

        var droneIdentifier = drones[i].droneIdentifier.toLowerCase();
        var vmDroneIdentifier = vm.droneIdentifier.toLowerCase();

        if (vmDroneIdentifier && droneIdentifier.indexOf(vmDroneIdentifier) === -1 ) { // If the input doest match any part of the Identifier
          if (map.hasLayer(drones[i])) {
            map.removeLayer(drones[i]);
          }
        }
        else if (droneIdentifier.indexOf(vmDroneIdentifier) != -1) {

          map.addLayer(drones[i]); // If the input matches a part of the Identifier
        }
        else if (!vmDroneIdentifier) {
          map.addLayer(drones[i]);
        }
      }

    }

    /**
     * Authenticate a user.
     */
    function authenticate() {
      firebaseService.authenticate(vm.email, vm.password)
        .then(function (userAuth) { vm.userAuth = userAuth; });
    }

    /**
     * Register a user.
     */
    function register() {
      firebaseService.register(vm.email, vm.password)
        .then(function (userAuth) { vm.userAuth = userAuth; });
    }

    /**
     * Deauthenticate a user.
     */
    function deauthenticate() {
      vm.userAuth = firebaseService.deauthenticate();
      $window.location.reload();
    }

  }

})();

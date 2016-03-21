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
    vm.droneTitle = "";
    vm.getDroneTitles = getDroneTitles;

    function getDroneTitles(){
      console.log("change", mapService.droneTitles(), vm.droneTitle);
      var drones = mapService.droneTitles();
      var map = mapService.returnMap();
      for (var i=0; i < drones.length; i++){
        var droneTitle = drones[i].droneTitle.toLowerCase();
        var vmDroneTitle = vm.droneTitle.toLowerCase();
        console.log(droneTitle.indexOf(vmDroneTitle));

        if (vmDroneTitle && droneTitle.indexOf(vmDroneTitle) === -1 ) { // If the input doest match any part of the title
          if (map.hasLayer(drones[i])) {
            map.removeLayer(drones[i]);
          }
        }
        else if (droneTitle.indexOf(vmDroneTitle) != -1) {

          map.addLayer(drones[i]); // If the input matches a part of the title
        }
        else if (!vmDroneTitle) {
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

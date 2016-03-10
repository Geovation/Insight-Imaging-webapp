(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController($log, $window, firebaseService) {

    var vm = this;

    vm.authenticate = authenticate;
    vm.register = register;
    vm.logout = logout;
    vm.userAuth = firebaseService.auth.$getAuth();

    function authenticate() {
      firebaseService.authenticate(vm.email, vm.password)
        .then(function (userAuth) { vm.userAuth = userAuth })
    }

    function register() {
      firebaseService.register(vm.email, vm.password)
        .then(function (userAuth) { vm.userAuth = userAuth })
    }

    function logout() {
      vm.userAuth = firebaseService.logout();
      $window.location.reload();
    }

  }

})();

(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .service('firebaseService', firebaseService);

  /** @ngInject */
  function firebaseService(Firebase, messageService, $firebaseAuth) {

    var vm = this;
    var firebase = new Firebase('https://insight-imaging-dev.firebaseio.com');

    var service = {
      firebase: firebase,
      auth: $firebaseAuth(firebase),
      authenticate: authenticate,
      register: register,
      logout: logout,
      saveMarker: saveMarker
    }

    function authenticate(email, password) {
      return service.auth
        .$authWithPassword({ email: email, password: password })
        .catch(onError);
    }

    function register(email, password) {
      return service.auth
        .$createUser({ email: email, password: password })
        .then(function () { return authenticate(email, password); })
        .catch(onError);
    }

    function logout() {
      service.auth.$unauth();
      return false;
    }

    function saveMarker(marker) {
      var uid = service.firebase.getAuth().uid;
      service.firebase.child('users').child(uid).child('jobs').push(marker);
    }

    function onError(e) {
      messageService.error(e.message);
      vm.userAuth = false;
    }

    return service

  }

})();

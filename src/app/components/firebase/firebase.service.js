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
      deauthenticate: deauthenticate,
      saveMarker: saveMarker,
      deleteMarker: deleteMarker,
      loadUserMarkers: loadUserMarkers
  };

    /**
     * Authenticate a user.
     * @param {string} email
     * @param {string} password
     * @returns {Promise} Contains either false or a user object.
     */
    function authenticate(email, password) {
      return service.auth
        .$authWithPassword({ email: email, password: password })
        .catch(onError);
    }

    /**
     * Register and authenticate a new user.
     * @param {string} email
     * @param {string} password
     * @returns {Promise} Contains either false or a user object.
     */
    function register(email, password) {
      return service.auth
        .$createUser({ email: email, password: password })
        .then(function () { return authenticate(email, password); })
        .catch(onError);
    }

    /**
     * Deauthenticate a user.
     * @returns {boolean} Always false.
     */
    function deauthenticate() {
      service.auth.$unauth();
      return false;
    }

    /**
     * Save a marker to the database.
     * @param {object} marker
     * @returns {object} A reference to the saved object in Firebase.
     */
    function saveMarker(marker) {
      var uid = service.firebase.getAuth().uid;
      return service.firebase.child('users').child(uid).child('jobs').push(marker);
    }

    /**
     * Delete a marker from the database.
     * @param {string} markerKey
     * @returns {Promise<null>} Once the marker has been removed.
     */
    function deleteMarker(markerKey) {
      var uid = service.firebase.getAuth().uid;
      return new Promise(function (resolve, reject) {
        service.firebase.child('users').child(uid).child('jobs').child(markerKey).remove(resolve);
      });
    }

    /**
     * Load all the markers for the current user.
     * @returns {Promise<array<object>>} A promised array of marker objects.
     */
    function loadUserMarkers(cb) {
      var uid = service.firebase.getAuth().uid;
      return new Promise(function (resolve, reject) {
        service.firebase.child('users').child(uid).child('jobs')
          .on('value', function (response) { resolve(response.val()); });
      });
    }

    /**
     * Handle errors using messageService.
     * @param {Exception} e
     * @returns {boolean} Always false.
     */
    function onError(e) {
      messageService.error(e.message);
      return false;
    }

    return service;

  }

})();

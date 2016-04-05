(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .factory('firebaseService', firebaseService);

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
      getUserName : getUserName,
      saveMarker: saveMarker,
      deleteMarker: deleteMarker,
      updateMarkerProperties : updateMarkerProperties,
      loadUserMarkers: loadUserMarkers,
      loadAllUserMarkers: loadAllUserMarkers,
      isAdmin : isAdmin
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
     * Returns the User Name of the currently logged in user.
     * @returns {object} Ther user name of the currently logged in user.
     */
    function getUserName() {
      if (service.firebase) {
        var user = service.firebase.getAuth();
        if (user) {
          return user.password.email;
        }
        else {
          deauthenticate();
        }
      }
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
     * Update a markers proprties in the database.
     * @param {string} markerKey Key for the marker in firebase
     * @param {object} properties The new properties for the marker
     * @returns {Promise} A reference to the saved object in Firebase.
     */
    function updateMarkerProperties(markerKey, properties) {
      var uid = service.firebase.getAuth().uid;
      return new Promise(function (resolve, reject) {
        service.firebase.child('users').child(uid).child('jobs')
          .child(markerKey).child("properties").set(properties);
      });
    }

    /**
     * Delete a marker from the database.
     * @param {string} markerKey
     * @returns {Promise} Once the marker has been removed.
     */
    function deleteMarker(markerKey) {
      var uid = service.firebase.getAuth().uid;
      return new Promise(function (resolve, reject) {
        service.firebase.child('users').child(uid).child('jobs')
          .child(markerKey).remove(resolve);
      });
    }

    /**
     * Load all the markers for the current user.
     * @returns {Promise<array<object>>} A promised array of marker objects.
     */
    function loadUserMarkers() {
      var uid = service.firebase.getAuth().uid;
      if (uid) {
        return new Promise(function (resolve, reject) {
          service.firebase.child('users').child(uid).child('jobs')
            .on('value', function (response) { resolve(response.val()); });
        });
      }
      else { 
        deauthenticate();
      }
    }

    /**
     * isAdmin - Determine if user is an administrator
     *
     * @return {boolean}  - True or false depending on if user is admin
     */
    function isAdmin() {
      var uid = service.firebase.getAuth().uid;
      if (uid) {
        return new Promise(function (resolve, reject) {
          service.firebase.child('admins').child(uid)
            .once('value',
              function(response){
                resolve( true );
              },
              function(error){
                resolve( false );
              });
          });
      }
      else {
        deauthenticate();
      }

    }

    /**
     * Load all the markers for the current user.
     * @returns {Promise<array<object>>} A promised array of marker objects.
     */
    function loadAllUserMarkers() {
      return new Promise(function (resolve, reject) {
        service.firebase.child('users')
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

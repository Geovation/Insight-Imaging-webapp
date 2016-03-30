(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .config(config)
    .config(theme);

  /** @ngInject */
  function config($logProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }


  function theme($mdThemingProvider) {
    var customPrimary = {
           '50': '#404040',
           '100': '#333333',
           '200': '#262626',
           '300': '#1a1a1a',
           '400': '#0d0d0d',
           '500': '#000000',
           '600': '#000000',
           '700': '#000000',
           '800': '#000000',
           '900': '#000000',
           'A100': '#4d4d4d',
           'A200': '#595959',
           'A400': '#666666',
           'A700': '#000000'
       };
       $mdThemingProvider
           .definePalette('customPrimary',
                           customPrimary);

       var customAccent = {
           '50': '#428df0',
           '100': '#2b7fee',
           '200': '#1371ed',
           '300': '#1165d5',
           '400': '#0f5abe',
           '500': '#0d4fa6',
           '600': '#0b448e',
           '700': '#093877',
           '800': '#072d5f',
           '900': '#062247',
           'A100': '#5a9cf2',
           'A200': '#72aaf4',
           'A400': '#89b8f6',
           'A700': '#041730'
       };
       $mdThemingProvider
           .definePalette('customAccent',
                           customAccent);

       var customWarn = {
           '50': '#ffe080',
           '100': '#ffd966',
           '200': '#ffd34d',
           '300': '#ffcd33',
           '400': '#ffc61a',
           '500': '#ffc000',
           '600': '#e6ad00',
           '700': '#cc9a00',
           '800': '#b38600',
           '900': '#997300',
           'A100': '#ffe699',
           'A200': '#ffecb3',
           'A400': '#fff2cc',
           'A700': '#806000'
       };
       $mdThemingProvider
           .definePalette('customWarn',
                           customWarn);

       var customBackground = {
           '50': '#ffffff',
           '100': '#ffffff',
           '200': '#ffffff',
           '300': '#ffffff',
           '400': '#ffffff',
           '500': '#ffffff',
           '600': '#f2f2f2',
           '700': '#e6e6e6',
           '800': '#d9d9d9',
           '900': '#cccccc',
           'A100': '#ffffff',
           'A200': '#ffffff',
           'A400': '#ffffff',
           'A700': '#bfbfbf'
       };
       $mdThemingProvider
           .definePalette('customBackground',
                           customBackground);


     $mdThemingProvider.theme('default')
         .primaryPalette('customPrimary')
         .accentPalette('customAccent')
         .warnPalette('customWarn')
         .backgroundPalette('customBackground');
  }



})();

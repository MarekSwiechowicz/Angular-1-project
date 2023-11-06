(function() {
  'use strict';

  /**
   * Main module of the Fuse
   */
  angular
    .module('fuse', [

      // Core
      'app.core',

      // Navigation
      'app.navigation',

      // Toolbar
      'app.toolbar',

      // Quick panel
      'app.quick-panel',

      //view of public and private templates
      'app.template',
      'app.tournament',

      // Sample
      'app.server-address',
      'app.auth',
      'app.custom-directives',
      'app.custom-services',
      'app.user',
      'app.home'
    ]);
})();

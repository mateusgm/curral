'use strict';

/* Directives */


angular.module('GamesApp.directives', []).

  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

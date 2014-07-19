'use strict';

// Declare app level module which depends on filters, and services
angular.module('GamesApp', [
  'ngRoute',
  'GamesApp.filters',
  'GamesApp.services',
  'GamesApp.directives',
  'GamesApp.controllers'
]).

config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/curral',  { templateUrl: 'partials/curral.html',  controller: 'CurralController' });
  $routeProvider.when('/edges',   { templateUrl: 'partials/edges.html',   controller: 'EdgesController' });
  $routeProvider.when('/reversi', { templateUrl: 'partials/reversi.html', controller: 'ReversiController' });

  $routeProvider.otherwise({ redirectTo: '/curral' });

}]);

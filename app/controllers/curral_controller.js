'use strict';

/* Controllers */

angular.module('GamesApp.controllers', []).

  controller('CurralController', function($scope) {

  	$scope.bsize   = 9;
  	$scope.players = 2;
  	$scope.game    = new Game($scope.bsize, $scope.players);
  	$scope.me      = $scope.game.me();
  
    console.log($scope.game);

  })
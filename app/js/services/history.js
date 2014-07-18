'use strict';

var History = function() {

  var rodadas = [];

  this.add = function(state, turn) {
    rodadas[turn] = state;
    return state;
  }

  this.get = function(turn) {
    if(rodadas.length > 0)
      while(!rodadas[turn]) { turn--; }
    return rodadas[turn];
  }

  this.last = function() {
    if(rodadas.length > 0)
      return rodadas[rodadas.length-1];
  }

}
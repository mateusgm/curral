'use strict';

var History = function() {

  var rodadas = [];

  this.add = function(state, turn) {
    rodadas[turn] = state;
    return state;
  }
  
  this.remove = function(turn) {
    delete rodadas[turn];
  }

  this.get = function(turn, retroative) {
    if(retroative === undefined) retroative = true;
    if(rodadas.length > 0 && retroative)
      while(turn > -1 && rodadas[turn] == undefined) { turn--; }
    return rodadas[turn];
  }


  this.last = function() {
    if(rodadas.length > 0)
      return rodadas[rodadas.length-1];
  }

}
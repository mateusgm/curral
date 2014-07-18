'use strict';

var Player = function(type, color, destino, cercas) {

	var n_caminhos = 0,
			positions  = new History();

	this.init = function() {
		this.type    = type;
		this.color   = color;
		this.cercas  = cercas;
	}

	// caminho

	this.position = function(rodada) {
		return positions.get(rodada);
	}

	this.set_position = function(cell, rodada) {
		positions.add(cell, rodada);
		this.position(rodada).coloca(this, rodada);
	}

	this.distancia = function(scope, cell) {
		if (cell) return cell.distancia(scope, this.color);
		else return this.position[scope].distancia(scope, this.color);
	}

	// movimento

	this.move = function(cell, rodada) {
		if(this.position(rodada)) this.position(rodada).coloca(null, rodada);
		this.set_position(cell, rodada);
	}

	this.init();

};

(function(){  // static methods

	Player.foo = function() {
		console.log('bar');
	}

})();
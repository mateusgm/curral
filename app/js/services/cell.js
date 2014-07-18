'use strict';

var Cell = function(i,j){

	var directions = ['top', 'right', 'down', 'left'],
			borders    = {},
			history    = new History();

	this.init = function(i,j) {
		this.i        = i;
		this.j        = j;
		this.id       = Cell.id(i, j);
		this.borders  = borders;
		add_history(0);
		Cell.add(this);
	}

	this.setup_borders = function() {
		for(var d in directions) {
			var neighbor = this[directions[d]]();
			if(neighbor) {
				var border = Border.get(this, neighbor);
				if(!border) border = new Border(this, neighbor);
				borders[neighbor.id] = border;
			}
		}
	}


	// api

	this.border = function(neighbor) {
		return borders[neighbor];
	}

	this.player = function(rodada) {
		return history.get(rodada).player;
	}

	this.status = function(rodada) {
		return history.get(rodada).status;
	}
	

	// directions

	this.right = function() {
		return Cell.get(this.i, this.j+1);
	}

	this.left = function() {
		return Cell.get(this.i, this.j-1);
	}

	this.top = function() {
		return Cell.get(this.i-1, this.j);
	}

	this.down = function() {
		return Cell.get(this.i+1, this.j);
	}

	this.direction = function(to) {
		switch(to) {
			case this.left() : return 'left'
			case this.right(): return 'right'
			case this.top()  : return 'top'
			case this.down() : return 'down'
		}
	}

	// movements

	var add_history = function(turn) {
		return history.add({ distancias: {} }, turn);
	}

	this.possiveis_passos = function(rodada) {
		var steps = [];
		for(var neighbor in this.borders)
			if(!this.border(neighbor).status(rodada))
				steps.push(Cell.by_id(neighbor));
		return steps;
	}

	this.esta_em = function(destino) {
		var result = true;
		if(destino.i !== undefined) result &= this.i == destino.i;
		if(destino.j !== undefined) result &= this.j == destino.j;
		return result;
	}

	this.coloca = function(player, turn) {
		var rodada = history.get(turn);
		if(!rodada) rodada = add_history(turn);
		rodada.player = player;
		rodada.status = player ? player.color : '';
	}


	// distancias

	this.distancia = function(turn, id) {
		return history.get(turn).distancias[id];
	}

	this.inicializa_distancia = function(turn, id, valor) {
		history.get(turn).distancias[id] = { valor: valor, precalculada: false };
	}

	this.distancia_precalculada = function(turn, id) {
		this.distancia(turn, id).precalculada = true;		
	}

	this.distancia_esta_precalculada = function(turn, id) {
		return this.distancia(turn, id).precalculada;
	}

	this.informa_distancia = function(turn, id, valor) {
		if(this.distancia(turn, id).valor > valor) {
			this.distancia(turn, id).valor = valor;
			return true;
		}
		return false;
	}

	this.calcula_distancia = function(rodada, id, destino_final) {
		var steps = this.possiveis_passos(rodada), menores = {};
		for(var s in steps)
			menores[s] = steps[s].informa_distancia(rodada, id, this.distancia(rodada, id).valor + 1);

		this.distancia_precalculada(rodada, id);
		for(var s in steps)
			if(menores[s] || !steps[s].distancia_esta_precalculada(rodada, id))
				steps[s].calcula_distancia(rodada, id, destino_final, this.distancia(rodada, id).valor + 1);
	}

	// inicializacao

	this.init(i,j);

};

(function(){

	var cells   = {};

	// search

	Cell.add = function(cell) {
		cells[cell.id] = cell;
	}

	Cell.by_id = function(id) {
		return cells[id];
	}

	Cell.get   = function(i,j) {
		var id = this.id(i,j);
		return this.by_id(id);
	}

	Cell.id = function(i,j) {
		return i*100 + j;
	}

})();
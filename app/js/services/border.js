'use strict';

var Border = function(from, to){

	var history = new History();

	// inicializacao

	this.init = function() {
		this.tipo   = from.direction(to);
		this.from   = from.id < to.id ? from : to;
		this.to     = from.id < to.id ? to   : from;
		this.to_s   = this.from.id + '>' + this.to.id;
		Border.add(this);
	}

	this.eh_horizontal = function() {
		switch(this.tipo) {
			case 'left' :
			case 'right': return false;
			case 'top'  :
			case 'down' : return true;
		}		
	}

	this.direcao = function(from) {
		return (from == this.from) ? this.tipo : from.direction(this.from);
	}

	this.status = function(rodada) {
		return history.get(rodada);
	}

	this.set_status = function(rodada, status) {
		history.add(status, rodada);
	}

	// movimentos

	this.cerca = function(rodada) {
		if(this.eh_cercavel(scope)) {
			this.set_status(rodada, 'cercada');
			this.conjugada().set_status(rodada, 'conjugada');
		}
	}

	this.eh_cercavel = function(rodada) {
		return !(this.status(rodada) || this.conjugada().status(rodada) || this.cruzada().status(rodada) == 'cercada');
	}

	this.conjugada = function() {
		if(this.eh_horizontal()) return Border.get(this.from.right(), this.to.right());
		else return Border.get(this.from.down(), this.to.down());	
	}

	this.cruzada = function() {
		if( this.eh_horizontal() ) return Border.get(this.from, this.from.right()); 
		else return Border.get(this.from, this.from.down()); 
	}


	this.init();
};

(function(){

	var borders = {};

	// colecao

	Border.get = function(from, to) {
		if(borders[from.id]) return borders[from.id][to.id];
	}

	Border.add = function(border) {
		if(borders[border.from.id] === undefined) borders[border.from.id] = {};
		if(borders[border.to.id]   === undefined) borders[border.to.id]   = {};
		borders[border.from.id][border.to.id] = borders[border.to.id][border.from.id] = border;
	}

})();

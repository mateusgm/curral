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

	// status

	this.set_status = function(rodada, status) {
		var status_atual = this.status(rodada);
		if(status_atual == undefined || (status_atual == 'bloqueada' && status == 'conjugada'))
			history.add(status, rodada);
	}

	this.undo_status = function(rodada) {
		history.remove(rodada);
	}

	this.status = function(rodada) {
		return history.get(rodada);
	}

	this.esta_bloqueada = function(rodada) {
		var status = this.status(rodada);
		return status == 'cercada' || status == 'conjugada';
	}

	// movimentos

	this.cerca = function(rodada) {
		this.set_status(rodada, 'cercada');
		if(this.conjugada()) this.conjugada().set_status(rodada, 'conjugada');
		if(this.cruzada())   this.cruzada().set_status(rodada, 'bloqueada');
		if(this.vizinha())   this.vizinha().set_status(rodada, 'bloqueada');
	}

	this.descerca = function(rodada) {
		this.undo_status(rodada);
		if(this.conjugada()) this.conjugada().undo_status(rodada);
		if(this.cruzada())   this.cruzada().undo_status(rodada);
		if(this.vizinha())   this.vizinha().undo_status(rodada);
	}

	this.pode_cercar = function(rodada) {
		return !(this.status(rodada) || this.conjugada().status(rodada) == 'cercada' || this.cruzada().status(rodada) == 'cercada');
	}


	// relacoes

	this.vizinha = function() {
		if(this.eh_horizontal()) return Border.get(this.from.left(), this.to.left());
		else return Border.get(this.from.top(), this.to.top());	
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
		if(from && to && borders[from.id]) return borders[from.id][to.id];
	}

	Border.add = function(border) {
		if(borders[border.from.id] === undefined) borders[border.from.id] = {};
		if(borders[border.to.id]   === undefined) borders[border.to.id]   = {};
		borders[border.from.id][border.to.id] = borders[border.to.id][border.from.id] = border;
	}

})();

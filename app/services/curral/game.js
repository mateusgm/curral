'use strict';

var Game = function(size, players) {

	// init

	this.init = function() {
		Game.set_instance(this);
		this.board   = [];
		this.players = [];
		this.rodada  = 0;
		this.build_board(size);
		this.build_players(players);
		this.rodada  = 1;
	}

	this.build_board = function(size) {
		for(var i = 1; i <= size; i++)
	 		for(var j = 1; j <= size; j++)
				this.board.push(new Cell(i, j)); 
		for(var b in this.board)
			this.board[b].setup_borders();		
	}

	this.build_players = function(qtd) {
		var colors   = ['red', 'blue', 'green', 'yellow'];
		var cercas   = [11, 7, 5];
		var types    = ['human', 'ai', 'ai', 'ai'];
		var starts   = [[1,5], [9,5], [5,1], [5,9]];
		this.players = [];
		for(var i = 0; i < qtd; i++) {
			var start   = Cell.get(starts[i][0], starts[i][1]); 
			var player  = new Player(types[i], colors[i], start, this.destino_player(starts[i]), cercas[qtd-2]);
			this.players.push(player);
			player.move(start, this.rodada);
			this.constroi_mapa(this.rodada, player);
		}
		this.turn  = this.players[0];
	}

	this.destino_player = function(start) {
		var destino = {};
		if(start[0] == 1) destino.i = 9;
		if(start[0] == 9) destino.i = 1;
		if(start[1] == 1) destino.i = 9;
		if(start[1] == 9) destino.i = 1;
		return destino;
	}


	// movements

	this.make_move = function(player, choice) {
		var movimento_valido = false;
		if(choice instanceof Cell   && this.pode_mover(player, choice)) {
			player.move(choice, this.rodada);
			movimento_valido = true;
		}
		if(choice instanceof Border && this.pode_cercar(player, choice)) {
			player.cerca(choice, this.rodada);
			movimento_valido = true;
		}
		if(movimento_valido) this.rodada++;
		if(player.position(this.rodada).esta_em(player.destino)) alert(player.color + ' ganhou!');
	}

	this.pode_mover = function(player, cell) {
		var border = Border.get(player.position(this.rodada), cell);
		return border && !border.esta_bloqueada(this.rodada) && !cell.status(this.rodada); 
	}

	this.pode_cercar = function(player, border) {
		return border.pode_cercar(this.rodada) && player.cercas > 0 && !this.cerca_fecha_algum_caminho(border);
	}

	this.cerca_fecha_caminho = function(player, border) {
		var rodada_simulada = this.rodada;
		border.cerca(rodada_simulada);
		this.constroi_mapa(rodada_simulada, player);
		var result = player.distancia(rodada_simulada).valor == 100000;
		border.descerca(rodada_simulada);
		return result;
	}

	this.cerca_fecha_algum_caminho = function(border) {
		for(var p in this.players)
			if(this.cerca_fecha_caminho(this.players[p], border)) return true;
		return false;
	}

	// mapas

	this.constroi_mapas = function(rodada) {
		for(var p in this.players) {
			var player = this.players[p];
			this.constroi_mapa(rodada, player);
		}
	}

	this.constroi_mapa = function(rodada, player) {
		for(var b in this.board) {
			var valor = this.board[b].esta_em(player.destino) ? 0 : 100000;
			this.board[b].set_distancia(rodada, player.color, valor);
		}
		Cell.get(9,5).calcula_distancia(rodada, player.color, player.destino);
	}


	// player

	this.me = function() {
		return this.players[0];
	}

	this.current_player = function() {
		return this.players[this.rodada % this.players.length];
	}

	this.init();

};

(function(){

	// static 

	var instance;

	Game.set_instance = function(_instance) {
		instance = _instance;
	}

	Game.instance = function() {
		return instance;
	}


})();


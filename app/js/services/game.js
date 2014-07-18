'use strict';

var Game = function(size, players) {

	// init

	this.init = function() {
		this.rodada  = 0;
		this.board   = [];
		this.players = [];
		this.build_board(size);
		this.build_players(players);
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
			choice.cerca(this.rodada);
			movimento_valido = true;
		}
		if(movimento_valido) this.rodada++;
	}

	this.pode_mover = function(player, cell) {
		var border = Border.get(player.position(this.rodada), cell);
		return border && !border.status(this.rodada) && !cell.player(this.rodada); 
	}

	this.pode_cercar = function(player, border) {
		var rodada_simulada = this.rodada + 1;
		border.cerca(rodada_simulada);
		this.constroi_mapa(rodada_simulada, player);
		var result = player.distancia(rodada_simulada).valor != 100000;
		if(!result) border.descerca(rodada_simulada);
		return result;
	}


	// mapas

	this.constroi_mapas = function(rodada) {
		for(var p in this.players) {
			var player = this.players[p];
			this.constroi_mapa(rodada, player);
		}
	}

	this.constroi_mapa = function(rodada, player) {
		var destino = { i: 9 };
		for(var b in this.board) {
			var valor = this.board[b].esta_em(destino) ? 0 : 100000;
			this.board[b].inicializa_distancia(rodada, player.color, valor);
		}
		Cell.get(9,5).calcula_distancia(rodada, player.color, destino);
	}


	// player

	this.me = function() {
		return this.players[0];
	}

	this.init();

};

(function(){

	// static 

	Game.foo = function() {
		return 'bar';
	}


})();


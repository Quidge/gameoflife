function Board(size, offset) {
	
	this.size = size;
	this.offset = offset;
	this.grid = this.makeGrid();
	this.round = 0;
	this.nextRound = this.prepareNextRound(this.grid);
}
Board.prototype.advanceRound = function() {
	this.round++;
	this.grid = this.nextRound;
	this.nextRound = this.prepareNextRound(this.grid);
}
Board.prototype.makeGrid = function(size = this.size,
									offset = this.offset) {
	var grid = [];
	for (var y = 0; y < size+offset*2; y++) {
		grid.push([]);
		for (var x = 0; x < size+offset*2; x++) {
			grid[y][x] = Math.random() > 0.5;
		}
	}
	return grid;
};
Board.prototype.stringState = function(grid = this.grid) {
	var string = "";
	for (var y = 0+this.offset; y < grid.length-this.offset; y++) {
		for (var x = this.offset; x < grid[y].length-this.offset; x++) {
			var char = grid[y][x] ? 'O' : 'X';
			string = string + char;
		}
		string = string + '\n';
	}
	return string;
};
Board.prototype.getCellNeighbors = function(grid, x, y) {
	
	function test(testX, testY) {
		if (testY < 0 || testY > grid.length - 1)
			return undefined;
		else
			return grid[testY][testX];
	}

	var neighbors = Object.create(null);

	neighbors.N 	= test(x, 	y-1);
	neighbors.NE 	= test(x+1, y-1);
	neighbors.E 	= test(x+1, y);
	neighbors.SE 	= test(x+1, y+1);
	neighbors.S 	= test(x,	y+1);
	neighbors.SW 	= test(x-1,	y+1);
	neighbors.W 	= test(x-1, y);
	neighbors.NW 	= test(x-1,	y-1);	

	return neighbors;
};
Board.prototype.prepareNextRound = function(grid = this.grid) {
	var nextRound = [];
	for (var y = 0; y < grid.length; y++) {
		nextRound.push([]);
		for (var x = 0; x < grid[y].length; x++) {
			var neighbors = this.getCellNeighbors(grid, x, y);
			nextRound[y][x] = this.resolveCell(grid[y][x], neighbors);
		}
	}
	return nextRound;
};
Board.prototype.resolveCell = function(cellState, neighbors) {
	var liveNeighbors = 0;
	for (var direction in neighbors) {
		if (neighbors[direction] &&
			neighbors[direction] != undefined)
		liveNeighbors++;
	}
	if (!cellState && liveNeighbors == 3) {
		return true;
	} else if (cellState && liveNeighbors > 3) {
		return false;
	} else if (cellState && liveNeighbors < 2) {
		return false;
	} else if (cellState && 2 <= liveNeighbors <= 3) {
		return true;
	}
}
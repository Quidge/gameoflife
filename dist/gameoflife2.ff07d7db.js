// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"gameoflife2.js":[function(require,module,exports) {
function Board(size, offset) {

	this.size = size;
	this.offset = offset;
	this.grid = this.makeGrid();
	this.round = 0;
	this.nextRound = this.prepareNextRound(this.grid);
}
Board.prototype.advanceRound = function () {
	this.round++;
	this.grid = this.nextRound;
	this.nextRound = this.prepareNextRound(this.grid);
};
Board.prototype.makeGrid = function () {
	var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.size;
	var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.offset;

	var grid = [];
	for (var y = 0; y < size + offset * 2; y++) {
		grid.push([]);
		for (var x = 0; x < size + offset * 2; x++) {
			grid[y][x] = Math.random() > 0.5;
		}
	}
	return grid;
};
Board.prototype.stringState = function () {
	var grid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.grid;

	var string = "";
	for (var y = 0 + this.offset; y < grid.length - this.offset; y++) {
		for (var x = this.offset; x < grid[y].length - this.offset; x++) {
			var char = grid[y][x] ? 'O' : 'X';
			string = string + char;
		}
		string = string + '\n';
	}
	return string;
};
Board.prototype.getCellNeighbors = function (grid, x, y) {

	function test(testX, testY) {
		if (testY < 0 || testY > grid.length - 1) return undefined;else return grid[testY][testX];
	}

	var neighbors = Object.create(null);

	neighbors.N = test(x, y - 1);
	neighbors.NE = test(x + 1, y - 1);
	neighbors.E = test(x + 1, y);
	neighbors.SE = test(x + 1, y + 1);
	neighbors.S = test(x, y + 1);
	neighbors.SW = test(x - 1, y + 1);
	neighbors.W = test(x - 1, y);
	neighbors.NW = test(x - 1, y - 1);

	return neighbors;
};
Board.prototype.prepareNextRound = function () {
	var grid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.grid;

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
Board.prototype.resolveCell = function (cellState, neighbors) {
	var liveNeighbors = 0;
	for (var direction in neighbors) {
		if (neighbors[direction] && neighbors[direction] != undefined) liveNeighbors++;
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
};

function drawGrid(parent, board) {
	for (var y = 0; y < board.grid.length; y++) {
		var row = document.createElement("div");
		for (var x = 0; x < board.grid[y].length; x++) {
			var checkbox = document.createElement("input");
			checkbox.row = y;
			checkbox.col = x;
			checkbox.type = "checkbox";
			checkbox.checked = board.grid[y][x];
			row.appendChild(checkbox);
		}
		parent.appendChild(row);
	}
	parent.addEventListener("change", function (event) {
		board.nextRound[event.target.row][event.target.col] = event.target.checked;
	});
}

var game = new Board(20, 2);
var grid = document.querySelector("#grid");

var button = document.querySelector("#next");
button.addEventListener("click", function (event) {
	game.advanceRound();
	while (grid.lastChild) {
		grid.removeChild(grid.lastChild);
	}
	drawGrid(grid, game);
});

drawGrid(grid, game);
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '64326' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","gameoflife2.js"], null)
//# sourceMappingURL=/gameoflife2.ff07d7db.map
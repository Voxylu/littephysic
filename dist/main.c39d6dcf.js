// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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
      localRequire.cache = {};

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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/vancas/dist/cjs/CanvasWrapper.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class is used as a wrapper around the HTMLCanvasElement.
 */
class CanvasWrapper {
    constructor(ops) {
        this._width = ops.width;
        this._height = ops.height;
        this.canvasEl = document.createElement('canvas');
        this.canvasEl.width = this._width;
        this.canvasEl.height = this._height;
        this.ctx = this.canvasEl.getContext('2d');
    }
    /**
     * The width of the canvas (internal not css size)
     */
    get width() {
        return this._width;
    }
    set width(val) {
        this.canvasEl.width = val;
        this._width = val;
    }
    /**
     * The height of the canvas (internal not css size)
     */
    get height() {
        return this._height;
    }
    set height(val) {
        this.canvasEl.height = val;
        this._height = val;
    }
}
exports.CanvasWrapper = CanvasWrapper;

},{}],"../node_modules/vancas/dist/cjs/CanvasLogic.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasWrapper_1 = require("./CanvasWrapper");
/**
 * This class is used to handle the update and render process.
 */
class CanvasLogic extends CanvasWrapper_1.CanvasWrapper {
    constructor() {
        super(...arguments);
        /**
         * lastTime keeps track of the last update (timestamp).
         */
        this.lastTime = 0;
        /**
         * rafRef keeps track of the requestAnimationFrame id.
         */
        this.rafRef = 0;
        this.running = false;
        /**
         * Update is called before a render.
         * Override it to implement your own logic.
         * The delta is passed down, it's used to keep the updates sync with the framerate.
         * Exemple:
         * ```typescript
         * update(delta) {
         *  // `x` will be incremeted by 50 every second
         *  x += 50 * delta
         * }
         * ```
         */
        this.update = (delta) => { };
        /**
         * Render is called after update.
         * Override it to implement your own logic.
         */
        this.render = () => { };
        this.main = () => {
            if (this.running) {
                if (this.lastTime === 0) {
                    this.lastTime = Date.now();
                }
                const now = Date.now();
                const delta = (now - this.lastTime) / 1000.0;
                this.update(delta);
                this.render();
                this.lastTime = now;
                this.rafRef = requestAnimationFrame(this.main);
            }
        };
    }
    /**
     * Start the update and render loop.
     */
    start() {
        this.running = true;
        this.main();
    }
    /**
     * Stop the update & render loop.
     */
    stop() {
        this.running = false;
        cancelAnimationFrame(this.rafRef);
    }
}
exports.CanvasLogic = CanvasLogic;

},{"./CanvasWrapper":"../node_modules/vancas/dist/cjs/CanvasWrapper.js"}],"../node_modules/vancas/dist/cjs/CanvasDrawers.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasLogic_1 = require("./CanvasLogic");
const DEFAULTS = {
    color: 'black',
    lineWidth: 1.0,
    font: '10px Arial',
    align: 'start',
};
class CanvasDrawers extends CanvasLogic_1.CanvasLogic {
    /**
     * Draw a line.
     */
    line(ops) {
        this.ctx.beginPath();
        this.ctx.moveTo(ops.x1, ops.y1);
        this.ctx.lineWidth = ops.lineWidth || DEFAULTS.lineWidth;
        this.ctx.lineTo(ops.x2, ops.y2);
        this.ctx.strokeStyle = ops.color || DEFAULTS.color;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    /**
     * Draw a rectangle.
     */
    rect(ops) {
        this.ctx.beginPath();
        this.ctx.lineWidth = ops.lineWidth || DEFAULTS.lineWidth;
        this.ctx.rect(ops.x, ops.y, ops.width, ops.height);
        if (ops.stroke) {
            this.ctx.strokeStyle = ops.color || DEFAULTS.color;
            this.ctx.stroke();
        }
        else {
            this.ctx.fillStyle = ops.color || DEFAULTS.color;
            this.ctx.fill();
        }
        this.ctx.closePath();
    }
    /**
     * Draw a circle.
     */
    circle(ops) {
        this.ctx.beginPath();
        this.ctx.lineWidth = ops.lineWidth || DEFAULTS.lineWidth;
        this.ctx.arc(ops.x, ops.y, ops.radius, 0, 2 * Math.PI);
        if (ops.stroke) {
            this.ctx.strokeStyle = ops.color || DEFAULTS.color;
            this.ctx.stroke();
        }
        else {
            this.ctx.fillStyle = ops.color || DEFAULTS.color;
            this.ctx.fill();
        }
        this.ctx.closePath();
    }
    triangle(ops) {
        this.ctx.beginPath();
        this.ctx.lineWidth = ops.lineWidth || DEFAULTS.lineWidth;
        this.ctx.moveTo(ops.x1, ops.y1);
        this.ctx.lineTo(ops.x2, ops.y2);
        this.ctx.lineTo(ops.x3, ops.y3);
        this.ctx.lineTo(ops.x1, ops.y1);
        if (ops.stroke) {
            this.ctx.strokeStyle = ops.color || DEFAULTS.color;
            this.ctx.stroke();
        }
        else {
            this.ctx.fillStyle = ops.color || DEFAULTS.color;
            this.ctx.fill();
        }
        this.ctx.closePath();
    }
    /**
     * Set the background of the canvas to a color.
     */
    background(color) {
        this.rect({
            x: 0,
            y: 0,
            color,
            height: this.height,
            width: this.width,
        });
    }
    /**
     * Draw a text on the canvas.
     */
    text(ops) {
        this.ctx.font = ops.font || DEFAULTS.font;
        this.ctx.textAlign = ops.align || DEFAULTS.align;
        this.ctx.lineWidth = ops.lineWidth || DEFAULTS.lineWidth;
        if (ops.stroke) {
            this.ctx.strokeStyle = ops.color || DEFAULTS.color;
            this.ctx.strokeText(ops.text, ops.x, ops.y, ops.maxWidth);
        }
        else {
            this.ctx.fillStyle = ops.color || DEFAULTS.color;
            this.ctx.fillText(ops.text, ops.x, ops.y, ops.maxWidth);
        }
    }
    /**
     * Clear the whole canvas.
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}
exports.CanvasDrawers = CanvasDrawers;

},{"./CanvasLogic":"../node_modules/vancas/dist/cjs/CanvasLogic.js"}],"../node_modules/vancas/dist/cjs/CanvasGroups.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasDrawers_1 = require("./CanvasDrawers");
class CanvasGroups extends CanvasDrawers_1.CanvasDrawers {
    rotationGroup(fn, ops) {
        this.ctx.save();
        this.ctx.translate(ops.x, ops.y);
        this.ctx.rotate(ops.rotation);
        this.ctx.translate(-ops.x, -ops.y);
        fn();
        this.ctx.restore();
    }
    groupFn(instructions, groupFn) {
        const addInstruction = (instruction) => this.groupFn([...instructions, instruction], groupFn);
        return {
            translate: (ops) => {
                return addInstruction(() => this.ctx.translate(ops.x, ops.y));
            },
            rotate: (ops) => {
                return addInstruction(() => this.ctx.rotate(ops.rotation));
            },
            scale: (ops) => {
                return addInstruction(() => this.ctx.scale(ops.x, ops.y));
            },
            render: () => {
                this.ctx.save();
                for (const instruction of instructions) {
                    instruction();
                }
                groupFn();
                this.ctx.restore();
            },
        };
    }
    group(fn) {
        return this.groupFn([], fn);
    }
}
exports.CanvasGroups = CanvasGroups;

},{"./CanvasDrawers":"../node_modules/vancas/dist/cjs/CanvasDrawers.js"}],"../node_modules/vancas/dist/cjs/CanvasImage.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasGroups_1 = require("./CanvasGroups");
exports.loadImage = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            resolve(img);
        };
    });
};
class CanvasImage extends CanvasGroups_1.CanvasGroups {
    image(ops) {
        if (ops.imageX !== undefined &&
            ops.imageY !== undefined &&
            ops.imageWidth !== undefined &&
            ops.ImageHeight !== undefined &&
            ops.maxWidth !== undefined &&
            ops.maxHeight !== undefined) {
            this.ctx.drawImage(ops.image, ops.imageX, ops.imageY, ops.imageWidth, ops.ImageHeight, ops.x, ops.y, ops.maxWidth, ops.maxHeight);
        }
        else if (ops.maxWidth !== undefined && ops.maxHeight !== undefined) {
            this.ctx.drawImage(ops.image, ops.x, ops.y, ops.maxWidth, ops.maxHeight);
        }
        else {
            this.ctx.drawImage(ops.image, ops.x, ops.y);
        }
    }
}
exports.CanvasImage = CanvasImage;

},{"./CanvasGroups":"../node_modules/vancas/dist/cjs/CanvasGroups.js"}],"../node_modules/vancas/dist/cjs/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasImage_1 = require("./CanvasImage");
exports.loadImage = CanvasImage_1.loadImage;
class Vancas extends CanvasImage_1.CanvasImage {
}
exports.Vancas = Vancas;
/**
 * Return a vancas instance.
 * Exemple:
 * ```typescript
 * const vancas = createVancas({ width: 500, height: 500 })
 *
 * document.body.appendChild(vancas.canvasEl)
 *
 * vancas.render = () => {
 *   vancas.clear()
 *   vancas.background('grey')
 * }
 *
 * vancas.start()
 * ```
 */
exports.createVancas = (ops) => {
    return new Vancas(ops);
};

},{"./CanvasImage":"../node_modules/vancas/dist/cjs/CanvasImage.js"}],"mouse.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var MouseCalculator =
/** @class */
function () {
  function MouseCalculator(rect) {
    var _this = this;

    this.rect = rect;
    this.x = 0;
    this.y = 0;

    this.fn = function () {};

    this.handleClick = function () {
      _this.fn();
    };

    this.handleMouve = function (event) {
      _this.x = event.clientX - _this.rect.left;
      _this.y = event.clientY - _this.rect.top;
    };

    window.addEventListener('mousemove', this.handleMouve); // window.addEventListener('click', this.handleMouve)

    window.addEventListener('mousedown', this.handleClick);
  }

  MouseCalculator.prototype.destroy = function () {
    window.removeEventListener('mousemove', this.handleMouve); // window.removeEventListener('click', this.handleMouve)

    window.removeEventListener('mousedown', this.handleClick);
  };

  MouseCalculator.prototype.onClick = function (fn) {
    this.fn = fn;
  };

  return MouseCalculator;
}();

exports.MouseCalculator = MouseCalculator;
},{}],"../lib/segment/segment.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Point =
/** @class */
function () {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  return Point;
}();

exports.Point = Point;

var Segment =
/** @class */
function () {
  function Segment(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
    this.shape = 'segment';
  }

  Object.defineProperty(Segment.prototype, "length", {
    get: function get() {
      return Math.sqrt(Math.pow(this.point1.x - this.point2.x, 2) + Math.pow(this.point1.y - this.point2.y, 2));
    },
    enumerable: true,
    configurable: true
  });

  Segment.prototype.collide = function (other) {
    if (other.shape === 'segment') {
      var res = this.collideWithSegment(other);

      if (res) {
        return true;
      } else {
        return false;
      }
    } else if (other.shape === 'rectangle') {
      return this.collideWithRectangle(other);
    } else if (other.shape === 'circle') {
      return other.collide(this);
    } else if (other.shape === 'triangle') {
      return other.collide(this);
    }

    console.error("collide(...) of " + JSON.stringify(this) + " not implemented with " + JSON.stringify(other));
    return false;
  };

  Segment.prototype.collideWithRectangle = function (other) {
    var point1InX = this.point1.x > other.x && this.point1.x < other.x + other.width;
    var point1InY = this.point1.y > other.y && this.point1.y < other.y + other.height;

    if (point1InX && point1InY) {
      return true;
    }

    var otherSegments = [new Segment(new Point(other.x, other.y), new Point(other.x + other.width, other.y)), new Segment(new Point(other.x + other.width, other.y), new Point(other.x + other.width, other.y + other.height)), new Segment(new Point(other.x + other.width, other.y + other.height), new Point(other.x, other.y + other.height)), new Segment(new Point(other.x, other.y + other.height), new Point(other.x, other.y))];

    for (var _i = 0, otherSegments_1 = otherSegments; _i < otherSegments_1.length; _i++) {
      var segment = otherSegments_1[_i];
      var res = this.collideWithSegment(segment);

      if (res) {
        return true;
      }
    }

    return false;
  };
  /** From stack overflow (lol) */


  Segment.prototype.collideWithSegment = function (other) {
    var s1_x = this.point2.x - this.point1.x;
    var s1_y = this.point2.y - this.point1.y;
    var s2_x = other.point2.x - other.point1.x;
    var s2_y = other.point2.y - other.point1.y;
    var s = (-s1_y * (this.point1.x - other.point1.x) + s1_x * (this.point1.y - other.point1.y)) / (-s2_x * s1_y + s1_x * s2_y);
    var t = (s2_x * (this.point1.y - other.point1.y) - s2_y * (this.point1.x - other.point1.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      // Collision detected
      var intX = this.point1.x + t * s1_x;
      var intY = this.point1.y + t * s1_y;
      return new Point(intX, intY);
    }

    return false;
  };

  return Segment;
}();

exports.Segment = Segment;
},{}],"../lib/segment/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./segment"));
},{"./segment":"../lib/segment/segment.ts"}],"../lib/rectangle/rectangle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var segment_1 = require("../segment");

var Rectangle =
/** @class */
function () {
  function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.shape = 'rectangle';
  }

  Rectangle.prototype.collide = function (other) {
    if (other.shape === 'rectangle') {
      return this.collideWithRectangle(other);
    } else if (other.shape === 'segment') {
      return other.collide(this);
    } else if (other.shape === 'circle') {
      return other.collide(this);
    } else if (other.shape === 'triangle') {
      return this.collideWithTriangle(other);
    }

    console.error("collide(...) of " + this + " not implemented with " + other);
    return false;
  };

  Object.defineProperty(Rectangle.prototype, "segments", {
    get: function get() {
      return [new segment_1.Segment(new segment_1.Point(this.x, this.y), new segment_1.Point(this.x + this.width, this.y)), new segment_1.Segment(new segment_1.Point(this.x + this.width, this.y), new segment_1.Point(this.x + this.width, this.y + this.height)), new segment_1.Segment(new segment_1.Point(this.x + this.width, this.y + this.height), new segment_1.Point(this.x, this.y + this.height)), new segment_1.Segment(new segment_1.Point(this.x, this.y + this.height), new segment_1.Point(this.x, this.y))];
    },
    enumerable: true,
    configurable: true
  });

  Rectangle.prototype.collideWithTriangle = function (other) {
    for (var _i = 0, _a = other.points; _i < _a.length; _i++) {
      var point = _a[_i];
      var falseRect = {
        collide: function collide() {
          return false;
        },
        shape: 'rectangle',
        x: point.x,
        y: point.y,
        height: 0,
        width: 0
      };

      if (this.collideWithRectangle(falseRect)) {
        return true;
      }
    }

    for (var _b = 0, _c = this.segments; _b < _c.length; _b++) {
      var mySegment = _c[_b];

      for (var _d = 0, _e = other.segments; _d < _e.length; _d++) {
        var otherSegment = _e[_d];

        if (mySegment.collide(otherSegment)) {
          return true;
        }
      }
    }

    return false;
  };

  Rectangle.prototype.collideWithRectangle = function (other) {
    var collideInX = this.x + this.width > other.x && this.x < other.x + other.width;
    var collideInY = this.y + this.height > other.y && this.y < other.y + other.height;

    if (collideInX && collideInY) {
      return true;
    } else {
      return false;
    }
  };

  return Rectangle;
}();

exports.Rectangle = Rectangle;
},{"../segment":"../lib/segment/index.ts"}],"../lib/rectangle/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./rectangle"));
},{"./rectangle":"../lib/rectangle/rectangle.ts"}],"../lib/circle/circleSegment.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var segment_1 = require("../segment");

var Vector2D =
/** @class */
function () {
  function Vector2D(x, y) {
    this.x = x;
    this.y = y;
  }

  Vector2D.fromPoints = function (A, B) {
    return new Vector2D(B.x - A.x, B.y - A.y);
  };

  Vector2D.prototype.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y;
  };

  Vector2D.mult = function (vector, scalar) {
    return new Vector2D(vector.x * scalar, vector.y * scalar);
  };

  return Vector2D;
}();

exports.Vector2D = Vector2D;

exports.circleSegment = function (circle, _a) {
  var E = _a.point1,
      L = _a.point2; // test if a point is inside

  if (Math.pow(E.x - circle.x, 2) + Math.pow(E.y - circle.y, 2) <= Math.pow(circle.radius, 2)) {
    return true;
  }

  var C = new segment_1.Point(circle.x, circle.y);
  var r = circle.radius;
  var d = Vector2D.fromPoints(E, L);
  var f = Vector2D.fromPoints(C, E);
  var a = d.dot(d);
  var b = 2 * f.dot(d);
  var c = f.dot(f) - r * r;
  var discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return false;
  } else {
    discriminant = Math.sqrt(discriminant);
    var t1 = (-b - discriminant) / (2 * a);
    var t2 = (-b + discriminant) / (2 * a);

    if (t1 >= 0 && t1 <= 1) {
      return true;
    }

    if (t2 >= 0 && t2 <= 1) {
      return true;
    }

    return false;
  }
};
},{"../segment":"../lib/segment/index.ts"}],"../lib/circle/circle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var circleSegment_1 = require("./circleSegment");

var Circle =
/** @class */
function () {
  function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.shape = 'circle';
  }

  Circle.prototype.collide = function (other) {
    if (other.shape === 'circle') {
      return this.collideWithCircle(other);
    } else if (other.shape === 'rectangle') {
      return this.collideWithRectangle(other);
    } else if (other.shape === 'segment') {
      return circleSegment_1.circleSegment(this, other);
    } else if (other.shape === 'triangle') {
      return other.collide(this);
    }

    console.error("collide(...) of " + JSON.stringify(this) + " not implemented with " + JSON.stringify(other));
    return false;
  };

  Circle.prototype.collideWithRectangle = function (other) {
    var circleDistance = {
      x: Math.abs(this.x - (other.x + other.width / 2)),
      y: Math.abs(this.y - (other.y + other.height / 2))
    };

    if (circleDistance.x > other.width / 2 + this.radius) {
      return false;
    }

    if (circleDistance.y > other.height / 2 + this.radius) {
      return false;
    }

    if (circleDistance.x <= other.width / 2) {
      return true;
    }

    if (circleDistance.y <= other.height / 2) {
      return true;
    }

    var cornerDistanceSq = Math.pow(circleDistance.x - other.width / 2, 2) + Math.pow(circleDistance.y - other.height / 2, 2);
    return cornerDistanceSq <= Math.pow(this.radius, 2);
  };

  Circle.prototype.collideWithCircle = function (other) {
    if (Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2) <= Math.pow(other.radius + this.radius, 2)) {
      return true;
    } else {
      return false;
    }
  };

  return Circle;
}();

exports.Circle = Circle;
},{"./circleSegment":"../lib/circle/circleSegment.ts"}],"../lib/circle/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./circle"));
},{"./circle":"../lib/circle/circle.ts"}],"../lib/triangle/pointInPolygon.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var circleSegment_1 = require("../circle/circleSegment");

exports.pointInPolygon = function (points, P) {
  for (var i = 0; i < points.length; i++) {
    var A = points[i];
    var B = void 0;

    if (i === points.length - 1) {
      B = points[0];
    } else {
      B = points[i + 1];
    }

    var D = new circleSegment_1.Vector2D(B.x - A.x, B.y - A.y);
    var T = new circleSegment_1.Vector2D(P.x - A.x, P.y - A.y);
    var d = D.x * T.y - D.y * T.x;

    if (d <= 0) {
      return false;
    }
  }

  return true;
};
},{"../circle/circleSegment":"../lib/circle/circleSegment.ts"}],"../lib/triangle/triangle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var segment_1 = require("../segment");

var pointInPolygon_1 = require("./pointInPolygon");

var Triangle =
/** @class */
function () {
  function Triangle(point1, point2, point3) {
    this.point1 = point1;
    this.point2 = point2;
    this.point3 = point3;
    this.shape = 'triangle';
  }

  Triangle.prototype.collide = function (other) {
    if (other.shape === 'triangle') {
      return this.collideWithTriangle(other);
    } else if (other.shape === 'segment') {
      return this.collideWithSegment(other);
    } else if (other.shape == 'circle') {
      return this.collideWithCircle(other);
    }

    return false;
  };

  Object.defineProperty(Triangle.prototype, "points", {
    get: function get() {
      return [this.point1, this.point3, this.point2];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Triangle.prototype, "segments", {
    get: function get() {
      return [new segment_1.Segment(this.point1, this.point2), new segment_1.Segment(this.point2, this.point3), new segment_1.Segment(this.point3, this.point1)];
    },
    enumerable: true,
    configurable: true
  });

  Triangle.prototype.collideWithCircle = function (other) {
    if (pointInPolygon_1.pointInPolygon(this.points, new segment_1.Point(other.x, other.y))) {
      return true;
    }

    for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
      var segment = _a[_i];

      if (other.collide(segment)) {
        return true;
      }
    }

    return false;
  };

  Triangle.prototype.collideWithSegment = function (other) {
    if (pointInPolygon_1.pointInPolygon(this.points, other.point1)) {
      return true;
    } else if (pointInPolygon_1.pointInPolygon(this.points, other.point2)) {
      return true;
    }

    for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
      var mySegment = _a[_i];

      if (other.collide(mySegment)) {
        return true;
      }
    }

    return false;
  };

  Triangle.prototype.collideWithTriangle = function (other) {
    for (var _i = 0, _a = other.points; _i < _a.length; _i++) {
      var othePoint = _a[_i];

      if (pointInPolygon_1.pointInPolygon(this.points, othePoint)) {
        return true;
      }
    }

    for (var _b = 0, _c = this.segments; _b < _c.length; _b++) {
      var mySegment = _c[_b];

      for (var _d = 0, _e = other.segments; _d < _e.length; _d++) {
        var otherSegment = _e[_d];

        if (mySegment.collideWithSegment(otherSegment)) {
          return true;
        }
      }
    }

    return false;
  };

  return Triangle;
}();

exports.Triangle = Triangle;
},{"../segment":"../lib/segment/index.ts","./pointInPolygon":"../lib/triangle/pointInPolygon.ts"}],"../lib/triangle/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./triangle"));
},{"./triangle":"../lib/triangle/triangle.ts"}],"../lib/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./rectangle"));

__export(require("./circle"));

__export(require("./segment"));

__export(require("./triangle"));
},{"./rectangle":"../lib/rectangle/index.ts","./circle":"../lib/circle/index.ts","./segment":"../lib/segment/index.ts","./triangle":"../lib/triangle/index.ts"}],"main.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var vancas_1 = require("vancas");

var mouse_1 = require("./mouse");

var lib_1 = require("../lib");

var lib_2 = require("../lib");

var root = document.getElementById('root');
var vancas = vancas_1.createVancas({
  height: 500,
  width: 500
});

if (root) {
  root.innerHTML = '';
  root.appendChild(vancas.canvasEl);
}

var mouse = new mouse_1.MouseCalculator(vancas.canvasEl.getBoundingClientRect());
var bgElems = [Object.assign(new lib_2.Rectangle(80, 50, 100, 200), {
  color: 'blue'
}), Object.assign(new lib_2.Segment(new lib_2.Point(200, 50), new lib_2.Point(300, 450)), {
  color: 'green'
}), Object.assign(new lib_2.Circle(50, 50, 15), {
  color: 'red '
}), Object.assign(new lib_1.Triangle(new lib_2.Point(100, 300), new lib_2.Point(50, 350), new lib_2.Point(150, 350)), {
  color: 'orange'
})];
var colliderColor = 'white'; // const collider = new Rectangle(0, 0, 10, 10)
// const collider = new Segment(new Point(0, 0), new Point(0, 0))
// const collider = new Point(0, 0)

var collider = new lib_1.Triangle(new lib_2.Point(0, 0), new lib_2.Point(0, 0), new lib_2.Point(0, 0)); // const collider = new Circle(0, 0, 10)
// mouse.onClick(() => {
//   collider.point1.x = mouse.x
//   collider.point1.y = mouse.y
// })

vancas.update = function () {
  // collider.point2.x = mouse.x
  // collider.point2.y = mouse.y
  // collider.x = mouse.x
  // collider.y = mouse.y
  collider.point1.x = mouse.x;
  collider.point1.y = mouse.y;
  collider.point2.x = mouse.x - 10;
  collider.point2.y = mouse.y + 10;
  collider.point3.x = mouse.x + 10;
  collider.point3.y = mouse.y + 10;
  var hasCollide = false;

  for (var _i = 0, bgElems_1 = bgElems; _i < bgElems_1.length; _i++) {
    var elem = bgElems_1[_i];

    if (elem.collide(collider)) {
      colliderColor = elem.color;
      hasCollide = true;
    }
  }

  if (hasCollide === false) {
    colliderColor = 'white';
  }
};

vancas.render = function () {
  vancas.clear();
  vancas.background('black');
  bgElems.forEach(function (elem) {
    if (elem.shape === 'rectangle') {
      vancas.rect(elem);
    } else if (elem.shape === 'segment') {
      vancas.line({
        x1: elem.point1.x,
        y1: elem.point1.y,
        x2: elem.point2.x,
        y2: elem.point2.y,
        color: elem.color
      });
    } else if (elem.shape === 'circle') {
      vancas.circle(elem);
    } else if (elem.shape === 'triangle') {
      vancas.triangle({
        x1: elem.point1.x,
        y1: elem.point1.y,
        x2: elem.point2.x,
        y2: elem.point2.y,
        x3: elem.point3.x,
        y3: elem.point3.y,
        color: elem.color
      });
    }
  }); // vancas.line({
  //   x1: collider.point1.x,
  //   y1: collider.point1.y,
  //   x2: collider.point2.x,
  //   y2: collider.point2.y,
  //   color: colliderColor,
  // })
  // vancas.rect({ ...collider, color: colliderColor })
  // vancas.circle({ ...collider, color: colliderColor })
  // vancas.circle({
  //   x: collider.x,
  //   y: collider.y,
  //   radius: 5,
  //   color: colliderColor,
  // })

  vancas.triangle({
    x1: collider.point1.x,
    y1: collider.point1.y,
    x2: collider.point2.x,
    y2: collider.point2.y,
    x3: collider.point3.x,
    y3: collider.point3.y,
    color: colliderColor
  });
};

vancas.start();
},{"vancas":"../node_modules/vancas/dist/cjs/index.js","./mouse":"mouse.ts","../lib":"../lib/index.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "4000" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
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
  overlay.id = OVERLAY_ID; // html encode message and stack trace

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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map
var Digger;
(function (Digger) {
    var Base64Reader = (function () {
        function Base64Reader(data) {
            this._alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            this._position = 0;
            this._bits = 0;
            this._bitsLength = 0;
            this._data = data;
        }
        Base64Reader.prototype.readByte = function () {
            if (this._bitsLength === 0) {
                var tailBits = 0;
                while (this._position < this._data.length && this._bitsLength < 24) {
                    var ch = this._data.charAt(this._position++);
                    var index = this._alphabet.indexOf(ch);
                    if (index < 64) {
                        this._bits = (this._bits << 6) | index;
                    } else {
                        this._bits <<= 6;
                        tailBits += 6;
                    }
                    this._bitsLength += 6;
                }
                if ((this._position >= this._data.length) && (this._bitsLength === 0)) {
                    return -1;
                }
                tailBits = (tailBits === 6) ? 8 : (tailBits === 12) ? 16 : tailBits;
                this._bits = this._bits >> tailBits;
                this._bitsLength -= tailBits;
            }
            this._bitsLength -= 8;
            return (this._bits >> this._bitsLength) & 0xff;
        };
        return Base64Reader;
    })();
    Digger.Base64Reader = Base64Reader;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    (function (Direction) {
        Direction[Direction["none"] = 0] = "none";
        Direction[Direction["left"] = 1] = "left";
        Direction[Direction["right"] = 2] = "right";
        Direction[Direction["up"] = 3] = "up";
        Direction[Direction["down"] = 4] = "down";
    })(Digger.Direction || (Digger.Direction = {}));
    var Direction = Digger.Direction;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    var Game = (function () {
        function Game(canvas) {
            var _this = this;
            this._imageTable = [];
            this._soundTable = [];
            this._canvas = canvas;
            this._canvas.focus();

            this._context = canvas.getContext("2d");
            this._context.fillStyle = "#00ffff";
            this._context.fillRect(0, 2, 320, 4);
            this._context.fillRect(0, 26, 320, 4);
            this._context.fillStyle = "#920205";
            this._context.fillRect(0, 8, 320, 16);

            for (var i = 0; i < this.soundData.length; i++) {
                var audio = document.createElement('audio');
                if ((audio !== null) && (audio.canPlayType('audio/wav'))) {
                    audio.src = 'data:audio/wav;base64,' + this.soundData[i];
                    audio.preload = 'auto';
                    audio.load();
                }
                this._soundTable[i] = audio;
            }

            var imageIndex = 0;
            var imageCount = this.imageData.length;
            var onload = function () {
                imageIndex++;
                if (imageIndex === imageCount) {
                    _this.start();
                }
            };

            for (i = 0; i < this.imageData.length; i++) {
                var image = new Image();
                image.onload = onload;
                image.src = 'data:image/png;base64,' + this.imageData[i];
                this._imageTable[i] = image;
            }
        }
        Game.prototype.start = function () {
            var _this = this;
            this.drawText(0, 8, "  ROOM:     TIME:        DIAMONDS:      ");
            this.drawText(0, 16, "  LIVES:    SCORE:       COLLECTED:     ");

            this._screenTable = [];
            for (var x = 0; x < 20; x++) {
                this._screenTable[x] = [];
                for (var y = 0; y < 14; y++) {
                    this._screenTable[x][y] = 0;
                }
            }

            this._inputHandler = new Digger.InputHandler(this._canvas, this);
            this._blink = 0;
            this.restart();
            window.setInterval(function () {
                return _this.interval();
            }, 50);
        };

        Game.prototype.addKey = function (key) {
            if (key < 4) {
                this._keys[key] = true;
            } else if (key == Digger.Key.reset) {
                this._lives--;
                if (this._lives >= 0) {
                    this.loadLevel();
                } else {
                    this.restart();
                }
            }
        };

        Game.prototype.removeKey = function (key) {
            if (key < 4) {
                this._keysRelease[key] = true;
            }
        };

        Game.prototype.restart = function () {
            this._lives = 20;
            this._score = 0;
            this._room = 0;
            this.loadLevel();
        };

        Game.prototype.loadLevel = function () {
            this._level = new Digger.Level(this.levelData[this._room]);
            this._keys = [false, false, false, false];
            this._keysRelease = [false, false, false, false];
            this._tick = 0;
            this.paint();
        };

        Game.prototype.nextLevel = function () {
            if (this._room < (this.levelData.length - 1)) {
                this._room++;
                this.loadLevel();
            }
        };

        Game.prototype.isPlayerAlive = function () {
            return (this._level === null) || (this._level.isPlayerAlive);
        };

        Game.prototype.interval = function () {
            this._tick++;
            this._blink++;
            if (this._blink == 6) {
                this._blink = 0;
            }
            if ((this._tick % 2) === 0) {
                for (var i = 0; i < 4; i++) {
                    if (this._keysRelease[i]) {
                        this._keys[i] = false;
                        this._keysRelease[i] = false;
                    }
                }

                this._level.update();
                if (this._level.movePlayer(this._keys)) {
                    this.nextLevel();
                } else {
                    this._level.move();

                    for (var i = 0; i < this.soundData.length; i++) {
                        if (this._soundTable[i] && this._level.playSound(i)) {
                            if (!!this._soundTable[i].currentTime) {
                                this._soundTable[i].pause();
                                this._soundTable[i].currentTime = 0;
                            }
                            this._soundTable[i].play();
                            break;
                        }
                    }
                }
            }

            this._score += this._level.updateScore();

            this.paint();
        };

        Game.prototype.paint = function () {
            var blink = ((this._blink + 4) % 6);

            // update statusbar
            this._context.fillStyle = "#920205";
            this.drawText(9 * 8, 8, this.formatNumber(this._room + 1, 2));
            this.drawText(9 * 8, 16, this.formatNumber(this._lives, 2));
            this.drawText(19 * 8, 16, this.formatNumber(this._score, 5));
            this.drawText(19 * 8, 8, this.formatNumber(this._level.time, 5));
            this.drawText(36 * 8, 8, this.formatNumber(this._level.diamonds, 2));
            this.drawText(36 * 8, 16, this.formatNumber(this._level.collected, 2));

            for (var x = 0; x < 20; x++) {
                for (var y = 0; y < 14; y++) {
                    var spriteIndex = this._level.getSpriteIndex(x, y, blink);
                    if (this._screenTable[x][y] != spriteIndex) {
                        this._screenTable[x][y] = spriteIndex;
                        this._context.drawImage(this._imageTable[0], spriteIndex * 16, 0, 16, 16, x * 16, y * 16 + 32, 16, 16);
                    }
                }
            }
        };

        Game.prototype.drawText = function (x, y, text) {
            for (var i = 0; i < text.length; i++) {
                var index = text.charCodeAt(i) - 32;
                this._context.fillRect(x, y, 8, 8);
                this._context.drawImage(this._imageTable[1], 0, index * 8, 8, 8, x, y, 8, 8);
                x += 8;
            }
        };

        Game.prototype.formatNumber = function (value, digits) {
            var text = value.toString();
            while (text.length < digits) {
                text = "0" + text;
            }
            return text;
        };
        return Game;
    })();
    Digger.Game = Game;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    var Ghost = (function () {
        function Ghost(position, type, direction, lastTurn) {
            this._alive = true;
            this._position = position;
            this._type = type;
            this._direction = direction;
            this._lastTurn = lastTurn;
        }
        Ghost.prototype.kill = function () {
            this._alive = false;
        };

        Object.defineProperty(Ghost.prototype, "alive", {
            get: function () {
                return this._alive;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ghost.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ghost.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ghost.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (value) {
                this._direction = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Ghost.prototype, "lastTurn", {
            get: function () {
                return this._lastTurn;
            },
            set: function (value) {
                this._lastTurn = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Ghost.prototype, "imageIndex", {
            get: function () {
                return [4, 4, 5, 6, 3][this._direction];
            },
            enumerable: true,
            configurable: true
        });
        return Ghost;
    })();
    Digger.Ghost = Ghost;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    var InputHandler = (function () {
        function InputHandler(canvas, game) {
            var _this = this;
            this._canvas = canvas;
            this._game = game;

            this._mouseDownHandler = function (e) {
                _this.mouseDown(e);
            };
            this._touchStartHandler = function (e) {
                _this.touchStart(e);
            };
            this._touchEndHandler = function (e) {
                _this.touchEnd(e);
            };
            this._touchMoveHandler = function (e) {
                _this.touchMove(e);
            };
            this._keyDownHandler = function (e) {
                _this.keyDown(e);
            };
            this._keyPressHandler = function (e) {
                _this.keyPress(e);
            };
            this._keyUpHandler = function (e) {
                _this.keyUp(e);
            };

            this._canvas.addEventListener("touchstart", this._touchStartHandler, false);
            this._canvas.addEventListener("touchmove", this._touchMoveHandler, false);
            this._canvas.addEventListener("touchend", this._touchEndHandler, false);
            this._canvas.addEventListener("mousedown", this._mouseDownHandler, false);

            document.addEventListener("keydown", this._keyDownHandler, false);
            document.addEventListener("keypress", this._keyPressHandler, false);
            document.addEventListener("keyup", this._keyUpHandler, false);

            this._isWebKit = typeof navigator.userAgent.split("WebKit/")[1] !== "undefined";
            this._isMozilla = navigator.appVersion.indexOf('Gecko/') >= 0 || ((navigator.userAgent.indexOf("Gecko") >= 0) && !this._isWebKit && (typeof navigator.appVersion !== "undefined"));
        }
        InputHandler.prototype.keyDown = function (e) {
            if (!this._isMozilla && !e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey) {
                this.processKey(e, e.keyCode);
            }
        };

        InputHandler.prototype.keyPress = function (e) {
            if (this._isMozilla && !e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey) {
                this.processKey(e, (e.keyCode != 0) ? e.keyCode : (e.charCode === 32) ? 32 : 0);
            }
        };

        InputHandler.prototype.keyUp = function (e) {
            switch (e.keyCode) {
                case 37:
                    this._game.removeKey(Digger.Key.left);
                    break;
                case 39:
                    this._game.removeKey(Digger.Key.right);
                    break;
                case 38:
                    this._game.removeKey(Digger.Key.up);
                    break;
                case 40:
                    this._game.removeKey(Digger.Key.down);
                    break;
            }
        };

        InputHandler.prototype.processKey = function (e, keyCode) {
            switch (e.keyCode) {
                case 37:
                    this.stopEvent(e);
                    this._game.addKey(Digger.Key.left);
                    break;
                case 39:
                    this.stopEvent(e);
                    this._game.addKey(Digger.Key.right);
                    break;
                case 38:
                    this.stopEvent(e);
                    this._game.addKey(Digger.Key.up);
                    break;
                case 40:
                    this.stopEvent(e);
                    this._game.addKey(Digger.Key.down);
                    break;
                case 27:
                    this.stopEvent(e);
                    this._game.addKey(Digger.Key.reset);
                    break;
                case 8:
                case 36:
                    this.stopEvent(e);
                    this._game.nextLevel();
                    break;
                default:
                    if (!this._game.isPlayerAlive()) {
                        this.stopEvent(e);
                        this._game.addKey(Digger.Key.reset);
                    }
                    break;
            }
        };

        InputHandler.prototype.mouseDown = function (e) {
            e.preventDefault();
            this._canvas.focus();
        };

        InputHandler.prototype.touchStart = function (e) {
            e.preventDefault();
            if (e.touches.length > 3) {
                this._game.nextLevel();
            } else if ((e.touches.length > 2) || (!this._game.isPlayerAlive())) {
                this._game.addKey(Digger.Key.reset);
            } else {
                for (var i = 0; i < e.touches.length; i++) {
                    this._touchPosition = new Digger.Position(e.touches[i].pageX, e.touches[i].pageY);
                }
            }
        };

        InputHandler.prototype.touchMove = function (e) {
            e.preventDefault();
            for (var i = 0; i < e.touches.length; i++) {
                if (this._touchPosition !== null) {
                    var x = e.touches[i].pageX;
                    var y = e.touches[i].pageY;
                    var direction = null;
                    if ((this._touchPosition.x - x) > 20) {
                        direction = Digger.Key.left;
                    } else if ((this._touchPosition.x - x) < -20) {
                        direction = Digger.Key.right;
                    } else if ((this._touchPosition.y - y) > 20) {
                        direction = Digger.Key.up;
                    } else if ((this._touchPosition.y - y) < -20) {
                        direction = Digger.Key.down;
                    }
                    if (direction !== null) {
                        this._touchPosition = new Digger.Position(x, y);
                        for (var i = Digger.Key.left; i <= Digger.Key.down; i++) {
                            if (direction == i) {
                                this._game.addKey(i);
                            } else {
                                this._game.removeKey(i);
                            }
                        }
                    }
                }
            }
        };

        InputHandler.prototype.touchEnd = function (e) {
            e.preventDefault();
            this._touchPosition = null;
            this._game.removeKey(Digger.Key.left);
            this._game.removeKey(Digger.Key.right);
            this._game.removeKey(Digger.Key.up);
            this._game.removeKey(Digger.Key.down);
        };

        InputHandler.prototype.stopEvent = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        return InputHandler;
    })();
    Digger.InputHandler = InputHandler;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    (function (Key) {
        Key[Key["left"] = 0] = "left";
        Key[Key["right"] = 1] = "right";
        Key[Key["up"] = 2] = "up";
        Key[Key["down"] = 3] = "down";
        Key[Key["reset"] = 4] = "reset";
    })(Digger.Key || (Digger.Key = {}));
    var Key = Digger.Key;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    var Level = (function () {
        function Level(data) {
            this._collected = 0;
            this._time = 5000;
            this._score = 0;

            this._map = [];
            for (var x = 0; x < 20; x++) {
                this._map[x] = [];
            }

            var reader = new Digger.Base64Reader(data);

            for (var y = 0; y < 14; y++) {
                for (var x = 0; x < 10; x++) {
                    var b = reader.readByte();
                    this._map[x * 2 + 1][y] = b & 0x0f;
                    this._map[x * 2][y] = b >> 4;
                }
            }

            for (var i = 0; i < 5; i++) {
                reader.readByte();
            }

            this._player = new Digger.Player(new Digger.Position(reader.readByte(), reader.readByte() - 2));
            this._map[this._player.position.x][this._player.position.y] = Digger.Sprite.player;
            this._diamonds = reader.readByte();
            this._diamonds = (this._diamonds >> 4) * 10 + (this._diamonds & 0x0f);

            var ghostData = [];
            for (var i = 0; i < 8; i++) {
                ghostData.push(reader.readByte());
            }
            var index = 0;
            this._ghosts = [];
            for (var y = 0; y < 14; y++) {
                for (var x = 0; x < 20; x++) {
                    if ((this._map[x][y] === Digger.Sprite.ghost90L) || (this._map[x][y] === Digger.Sprite.ghost90R) || (this._map[x][y] === Digger.Sprite.ghost90LR) || (this._map[x][y] === Digger.Sprite.ghost180)) {
                        var info = ((index & 1) !== 0) ? (ghostData[index >> 1] & 0x0f) : (ghostData[index >> 1] >> 4);
                        var direction = (info < 4) ? [Digger.Direction.down, Digger.Direction.up, Digger.Direction.right, Digger.Direction.left][info] : Digger.Direction.none;
                        var lastTurn = ((index & 1) !== 0) ? Digger.Direction.right : Digger.Direction.left;
                        this._ghosts.push(new Digger.Ghost(new Digger.Position(x, y), this._map[x][y], direction, lastTurn));
                        index++;
                    }
                }
            }
        }
        Object.defineProperty(Level.prototype, "time", {
            get: function () {
                return this._time;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Level.prototype, "diamonds", {
            get: function () {
                return this._diamonds;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Level.prototype, "collected", {
            get: function () {
                return this._collected;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Level.prototype, "isPlayerAlive", {
            get: function () {
                return this._player.alive;
            },
            enumerable: true,
            configurable: true
        });

        Level.prototype.updateScore = function () {
            var score = this._score;
            this._score = 0;
            return score;
        };

        Level.prototype.update = function () {
            for (var y = 13; y >= 0; y--) {
                for (var x = 19; x >= 0; x--) {
                    if (this._map[x][y] === Digger.Sprite.buffer) {
                        this._map[x][y] = Digger.Sprite.nothing;
                    }
                }
            }

            // reset sound state
            this._soundTable = [false, false, false];
        };

        Level.prototype.playSound = function (sound) {
            return this._soundTable[sound];
        };

        Level.prototype.move = function () {
            for (var y = 13; y >= 0; y--) {
                for (var x = 19; x >= 0; x--) {
                    if ((this._map[x][y] === Digger.Sprite.stone) || (this._map[x][y] === Digger.Sprite.diamond) || (this._map[x][y] === Digger.Sprite.uvstone)) {
                        var dx = x;
                        var dy = y;
                        if (this._map[x][y + 1] === Digger.Sprite.nothing) {
                            dy = y + 1;
                        } else {
                            if ((this._map[x][y + 1] === Digger.Sprite.stone) || (this._map[x][y + 1] === Digger.Sprite.diamond)) {
                                if ((this._map[x - 1][y + 1] === Digger.Sprite.nothing) && (this._map[x - 1][y] === Digger.Sprite.nothing)) {
                                    dx = x - 1;
                                    dy = y + 1;
                                } else if ((this._map[x + 1][y + 1] === Digger.Sprite.nothing) && (this._map[x + 1][y] === Digger.Sprite.nothing)) {
                                    dx = x + 1;
                                    dy = y + 1;
                                }
                            }
                            if ((this._map[x][y + 1] === Digger.Sprite.changer) && ((this._map[x][y] === Digger.Sprite.stone) || (this._map[x][y] === Digger.Sprite.uvstone)) && (this._map[x][y + 2] === Digger.Sprite.nothing)) {
                                dy = y + 2;
                            }
                        }
                        if ((dx != x) || (dy != y)) {
                            this._map[dx][dy] = Digger.Sprite.marker;
                        }
                    }
                }
            }

            for (var y = 13; y >= 0; y--) {
                for (var x = 19; x >= 0; x--) {
                    if ((this._map[x][y] === Digger.Sprite.stone) || (this._map[x][y] === Digger.Sprite.diamond) || (this._map[x][y] === Digger.Sprite.uvstone)) {
                        var dx = x;
                        var dy = y;
                        if (this._map[x][y + 1] === Digger.Sprite.marker) {
                            dy = y + 1;
                        } else {
                            if ((this._map[x][y + 1] === Digger.Sprite.stone) || (this._map[x][y + 1] === Digger.Sprite.diamond) || (this._map[x][y + 1] === Digger.Sprite.nothing)) {
                                if ((this._map[x - 1][y + 1] === Digger.Sprite.marker) && ((this._map[x - 1][y] === Digger.Sprite.nothing) || (this._map[x - 1][y] === Digger.Sprite.marker))) {
                                    dx = x - 1;
                                    dy = y + 1;
                                } else if ((this._map[x + 1][y + 1] === Digger.Sprite.marker) && ((this._map[x + 1][y] === Digger.Sprite.nothing) || (this._map[x + 1][y] === Digger.Sprite.marker))) {
                                    dx = x + 1;
                                    dy = y + 1;
                                }
                            }
                            if ((this._map[x][y + 1] === Digger.Sprite.changer) && ((this._map[x][y] === Digger.Sprite.stone) || (this._map[x][y] === Digger.Sprite.uvstone)) && (this._map[x][y + 2] === Digger.Sprite.marker)) {
                                dy = y + 2;
                            }
                        }
                        if ((dx != x) || (dy != y)) {
                            if ((dy - y) === 2) {
                                this._map[dx][dy] = Digger.Sprite.diamond;
                            } else {
                                this._map[dx][dy] = this._map[x][y];
                                if (this._map[dx][dy] === Digger.Sprite.uvstone) {
                                    this._map[dx][dy] = Digger.Sprite.stone;
                                }
                            }
                            this._map[x][y] = Digger.Sprite.nothing;

                            if ((this._map[dx][dy + 1] === Digger.Sprite.stone) || (this._map[dx][dy + 1] === Digger.Sprite.diamond) || (this._map[dx][dy + 1] === Digger.Sprite.wall) || (this.isGhost(dx, dy + 1))) {
                                this._soundTable[Digger.Sound.stone] = true;
                            }

                            if (this.isPlayer(dx, dy + 1)) {
                                this._player.kill();
                            }
                            if (this.isGhost(dx, dy + 1)) {
                                this.killGhost(dx, dy + 1);
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < this._ghosts.length; i++) {
                this.moveGhost(this._ghosts[i]);
            }

            if (this._time > 0) {
                this._time--;
            }
            if (this._time === 0) {
                this._player.kill();
            }
        };

        Level.prototype.movePlayer = function (keys) {
            if (this._player.alive) {
                this._player.direction = Digger.Direction.none;
                var p = this._player.position.clone();
                var d = p.clone();
                var z = d.clone();
                if (keys[Digger.Key.left]) {
                    z.x--;
                    this._player.direction = Digger.Direction.left;
                } else {
                    this._player.stone[0] = false;
                    if (keys[Digger.Key.right]) {
                        z.x++;
                        this._player.direction = Digger.Direction.right;
                    } else {
                        this._player.stone[1] = false;
                        if (keys[Digger.Key.up]) {
                            z.y--;
                            this._player.direction = Digger.Direction.up;
                        } else if (keys[Digger.Key.down]) {
                            z.y++;
                            this._player.direction = Digger.Direction.down;
                        }
                    }
                }
                if (!d.equals(z)) {
                    if (this._map[z.x][z.y] === Digger.Sprite.nothing) {
                        this.placePlayer(d.x, d.y);
                    }
                    if (this._map[z.x][z.y] === Digger.Sprite.diamond) {
                        this._collected += 1;
                        this._score += 3;
                        this._soundTable[Digger.Sound.diamond] = true;
                    }
                    if (this._map[z.x][z.y] === Digger.Sprite.stone) {
                        if ((z.x > d.x) && (this._map[z.x + 1][z.y] === Digger.Sprite.nothing)) {
                            if (this._player.stone[1]) {
                                this._map[d.x + 2][d.y] = this._map[d.x + 1][d.y];
                                this._map[d.x + 1][d.y] = Digger.Sprite.nothing;
                            }
                            this._player.stone[1] = !this._player.stone[1];
                        }

                        if ((z.x < d.x) && (this._map[z.x - 1][z.y] === Digger.Sprite.nothing)) {
                            if (this._player.stone[0]) {
                                this._map[d.x - 2][d.y] = this._map[d.x - 1][d.y];
                                this._map[d.x - 1][d.y] = Digger.Sprite.nothing;
                            }
                            this._player.stone[0] = !this._player.stone[0];
                        }
                    }

                    if ((this._map[z.x][z.y] === Digger.Sprite.nothing) || (this._map[z.x][z.y] === Digger.Sprite.ground) || (this._map[z.x][z.y] === Digger.Sprite.diamond)) {
                        this.placePlayer(z.x, z.y);
                        this._map[d.x][d.y] = Digger.Sprite.buffer;
                        this._soundTable[Digger.Sound.step] = true;
                    }

                    if ((this._map[z.x][z.y] === Digger.Sprite.exit) || (this._map[z.x][z.y] === Digger.Sprite.uvexit)) {
                        if (this._collected >= this._diamonds) {
                            return true;
                        }
                    }

                    if (this.isGhost(z.x, z.y)) {
                        this._player.kill();
                    }
                }

                // animate player
                this._player.animate();
            }
            return false;
        };

        Level.prototype.isPlayer = function (x, y) {
            return (this._map[x][y] === Digger.Sprite.player);
        };

        Level.prototype.placePlayer = function (x, y) {
            this._map[x][y] = Digger.Sprite.player;
            this._player.position.x = x;
            this._player.position.y = y;
        };

        Level.prototype.isGhost = function (x, y) {
            return (this._map[x][y] == Digger.Sprite.ghost90L) || (this._map[x][y] == Digger.Sprite.ghost90R) || (this._map[x][y] == Digger.Sprite.ghost90LR) || (this._map[x][y] == Digger.Sprite.ghost180);
        };

        Level.prototype.moveGhost = function (ghost) {
            if (ghost.alive) {
                var p = ghost.position.clone();
                var w = [p.clone(), p.clone(), p.clone(), p.clone()];
                if ((ghost.type === Digger.Sprite.ghost180) || (ghost.type === Digger.Sprite.ghost90L) || (ghost.type === Digger.Sprite.ghost90R)) {
                    if (ghost.type === Digger.Sprite.ghost180) {
                        if (ghost.direction === Digger.Direction.left) {
                            w[0].x--;
                            w[1].x++;
                        }
                        if (ghost.direction === Digger.Direction.right) {
                            w[0].x++;
                            w[1].x--;
                        }
                        if (ghost.direction === Digger.Direction.up) {
                            w[0].y--;
                            w[1].y++;
                        }
                        if (ghost.direction === Digger.Direction.down) {
                            w[0].y++;
                            w[1].y--;
                        }
                    } else if (ghost.type === Digger.Sprite.ghost90L) {
                        if (ghost.direction === Digger.Direction.left) {
                            w[0].x--;
                            w[1].y++;
                            w[2].y--;
                            w[3].x++;
                        }
                        if (ghost.direction === Digger.Direction.right) {
                            w[0].x++;
                            w[1].y--;
                            w[2].y++;
                            w[3].x--;
                        }
                        if (ghost.direction === Digger.Direction.up) {
                            w[0].y--;
                            w[1].x--;
                            w[2].x++;
                            w[3].y++;
                        }
                        if (ghost.direction === Digger.Direction.down) {
                            w[0].y++;
                            w[1].x++;
                            w[2].x--;
                            w[3].y--;
                        }
                    } else if (ghost.type === Digger.Sprite.ghost90R) {
                        if (ghost.direction === Digger.Direction.left) {
                            w[0].x--;
                            w[1].y--;
                            w[2].y++;
                            w[3].x++;
                        }
                        if (ghost.direction === Digger.Direction.right) {
                            w[0].x++;
                            w[1].y++;
                            w[2].y--;
                            w[3].x--;
                        }
                        if (ghost.direction === Digger.Direction.up) {
                            w[0].y--;
                            w[1].x++;
                            w[2].x--;
                            w[3].y++;
                        }
                        if (ghost.direction === Digger.Direction.down) {
                            w[0].y++;
                            w[1].x--;
                            w[2].x++;
                            w[3].y--;
                        }
                    }
                    for (var i = 0; i < 4; i++) {
                        if (!p.equals(w[i])) {
                            var d = w[i].clone();
                            if (this.isPlayer(d.x, d.y)) {
                                this._player.kill();
                            }
                            if (this._map[d.x][d.y] === Digger.Sprite.nothing) {
                                if (d.x < p.x) {
                                    ghost.direction = Digger.Direction.left;
                                }
                                if (d.x > p.x) {
                                    ghost.direction = Digger.Direction.right;
                                }
                                if (d.y < p.y) {
                                    ghost.direction = Digger.Direction.up;
                                }
                                if (d.y > p.y) {
                                    ghost.direction = Digger.Direction.down;
                                }
                                this.placeGhost(d.x, d.y, ghost);
                                this._map[p.x][p.y] = Digger.Sprite.nothing;
                                return;
                            }
                        }
                    }
                } else if (ghost.type === Digger.Sprite.ghost90LR) {
                    if (ghost.direction === Digger.Direction.left) {
                        w[0].x--;
                        w[3].x++;
                        if (ghost.lastTurn === Digger.Direction.left) {
                            w[1].y--;
                            w[2].y++;
                        } else {
                            w[1].y++;
                            w[2].y--;
                        }
                    } else if (ghost.direction === Digger.Direction.right) {
                        w[0].x++;
                        w[3].x--;
                        if (ghost.lastTurn === Digger.Direction.left) {
                            w[1].y++;
                            w[2].y--;
                        } else {
                            w[1].y--;
                            w[2].y++;
                        }
                    } else if (ghost.direction === Digger.Direction.up) {
                        w[0].y--;
                        w[3].y++;
                        if (ghost.lastTurn === Digger.Direction.left) {
                            w[1].x++;
                            w[2].x--;
                        } else {
                            w[1].x--;
                            w[2].x++;
                        }
                    } else if (ghost.direction === Digger.Direction.down) {
                        w[0].y++;
                        w[3].y--;
                        if (ghost.lastTurn === Digger.Direction.left) {
                            w[1].x--;
                            w[2].x++;
                        } else {
                            w[1].x++;
                            w[2].x--;
                        }
                    }
                    for (var i = 0; i < 4; i++) {
                        if (!p.equals(w[i])) {
                            var d = w[i].clone();
                            if (this.isPlayer(d.x, d.y)) {
                                this._player.kill();
                            }
                            if (this._map[d.x][d.y] === Digger.Sprite.nothing) {
                                var lastDirection = ghost.direction;
                                if (d.x < p.x) {
                                    ghost.direction = Digger.Direction.left;
                                }
                                if (d.x > p.x) {
                                    ghost.direction = Digger.Direction.right;
                                }
                                if (d.y < p.y) {
                                    ghost.direction = Digger.Direction.up;
                                }
                                if (d.y > p.y) {
                                    ghost.direction = Digger.Direction.down;
                                }
                                if (lastDirection === Digger.Direction.left) {
                                    if (ghost.direction === Digger.Direction.down) {
                                        ghost.lastTurn = Digger.Direction.left;
                                    }
                                    if (ghost.direction === Digger.Direction.up) {
                                        ghost.lastTurn = Digger.Direction.right;
                                    }
                                } else if (lastDirection === Digger.Direction.right) {
                                    if (ghost.direction === Digger.Direction.down) {
                                        ghost.lastTurn = Digger.Direction.right;
                                    }
                                    if (ghost.direction === Digger.Direction.up) {
                                        ghost.lastTurn = Digger.Direction.left;
                                    }
                                } else if (lastDirection === Digger.Direction.up) {
                                    if (ghost.direction === Digger.Direction.left) {
                                        ghost.lastTurn = Digger.Direction.left;
                                    }
                                    if (ghost.direction === Digger.Direction.right) {
                                        ghost.lastTurn = Digger.Direction.right;
                                    }
                                } else if (lastDirection === Digger.Direction.down) {
                                    if (ghost.direction === Digger.Direction.left) {
                                        ghost.lastTurn = Digger.Direction.right;
                                    }
                                    if (ghost.direction === Digger.Direction.right) {
                                        ghost.lastTurn = Digger.Direction.left;
                                    }
                                }
                                this.placeGhost(d.x, d.y, ghost);
                                this._map[p.x][p.y] = Digger.Sprite.nothing;
                                return;
                            }
                        }
                    }
                }
            }
        };

        Level.prototype.placeGhost = function (x, y, ghost) {
            this._map[x][y] = ghost.type;
            ghost.position.x = x;
            ghost.position.y = y;
        };

        Level.prototype.killGhost = function (x, y) {
            var ghost = this.ghost(x, y);
            if (ghost.alive) {
                for (var dy = y - 1; dy <= y + 1; dy++) {
                    for (var dx = x - 1; dx <= x + 1; dx++) {
                        if ((dx > 0) && (dx < 19) && (dy > 0) && (dy < 13)) {
                            if (this.isPlayer(dx, dy)) {
                                this._player.kill();
                            } else {
                                if (this.isGhost(dx, dy)) {
                                    this.ghost(dx, dy).kill();
                                    this._score += 99;
                                }
                                this._map[dx][dy] = Digger.Sprite.nothing;
                            }
                        }
                    }
                }

                ghost.kill();
            }
        };

        Level.prototype.ghost = function (x, y) {
            for (var i = 0; i < this._ghosts.length; i++) {
                var ghost = this._ghosts[i];
                if ((x == ghost.position.x) && (y == ghost.position.y)) {
                    return ghost;
                }
            }
            return null;
        };

        Level.prototype.getSpriteIndex = function (x, y, blink) {
            switch (this._map[x][y]) {
                case Digger.Sprite.nothing:
                case Digger.Sprite.uvexit:
                case Digger.Sprite.buffer:
                case Digger.Sprite.marker:
                case Digger.Sprite.uvstone:
                    return 0;
                case Digger.Sprite.stone:
                    return 1;
                case Digger.Sprite.ground:
                    return 2;
                case Digger.Sprite.diamond:
                    return 13 - ((blink + 4) % 6);
                case Digger.Sprite.wall:
                    return 14;
                case Digger.Sprite.exit:
                    return 32;
                case Digger.Sprite.changer:
                    return 33;
                case Digger.Sprite.ghost90L:
                case Digger.Sprite.ghost90R:
                case Digger.Sprite.ghost90LR:
                case Digger.Sprite.ghost180:
                    return this.ghost(x, y).imageIndex;
                case Digger.Sprite.player:
                    if ((x == this._player.position.x) && (y == this._player.position.y)) {
                        return this._player.imageIndex;
                    }
                    return 15;
            }
        };
        return Level;
    })();
    Digger.Level = Level;
})(Digger || (Digger = {}));
Digger.Game.prototype.levelData = [
    "ZmZmZmZmZmZmZmUiIiIcEmIiJlZgEmZiERJiIiZWYCJlYhESYmZmVmAlZWYiIlJiIlZgJVVWZlIiYiFWZmZmVVZWZmIiVmERElVWVmVSIVZmFSBWVlZiUiFWYRWgZlZWYlIhVmYVIGVWVmJSIVZhFSBlUhJVUiFWZhUhZVISVVIiVmZmZmZmZmZmZmYBAECcQAQLUwAAAAAAAAAA",
    "ZmZmZmZmZmZmZmoBAiIiIiIAARZmZgImZmFiVVVWYiICJlVhYiIiJmJRUSZVYWIAARZiJlZmVWFiVVVWYiZVVlVRYiIiJmImVlZVYWIiIiZiJlVmZmFiIiImYiZlVWwhIiIiJmIiZlYiJmZmIhZiIiZmIiIiIiEWYiACIiERVVVVVmZmZmZmZmZmZmYCnEA4QQEDQgAAAAAAAAAA",
    "ZmZmZmZmZmZmZmERERERERFhERZgAiIiIiIiYREWYAIiIiIiIm7u5mACZiIiIiEiIqZgAiImIiIlJSLGYAIiIiISIiElVm4iIiIiIiIiIiZgBlZWFVZmZmZmYAYGVhVWAAAAVmAGBlZlZgAAAFZgAAYGZWAAAABWYAAABmVVVVVVVmZmZmZmZmZmZmYDOEHUQRIGNgAAAAAAAAAA",
    "ZmZmZmZmZmZmZmVVVVVlFRUVFRZgAHAAYAcAAAAGYREREWIiIiIixmEREREiIiIiIiZu7u7iIiIRESImYiIiIiIiFRUiJmIiIiISImZmIiZhEREhEiIiJiIWYiIqIhESIhYSVmZmZiISIiVWUiZiISEiEiJSJiIWZRIiIRIhERYiVmZmZmZmZmZmZmYE1EGsUQULIAAAAAAAAAAA",
    "ZmZmZmZmZmZmZmFhVSIiJlVQASZqIiIlZlYiIGYmYGBgZmImAABiJmBgYGUBJgMAYmZgYGBmBmZhImUmY2BgYQZmFmBmBmBgYGY2IiVgxiZlYGBlBmAGYCYGYmBgZSFgBlBWJmViY2ZmYBZRVgZiZWABJmAmZmYmZWVlUlZgUgICBmZmZmZmZmZmZmYFrFHYTwEEICIAAAAAAAAA",
    "ZmZmZmbGZmZmZmIAAAAHAAAAAFZlZmZmZmZmZmYmYmUiIiIiIiJWVmViZmZmYmZmJiZiYmAAAPAABiZWZWJgZmZmZgYmJmJiYGAFUAYGJlZlYmAAYAYABiYmYmJmZmZmZmYmVmVlIiIiIiIiViZiZmZmamZmZmZWZQAAAAAAAAAAJmZmZmZmZmZmZmYG2E9wQgkNGDIAAAAAAAAA",
    "ZmZmZmZmZmZmZmEREREVVVa7u8ZiIiIi5VVWu7u2YwAAABVVVgu7tmIiIiLlVVYAAAZiIiIiFVVWEAAGYiIiImZmZhZmZmMQAiIiIiISIiZhEiIgIiIiEiImYRJSICIiIhIiJmEVVSAiIiISIiZhEREgIiIiEiImYqIiIyIiIiIiJmZmZmZmZmZmZmYHcEKoQwIOJiIiIiIiIiIh",
    "ZmZmZmZmZmZmZmIiIiIiIiIRIiZiEhISEhIiIiImYSEhISEhIiIiJmZmZmZmZgLiIiZiERERERHmIiImYiIiIiIiBiIiJmIiIiIiIAYiIiZiIiIiIgAGIiImYiIiIiAABiIiJmIiIiIiIiYiIiZiIiIiIiEWZmYmaiIiIiIiIiIiLGZmZmZmZmZmZmYIqEMMQwEOEQAAAAAAAAAA",
    "ZmZmZmZmZmZmZmIiIiJrAAAAAAZjADAFZmBmZgMGYiImJmAAAAYABmAANrZmJmYGMAZiIiYGMAAGBgMGYAMGBlVVVgYABmIiJgZVVTYGMAZgMAYGVVVWBgMGYiImBmZmZgYABmMABgAAAAAGMAZiIiZmZmZmZgAGaiImwAAAAAAABmZmZmZmZmZmZmYJDENERAEOFSIgMAICMCAg",
    "ZmZmZmZmZmZmZmIiIiIiIiIiIiZiIiIiIiIiIiImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIiIiIiIiIiImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIiIiIiIiIiIma7u7u7AAACEiJmu7u7uwAAABEiZlVVVVVVVVUiImbFVVVVVVVVIipmZmZmZmZmZmZmYQRER0UBIOJyIiIiIiIiIi",
    "ZmZmZmZmZmZmZmJiYmJiYmJiYmZiYmJiAmJiYmLGYmJiAgICYmJiBmJiAgICAgJiAgZiAgICsgICAgIGYgICsgKyAgICtmICsgICArICsgZisgICAgICsgIGYgICAmICAgICBmICAmJiYgICAmZiAmJiYmJiAmJmamJiYmJiYmJiZmZmZmZmZmZmZmYRdFDgRAEOAAAAAAAAAAAA",
    "ZmZmZmZmZmZmZmIREREREiIiJhZiIiIiIiIiIiYWYiIiIiIiIiImFmoiIiIiIiIiJiZiISEhBiIiIiImYiIiIgYiYiIiJmIiIiImImIAICZiIiEhJiJu7u7mYiIiIiIiYAAABmADAwAAAGAAAAZmYAADAABgAAAGbGUFIiIlYAAABmZmZmZmZmZmZmYS4ER8RQEGEjIgAAAAAAAA",
    "ZmZmZmZmZmZmZmISEhISEhISEhZhISEhISEhISEWYhISEhISEhISZmEhISEhISEhImZiEhISEhISEiJmYSEhISEhISZmZmIiIiIiIiIiIiZiIiImIiIiIiImYiIiJmAiIiIAtmIiIiZgZiIiIiZqIiImYG4iIiImbCIiJmBiIiIiJmZmZmZmZmZmZmYTfEUYRgENIDAAAAAAAAAA",
    "ZmZmZmZmZmZmZmsLAAICAgICAlZlVVUGAgICAgJWZmZmBgICAgICVmAAAAYyMjIyMlZgZmZmZmZmZmFWYAAABmxVIiJiJmZmZgBmZiIiYiZgAAAGZVUgAGImYGZmZmZmILBiJmAAAKZVVSAAYiZmZmYGZmYgsGImYAAABlVVIABiJmZmZmZmZmZmZmYUGEa0RgYMIyIRERIwAAAA",
    "ZmZmZmZmZmZmZmAAAlUSIhISEhZhIgJVUgISEiEmZRIAVVIiEhIhJmESAFZmIhISEhZhEgVmIiISEhIWZmAGZSIiIiIiJmFgFRVgAAAAAAZhYGZmVWMAMAA2YKBlVlVmAzAwBmZjZlZVVgMDMwZmAwZWZlYwAwA2ZszGVVVWMAAABmZmZmZmZmZmZmYVtEbsRwILMCIzMyIjIjMy",
    "ZmZmZmZmZmZmZmIVESJhFiIhIlZiFSIioiAAAmZmYhVmEgBgAAIhVmIRFhABYCIiISZiIVZgImIiMAIWZmYSBRVlYgMBJmIiElERZWIAMhZiZmZmZmZiAwEmYSERASVVESIiJm4RIiIiUiIiISZlJTAAABAAEhUWZQESUiEgDCFRVmZmZmZmZmZmZmYW7EckSQgEICMjMAAAAAAA",
    "ZmZmZmZmZmZmZmERYRFiIiwRERZiomERYAMGEREWYgJhEWAANmZVVmICYRFgAwZVVVZiAmERYDAGIiImYiJmFmMABiUiJmIiIiIiIiIiUiZiJVUiIiIiIiJWYiIiIhISIlJSJmIiIiISEiIiJSZmZmZmYmZmZmZmYwAAAABVVVVVVmZmZmZmZmZmZmYXJEkQUQIEICIzMwAAAAAA",
    "ZmZmZmZmZmZmZmBWAiYiAAVhEhZvZgYmJgUCYioWYAAGJiayAmImZmZmJiImAABiIiZiFiZmZmUAYRJmYVYlZSViAGISJmEWYmJmZgBgIiZlUAAAZQYAZRJmZiZmZmIGxmYiFmAAAAAABmYgEhZgZmZmAAYhIGZmYAVWVwAAAQADBmZmZmZmZmZmZmYYEFHASREEEgAiAAAAAAAA",
    "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",
    "ZmZmZmZmZmZmZmxlImUVERJWAVZlIiBiIlFiFiZmZSZiImYi/yIiJmIiJRFRVlZmAKZmZiYmIiIiJiImYAYmAAZmEVEiVmIiJRYCIgIiBmZiZiVWIiImViIWYiIiIiImIlYiJmAQAGBmZgBmASZlFmAQYVUiIiYmZWFVFWIiZiImVmZmZmZmZmZmZmYziFMkVBIGJQAAAAAAAAAA",
    "ZmZmZmZmZmZmZmIiIiIiIiIiIiZiIiIiIiIiIiImYiIAciBwInACJmIiAAIgACIAAiZiIlACJQAiUAImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIgACIAAiAAImYiJwAiBwIgByJmIiUAIlACJQACZiIiIiIiIiIiImbKIiIiIiIiIiJmZmZmZmZmZmZmY1wFRcVQIOBiIiIiIiIiIh",
    "ZmZmZmZmZmZmZmAAdiISJSxgAHZgAAYiEVIiYAAGZQACIRUSIiUABmZmZiVSIlJmZmZgAHYiIlUAYAB2YAAGIRIiImAABmUAAiEgAiIlAAZmZmYiIAISZmZmYiUmIiICIiAAdmJVJiIiIiJgAAZiIiIiIiISYAAGagImASJQImUABmZmZmZmZmZmZmY2XFX4VQEOFyIgMAICMCAg",
    "ZmZmZmZmZmZmZmFRVRUVVRFRURZlFVFRURVVFVVWYVVVUVVVFVUVFmVRVVUVFVVVUVZhVVUVUVFRUVUWZmYmZmZmZiZmZmAAAABgAAAAAMZgAAAAYAAAAAAGYAAAAGAAAAAABmAAAAAgAAAAAAZgAAAAYBARAAAGahVVFWFVFVAVVmZmZmZmZmZmZmY3+FWUVgEOZgAAAAAAAAAA",
    "ZmZmZmZmZmZmZmERERIhERERERZhERESACIiIiImYREREiIiIiIiJmERERIiIiIiIiZiIiIiIiIiIu7mYiIiIiIiIiIiJmAAACJQAAAAAAZgAAAiVQAAAAAGYAAAIlVQAAAABmImZmYiJmbiIiZnd3d3dwAAAiImZ3fHd3AAAAIgpmZmZmZmZmZmZmY4lFYwVxIOFiIiIiIAIiIi",
    "ZmZmZmZmZmZmZmwiIiIiIiIhIiZmYiIgAHACIhEmYGIiICIiAgEiJmpiIiAiIgIiIiZgZmVgZmYGAAAGYABlYAEAdlAABmAQZWBmZgZVAAZgZmVgZ3YGVVAGYGVVYGd2BlVVBmBlVWBgAAZVVVZgZmZgZmYGZmZmYAAAAP8AAAB3dmZmZmZmZmZmZmY5MFfMVwEGJDIgAAAAAAAA",
    "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",
    "ZmZmZmZmZmZmZmJSUlVTAAAAAGZgZmJmYGYGJmBmYGMAAGAACgBgZmBgYmVgZmYmYAZgYGViUGVSUmBmYABgZmBgZmADBmBmYAAAAGBmZgZgZQAABgAAIAAGYCJmZmZmYGBgZmBlAAYGMABgYGZjYmYGAAAAAGBmYiIiIlZgY2AAxmZmZmZmZmZmZmZZZGMAZA0FFAQkIgAAAAAA",
    "ZmZmZmZmZmZmZmoAAGEAAAYiVVZiIiIlEAACIiIWYiIiEREAAAAiVmZmZmZmBmZmZmZhECJgAAAmFVFWZSIiUQAAJlFVFmZmZmVQACIiIiZiIiJlVQAiIiImYABwZmYGZmZmZmIiImAAAAYQIVZgECIgVQBSIiFWZSAibFIBFiIiJmZmZmZmZmZmZmZj4GV4ZgEDJAAAAABmZmZm",
    "ZmZmZmZmZmZmZmAAEAsAEAAAAAZgYmVmYGZmZmAGY2BmYlBsZVVgBmAQAAVgZhEWYAZgYAACZWIiImIGZVUABWpgAwBgBmZmUAJlZRUVYAZlZmUFZmIiImMGZWZmUmBiUVJgBmVmZmVgJVZVYAZlZmZmY2ZmZm4mZQAwBgAAAAAABmZmZmZmZmZmZmZkeGYQZwkINCAwEgBmZmZm",
    "ZmZmZmZmZmZmZmUhEABgAhIAAAZlIiAAYCEgAABmZSABAGFiAAAABmIAAiBlYCZmZgZgADACBWAAVVYGZmRGZmVgACFWBmAQEBBlYAEhVgZiISAgZWNRJma2YiLuImVgZmBmBmUAAAVlYGxgZgZlUABVZWBmYGYGZVUFVWoAAGAABmZmZmZmZmZmZmZlEGeoZwkONCAAAABmZmZm",
    "ZmZmZmZmZmZmZmAAAAAgAABWDBZgZmZgZmZiImYWYGVVYGVVYQZWJmBlZWBlZWIGVgZgZmVgZWZhBlYGb1VVamVVUgVmBmBmZmVmZiZmYAZgIiJmUAAwBWAGYAAAJWAAMAJeBmYSIiZSaWlpYAZlFRYWIi5eXlYGYVJVUVFSIiIlVmZmZmZmZmZmZmZnQGjYaAcIQQIwAABmZmZm",
    "ZmZmZmZmZmZmZmISIiIsIiIiISZiIiIiIiIiIiImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIiIiuzsiIiImYiIiIvVfIiIiJmIiIiK1WyIiIiZiIiIie7ciIiImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIiIiIiIiIiImYiIiIioiIiIiJmZmZmZmZmZmZmZpcGkQagkOAjMzMwAAAAAA",
    "ZmZmZmZmZmZmZmAABABURAAAQAZgBAAAQAQEQAAGZAQEREBEBAREVmAEAABAAAAEQEZgRAREQEBAAAAGYAAAAAAEBERERmREREBARAAAAAZgAEBAAAQEAEBWYEBARAREBERARmBAAEAABAAAAAZtREQARARAREBGagAAAAQAAABABmZmZmZmZmZmZmZwEGqoagEOAwAAAABmZmZm",
    "ZmZmZmZmZmZmZmERUSYiIiIiIiZiIiImMAAAACAGYLAABlVVVVVVVmIiIhYDAAAAAAZlVVVVVVVVVVVWYhISEhIAEhISFmEhISEhISEhISZiIiIiIiIiIiImYCIiIiIiIiIiJmMloAAAAAAAAAZgJQAAAAAAAAAGbBIiIiIiIiIiJmZmZmZmZmZmZmZyQGvgawQMKAAAAAAAAAAA",
    "ZmZmZmZmZmZmZmIiIiYRERYCIqZiEhImEREWAhImYSEhJhERFgIhJmISEiARERACIiZiIiImEWEWMwAGYDAAJmYWZiISJmIiIiIiIiIiIiZiIiIiIhISEhImZmbu7mIubmLmJmAAAABgADAAAAZlAAAAYAAAADAGZVAAAGAAMFAAxmZmZmZmZmZmZmZ1IG3AbRIDIBIiIgAAAAAA",
    "ZmZmZmZmZmZmZmEREWISEhEgCQZhERFiISEhIAkGYRERYRISESAJBmEREWIiIiIgCQZmERZiIiIiKgCWZmJmAzAAAiIiJmIiImIiIiIiIiZiIiJmZubmIiImZm7uYAawBlVVVmAAAAsGBrZRURZgAAALtjYGFVVWYAAAAAYABlFVxmZmZmZmZmZmZmZ2wG1gbg8HQCIAAAAAAAAA",
    "ZmZmZmZmZmZmZmIRwiIioiIiJlZiEWISEiISERZWYhFiEhIhIhEWVmIhJmZmIiIiJlZiIiYiIiADAAZWZiImJmViIiImVmIiJiZWYAMABlZgMAYiImZmZiFmYmZmYm7u7iICJmERESJgYAIiAiZu7u7iYGBiYgYmYiIiImBgsLACVmZmZmZmZmZmZmZ3YG4AbwoDJyIgAAAAAAAA",
    "ZmZmZmZmZmZmZmIiIhIiIqEiIhZhERIhESEiERImZVVQJVIlIlVbBmUiKyVRJSJSVSZlISAlJSUiURUWZVUgJSUlIlEVJmUiKyUiVSJRFRZlILAlIFUiURUmZREgJSslIlJVBmVVUCUABSJVUrZu7u7u7u7u7u7mbAAAAAAAAAAAxmZmZmZmZmZmZmaAQHAAAAwDdQAAAAAAAAAA"
];
var Digger;
(function (Digger) {
    var Player = (function () {
        function Player(position) {
            this._direction = Digger.Direction.none;
            this._stone = [false, false];
            this._step = 0;
            this._alive = true;
            this._position = position;
        }
        Player.prototype.kill = function () {
            this._alive = false;
        };

        Object.defineProperty(Player.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Player.prototype, "alive", {
            get: function () {
                return this._alive;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Player.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (value) {
                this._direction = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Player.prototype, "stone", {
            get: function () {
                return this._stone;
            },
            enumerable: true,
            configurable: true
        });

        Player.prototype.animate = function () {
            this._step++;

            switch (this._direction) {
                case Digger.Direction.left:
                case Digger.Direction.right:
                    if (this._step >= 6) {
                        this._step = 0;
                    }
                    break;
                case Digger.Direction.up:
                case Digger.Direction.down:
                    if (this._step >= 2) {
                        this._step = 0;
                    }
                    break;
                default:
                    if (this._step >= 30) {
                        this._step = 0;
                    }
                    break;
            }
        };

        Object.defineProperty(Player.prototype, "imageIndex", {
            get: function () {
                if (this._alive) {
                    if ((this._direction === Digger.Direction.left) && (this._step < 6)) {
                        return [16, 17, 18, 19, 18, 17][this._step];
                    } else if ((this._direction === Digger.Direction.right) && (this._step < 6)) {
                        return [20, 21, 22, 23, 22, 21][this._step];
                    } else if ((this._direction === Digger.Direction.up) && (this._step < 2)) {
                        return [24, 25][this._step];
                    } else if ((this._direction === Digger.Direction.down) && (this._step < 2)) {
                        return [26, 27][this._step];
                    }
                    return [15, 15, 15, 15, 15, 15, 15, 15, 28, 28, 15, 15, 28, 28, 15, 15, 15, 15, 15, 15, 29, 29, 30, 30, 29, 29, 15, 15, 15, 15][this._step];
                }
                return 31;
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    })();
    Digger.Player = Player;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    var Position = (function () {
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        Position.prototype.equals = function (position) {
            return (this.x == position.x) && (this.y == position.y);
        };

        Position.prototype.clone = function () {
            return new Position(this.x, this.y);
        };
        return Position;
    })();
    Digger.Position = Position;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    (function (Sound) {
        Sound[Sound["diamond"] = 0] = "diamond";
        Sound[Sound["stone"] = 1] = "stone";
        Sound[Sound["step"] = 2] = "step";
    })(Digger.Sound || (Digger.Sound = {}));
    var Sound = Digger.Sound;
})(Digger || (Digger = {}));
var Digger;
(function (Digger) {
    (function (Sprite) {
        Sprite[Sprite["nothing"] = 0] = "nothing";
        Sprite[Sprite["stone"] = 1] = "stone";
        Sprite[Sprite["ground"] = 2] = "ground";
        Sprite[Sprite["ghost180"] = 3] = "ghost180";
        Sprite[Sprite["uvexit"] = 4] = "uvexit";
        Sprite[Sprite["diamond"] = 5] = "diamond";
        Sprite[Sprite["wall"] = 6] = "wall";
        Sprite[Sprite["ghost90L"] = 7] = "ghost90L";
        Sprite[Sprite["marker"] = 8] = "marker";
        Sprite[Sprite["uvstone"] = 9] = "uvstone";
        Sprite[Sprite["player"] = 10] = "player";
        Sprite[Sprite["ghost90LR"] = 11] = "ghost90LR";
        Sprite[Sprite["exit"] = 12] = "exit";
        Sprite[Sprite["buffer"] = 13] = "buffer";
        Sprite[Sprite["changer"] = 14] = "changer";
        Sprite[Sprite["ghost90R"] = 15] = "ghost90R";
    })(Digger.Sprite || (Digger.Sprite = {}));
    var Sprite = Digger.Sprite;
})(Digger || (Digger = {}));
Digger.Game.prototype.imageData = [ "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" ];
Digger.Game.prototype.soundData = [ "UklGRvwDAABXQVZFZm10IBIAAAABAAEAQB8AAIA+AAACABAAAABkYXRhOAIAAITBhMGEwYTBhMGEwYTBhMGI/4j/iP+I/4j/iP+I/4j/iP+EwYTBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4j/hMGEwYTBhMGEwYTBhMGEwYj/iP+I/4j/iP+I/4j/iP+EwYTBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+EwYTBhMGEwYTBhMGI/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/hMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+EwYTBhMGEwYTBhMGI/4j/iP+I/4j/iP+EwYTBhMGEwYTBiP+I/4j/iP+I/4j/hMGEwYTBhMGEwYj/iP+I/4j/iP+I/4TBhMGEwYTBhMGI/4j/iP+I/4j/hMGEwYTBhMGEwYj/iP+I/4j/iP+EwYTBhMGEwYj/iP+I/4j/iP+EwYTBhMGEwYj/iP+I/4j/hMGEwYTBhMGEwYj/iP+I/4j/hMGEwYTBiP+I/4j/iP+EwYTBhMGEwYj/iP+I/4TBhMGEwYj/iP+I/4TBhMGEwYj/iP+I/4TBhMGEwYj/iP+I/4TBhMGI/4j/hMGEwYTBiP+I/4TBhMGI/4TBhMGI/4j/hMGI/4TBiP+EwYj/iP9BRkFulQEAAAQLc3RyZWFtdHlwZWSB6AOEAUCEhIQTTlNNdXRhYmxlRGljdGlvbmFyeQCEhAxOU0RpY3Rpb25hcnkAhIQITlNPYmplY3QAhYQBaQOShISECE5TU3RyaW5nAZWEASsERGF0ZYaShISEBk5TRGF0ZQCVhAFkgyJTft3Wm7JBhpKEl5gSVGFibGVzQXJlQmlnRW5kaWFuhpKEhIQITlNOdW1iZXIAhIQHTlNWYWx1ZQCVhAEqhIQBY54AhpKEl5gIQ2hhbm5lbHOGkoSEhA5OU011dGFibGVBcnJheQCEhAdOU0FycmF5AJWWAZKEk5YFkoSXmANNYXiGkoScnYSEAWahgwDw+T6GkoSXmA1BRlJNU1dhdmVmb3JthpKEhIQGTlNEYXRhAJWWCIQEWzhjXX+nrj4AAAAAhpKEl5gOQUZNZWFuV2F2ZWZvcm2GkoSplgijoP91PgAAAACGkoSXmANSTVOGkoScnaahg8u8sD6GkoSXmA1BRk1heFdhdmVmb3JthpKEqZYIowDw+T4AAAAAhoaGhgA=", "UklGRqIBAABXQVZFZm10IBIAAAABAAEAQB8AAIA+AAACABAAAABkYXRhfAEAAITBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4TBhMGEwYj/hMGI/4TBhMGI/4TBhMGI/4j/hMGEwYj/iP+EwYTBiP+I/4TBhMGEwYj/iP+EwYTBhMGI/4j/iP+EwYTBhMGI/4j/iP+EwYTBhMGI/4j/iP+I/4TBhMGEwYj/iP+I/4j/", "UklGRkgAAABXQVZFZm10IBIAAAABAAEAQB8AAIA+AAACABAAAABkYXRhIgAAAITBhMGEwYTBhMGEwYTBhMGI/4j/iP+I/4j/iP+I/4j/iP8=" ];

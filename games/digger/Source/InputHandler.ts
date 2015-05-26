module Digger
{
	export class InputHandler
	{
		private _canvas: HTMLCanvasElement;
		private _game: Game;
		private _touchPosition: Position;
		private _isWebKit: boolean;
		private _isMozilla: boolean;
		private _mouseDownHandler: (e: MouseEvent) => void;
		private _touchStartHandler: (e: TouchEvent) => void;
		private _touchEndHandler: (e: TouchEvent) => void;
		private _touchMoveHandler: (e: TouchEvent) => void;
		private _keyDownHandler: (e: KeyboardEvent) => void;
		private _keyPressHandler: (e: KeyboardEvent) => void;
		private _keyUpHandler: (e: KeyboardEvent) => void;

		constructor(canvas: HTMLCanvasElement, game: Game)
		{
			this._canvas = canvas;
			this._game = game;

			this._mouseDownHandler = (e: MouseEvent) => { this.mouseDown(e); };
			this._touchStartHandler = (e: TouchEvent) => { this.touchStart(e); };
			this._touchEndHandler = (e: TouchEvent) => { this.touchEnd(e); };
			this._touchMoveHandler = (e: TouchEvent) => { this.touchMove(e); };
			this._keyDownHandler = (e: KeyboardEvent) => { this.keyDown(e); };
			this._keyPressHandler = (e: KeyboardEvent) => { this.keyPress(e); };
			this._keyUpHandler = (e: KeyboardEvent) => { this.keyUp(e); };

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

		private keyDown(e: KeyboardEvent)
		{
			if (!this._isMozilla && !e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey)
			{
				this.processKey(e, e.keyCode);
			}
		}

		private keyPress(e: KeyboardEvent)
		{
			if (this._isMozilla && !e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey)
			{
				this.processKey(e, (e.keyCode != 0) ? e.keyCode : (e.charCode === 32) ? 32 : 0);
			}
		}

		private keyUp(e: KeyboardEvent)
		{
			switch (e.keyCode)
			{
				case 37: 
					this._game.removeKey(Key.left);
					break;
				case 39:
					this._game.removeKey(Key.right);
					break;
				case 38:
					this._game.removeKey(Key.up);
					break;
				case 40:
					this._game.removeKey(Key.down);
					break;
			}
		}

		private processKey(e: KeyboardEvent, keyCode)
		{
			switch (e.keyCode)
			{
				case 37: // left
					this.stopEvent(e);
					this._game.addKey(Key.left);
					break;
				case 39: // right
					this.stopEvent(e);
					this._game.addKey(Key.right);
					break;
				case 38: // up
					this.stopEvent(e);
					this._game.addKey(Key.up);
					break;
				case 40: // down
					this.stopEvent(e);
					this._game.addKey(Key.down);
					break;
				case 27: // escape
					this.stopEvent(e);
					this._game.addKey(Key.reset);
					break;
				case 8: // backspace
				case 36: // delete
					this.stopEvent(e);
					this._game.nextLevel();
					break;
				default:
					if (!this._game.isPlayerAlive())
					{
						this.stopEvent(e);
						this._game.addKey(Key.reset); 
					}
					break;
			}
		}

		private mouseDown(e: MouseEvent) 
		{
			e.preventDefault(); 
			this._canvas.focus();
		}

		private touchStart(e: TouchEvent)
		{
			e.preventDefault();
			if (e.touches.length > 3) // 4 finger touch = jump to next level
			{
				this._game.nextLevel();
			}
			else if ((e.touches.length > 2) || (!this._game.isPlayerAlive())) // 3 finger touch = restart current level
			{
				this._game.addKey(Key.reset);
			}
			else
			{
				for (var i = 0; i < e.touches.length; i++)
				{
					this._touchPosition = new Position(e.touches[i].pageX, e.touches[i].pageY);
				}
			}
		}

		private touchMove(e: TouchEvent)
		{
			e.preventDefault();
			for (var i = 0; i < e.touches.length; i++)
			{
				if (this._touchPosition !== null)
				{
					var x: number = e.touches[i].pageX;
					var y: number = e.touches[i].pageY;
					var direction: Key = null;
					if ((this._touchPosition.x - x) > 20)
					{
						direction = Key.left;
					}
					else if ((this._touchPosition.x - x) < -20)
					{
						direction = Key.right;
					}
					else if ((this._touchPosition.y - y) > 20)
					{
						direction = Key.up;
					}
					else if ((this._touchPosition.y - y) < -20)
					{
						direction = Key.down;
					}
					if (direction !== null)
					{
						this._touchPosition = new Position(x, y);			
						for (var i: number = Key.left; i <= Key.down; i++)
						{
							if (direction == i)
							{
								this._game.addKey(i);
							}
							else
							{ 
								this._game.removeKey(i);
							}
						}
					}
				}
			}
		}

		private touchEnd(e: TouchEvent)
		{
			e.preventDefault();
			this._touchPosition = null;
			this._game.removeKey(Key.left);
			this._game.removeKey(Key.right);
			this._game.removeKey(Key.up);
			this._game.removeKey(Key.down);
		}

		private stopEvent(e: Event)
		{
			e.preventDefault();
			e.stopPropagation();
		}
	}
}
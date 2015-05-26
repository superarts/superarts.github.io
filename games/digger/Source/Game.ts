module Digger
{
	export class Game
	{
		public imageData: string[];
		public soundData: string[];
		public levelData: string[];
		private _canvas: HTMLCanvasElement;
		private _context: CanvasRenderingContext2D;
		private _screenTable: number[][];
		private _imageTable: HTMLImageElement[] = [];
		private _soundTable: HTMLAudioElement[] = [];
		private _inputHandler: InputHandler;
		private _level: Level;
		private _tick: number;
		private _blink: number;
		private _score: number;
		private _lives: number;
		private _room: number;
		private _keysRelease: boolean[];
		private _keys: boolean[];

		constructor(canvas: HTMLCanvasElement)
		{
			this._canvas = canvas;
			this._canvas.focus();

			this._context = canvas.getContext("2d");
			this._context.fillStyle = "#00ffff"; 
			this._context.fillRect(0,  2, 320, 4);
			this._context.fillRect(0, 26, 320, 4);
			this._context.fillStyle = "#920205"; 
			this._context.fillRect(0, 8, 320, 16);

			for (var i = 0; i < this.soundData.length; i++)
			{
				var audio: HTMLAudioElement = <HTMLAudioElement> document.createElement('audio');
				if ((audio !== null) && (audio.canPlayType('audio/wav')))
				{
					audio.src = 'data:audio/wav;base64,' + this.soundData[i];
					audio.preload = 'auto';
					audio.load();
				}
				this._soundTable[i] = audio;
			}

			var imageIndex = 0;
			var imageCount = this.imageData.length;
			var onload = () =>
			{
				imageIndex++;
				if (imageIndex === imageCount)
				{
					this.start();
				}
			}

			for (i = 0; i < this.imageData.length; i++)
			{
				var image: HTMLImageElement = new Image();
				image.onload = onload;
				image.src = 'data:image/png;base64,' + this.imageData[i];
				this._imageTable[i] = image;
			}
		}

		private start()
		{
			this.drawText(0,  8, "  ROOM:     TIME:        DIAMONDS:      ");
			this.drawText(0, 16, "  LIVES:    SCORE:       COLLECTED:     ");

			this._screenTable = [];
			for (var x: number = 0; x < 20; x++)
			{
				this._screenTable[x] = [];
				for (var y: number = 0; y < 14; y++)
				{
					this._screenTable[x][y] = 0;
				}
			}

			this._inputHandler = new InputHandler(this._canvas, this);
			this._blink = 0;
			this.restart();
			window.setInterval(() => this.interval(), 50);
		}

		public addKey(key: Key)
		{
			if (key < 4)
			{
				this._keys[key] = true;
			}
			else if (key == Key.reset)
			{
				this._lives--;
				if (this._lives >= 0)
				{
					this.loadLevel();
				}
				else
				{
					this.restart();
				}
			}
		}

		public removeKey(key: Key)
		{
			if (key < 4)
			{
				this._keysRelease[key] = true;
			}
		}

		private restart()
		{
			this._lives = 20;
			this._score = 0;
			this._room = 0;
			this.loadLevel();
		}

		private loadLevel()
		{
			this._level = new Level(this.levelData[this._room]);
			this._keys = [ false, false, false, false ];
			this._keysRelease = [ false, false, false, false ];
			this._tick = 0;
			this.paint();
		}

		public nextLevel()
		{
			if (this._room < (this.levelData.length - 1))
			{
				this._room++;
				this.loadLevel();
			}
		}

		public isPlayerAlive(): boolean
		{
			return (this._level === null) || (this._level.isPlayerAlive);
		}

		private interval()
		{
			this._tick++;
			this._blink++;
			if (this._blink == 6)
			{
				this._blink = 0;
			}
			if ((this._tick % 2) === 0)
			{
				// keyboard
				for (var i: number = 0; i < 4; i++)
				{
					if (this._keysRelease[i])
					{
						this._keys[i] = false;
						this._keysRelease[i] = false;
					}
				}

				this._level.update();
				if (this._level.movePlayer(this._keys))
				{
					this.nextLevel();
				}
				else
				{
					this._level.move();

					// play sound
					for (var i: number = 0; i < this.soundData.length; i++)
					{
						if (this._soundTable[i] && this._level.playSound(i))
						{
							if (!!this._soundTable[i].currentTime)
							{
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
		}

		private paint()
		{
			var blink: number = ((this._blink + 4) % 6);

			// update statusbar
			this._context.fillStyle = "#920205"; 
			this.drawText(9 * 8,  8, this.formatNumber(this._room + 1, 2));
			this.drawText(9 * 8, 16, this.formatNumber(this._lives, 2));
			this.drawText(19 * 8, 16, this.formatNumber(this._score, 5));
			this.drawText(19 * 8,  8, this.formatNumber(this._level.time, 5));
			this.drawText(36 * 8,  8, this.formatNumber(this._level.diamonds, 2));
			this.drawText(36 * 8, 16, this.formatNumber(this._level.collected, 2));

			// paint sprites
			for (var x: number = 0; x < 20; x++)
			{
				for (var y: number = 0; y < 14; y++)
				{
					var spriteIndex = this._level.getSpriteIndex(x, y, blink);
					if (this._screenTable[x][y] != spriteIndex)
					{
						this._screenTable[x][y] = spriteIndex;
						this._context.drawImage(this._imageTable[0], spriteIndex * 16, 0, 16, 16, x * 16, y * 16 + 32, 16, 16);
					}
				}
			}
		}

		private drawText(x: number, y: number, text: string)
		{
			for (var i = 0; i < text.length; i++)
			{
				var index: number = text.charCodeAt(i) - 32;
				this._context.fillRect(x, y, 8, 8);
				this._context.drawImage(this._imageTable[1], 0, index * 8, 8, 8, x, y, 8, 8);
				x += 8;
			}	
		}

		private formatNumber(value: number, digits: number): string
		{
			var text: string = value.toString();
			while (text.length < digits)
			{
				text = "0" + text;
			}
			return text; 
		}
	}
}
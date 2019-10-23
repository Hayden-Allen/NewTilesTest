function DebugInfo(){	//formats string containing debugging info for display underneath canvas
	//player coordinates
	this.x = 0;
	this.y = 0;

	this.sprites = 0;	//sprites drawn this frame
	this.minSprites = 0;	//minimum sprites drawn in current Scene
	this.maxSprites = 0;	//maximum sprites drawn in current Scene

	this.fps = 0;	//current framerate
	this.avgfps = 0;	//average framerate
	this.totalfps = 0;	//total framerate
	this.updates = 1;	//number of updates

	this.pad = function(places, num){	//formats string
		var s = num + "";
		while(s.length < places) s = "0" + s;
		return s;
	}

	//for if totalfps overflows
	var temp = new Date();
	this.avgfpsstart = this.pad(2, temp.getHours()) + ":" + this.pad(2, temp.getMinutes()) + ":" + this.pad(2, temp.getSeconds());

	this.update = function(x, y, sprites, minSprites, maxSprites, fps){
		this.x = x;
		this.y = y;

		this.sprites = sprites;
		this.minSprites = minSprites;
		this.maxSprites = maxSprites;

		this.fps = Math.round(fps);	//round because it looks better
		this.totalfps += fps;
		this.updates++;
		//if overflow, reset
		if(this.updates > Number.MAX_SAFE_INTEGER || this.totalfps > Number.MAX_SAFE_INTEGER){
			this.updates = 1;
			this.totalfps = fps;
			var temp = new Date();
			this.avgfpsstart = this.pad(2, temp.getHours()) + ":" + this.pad(2, temp.getMinutes()) + ":" + this.pad(2, temp.getSeconds());
		}
		this.avgfps = Math.round(this.totalfps / this.updates);
	}
	this.string = function(){	//format and return string
		return `{ Player: (${this.x}, ${this.y}) | Player Tile: (${parseInt(this.x / Global.tilesize)}, ${parseInt(this.y / Global.tilesize)}) |
				Sprites: ${this.sprites} (min: ${this.minSprites}, max: ${this.maxSprites}) |
				FPS: ${this.fps} | Average FPS: ${this.avgfps} (since ${this.avgfpsstart}) }`;
	}
}

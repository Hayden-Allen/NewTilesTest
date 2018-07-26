function DebugInfo(){
	this.x = 0;
	this.y = 0;
	
	this.sprites = 0;
	this.minSprites = 0;
	this.maxSprites = 0;
	
	this.fps = 0;
	this.avgfps = 0;
	this.totalfps = 0;
	this.updates = 1;
	
	this.pad = function(places, num){
		var s = num + "";
		while(s.length < places) s = "0" + s;
		return s;
	}
	
	var temp = new Date();
	this.avgfpsstart = this.pad(2, temp.getHours()) + ":" + this.pad(2, temp.getMinutes()) + ":" + this.pad(2, temp.getSeconds());
	
	this.update = function(x, y, sprites, minSprites, maxSprites, fps){
		this.x = x;
		this.y = y;
		
		this.sprites = sprites;
		this.minSprites = minSprites;
		this.maxSprites = maxSprites;
		
		this.fps = Math.round(fps);
		this.totalfps += fps;
		this.updates++;
		if(this.updates > Number.MAX_SAFE_INTEGER || this.totalfps > Number.MAX_SAFE_INTEGER){
			this.updates = 1;
			this.totalfps = fps;
			var temp = new Date();
			this.avgfpsstart = this.pad(2, temp.getHours()) + ":" + this.pad(2, temp.getMinutes()) + ":" + this.pad(2, temp.getSeconds());
		}
		this.avgfps = Math.round(this.totalfps / this.updates);
	}
	this.string = function(){
		return `{ Player: (${this.x}, ${this.y}) | Player Tile: (${parseInt(this.x / Global.tilesize)}, ${parseInt(this.y / Global.tilesize)}) |
				Sprites: ${this.sprites} (min: ${this.minSprites}, max: ${this.maxSprites}) | 
				FPS: ${this.fps} | Average FPS: ${this.avgfps} (since ${this.avgfpsstart}) }`;
	}
}
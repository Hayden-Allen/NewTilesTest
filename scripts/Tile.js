class Tile {
	constructor(src, x, y, extra){
		this.img = new Image();
		this.img.src = src;
		
		this.extra = extra ? extra : {};
		this.x = x;
		this.y = y;
		this.w = (this.extra.w ? this.extra.w : 1) * Global.tilesize;
		this.h = (this.extra.h ? this.extra.h : 1) * Global.tilesize;
		
		this.grid = this.extra.grid !== undefined ? this.extra.grid : true;
		this.alpha = this.extra.alpha !== undefined ? this.extra.alpha : 1;
		this.rigid = this.extra.rigid !== undefined ? this.extra.rigid : false;
		
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		this.center = {
			x: this.wx + this.w / 2,
			y: this.wy + this.y / 2
		}
		
		this.children = [];
		
		if(this.extra.add || this.extra.add === undefined)
			Global.currentScene.add(this);
	}
	addChild(tile){
		this.children.push(tile);
	}
	addX(x){
		this.x += x;
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.center.x = this.wx + this.w / 2;
		
		this.children.forEach(function(c){
			c.addX(x);
		});
	}
	addY(y){
		this.y += y;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		this.center.y = this.wy + this.y / 2;
		
		this.children.forEach(function(c){
			c.addY(y);
		});
	}
	setX(x){
		this.x = x;
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.center.x = this.wx + this.w / 2;
		
		this.children.forEach(function(c){
			c.setX(x);
		});
	}
	setY(y){
		this.y = y;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		this.center.y = this.wy + this.y / 2;
		
		this.children.forEach(function(c){
			c.setY(y);
		});
	}
	draw(time, offx, offy){
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(this.img, this.wx + offx, this.wy + offy, this.w, this.h);
		
		this.children.forEach(function(c){
			c.draw(time, offx + c.wx, offy + c.wy);
		});
	}
}
class AnimatedTile extends Tile {
	constructor(frames, time, src, x, y, extra){
		super(src, x, y, extra);
		this.frames = frames;
		this.frame = 0;
		this.frameTime = time / frames;
		this.last = performance.now();
		this.cropw = extra && extra.cropw ? extra.cropw : undefined;
		this.croph = extra && extra.croph ? extra.croph : undefined;
		
		var self = this;
		this.img.onload = function(){
			if(self.cropw === undefined)
				self.cropw = self.img.width / self.frames;
			if(self.croph === undefined)
				self.croph = self.img.height;
		}
	}
	draw(time, offx, offy){
		if(time - this.last >= this.frameTime){
			this.frame = (this.frame + 1) % this.frames;
			this.last = performance.now();
		}
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(this.img, this.frame * this.cropw, 0, this.cropw, this.croph, this.wx + offx, this.wy + offy, this.w, this.h);
	}
}
function TileStretch(src, x, y, w, h, extra){
	extra = extra ? extra : {};
	var width = extra.w ? extra.w : Global.tilesize, height = extra.h ? extra.h : Global.tilesize;
	
	for(var i = 0; i < h; i++)
		for(var j = 0; j < w; j++)
			new Tile(src, x + j, y + i, width, height, extra);
}
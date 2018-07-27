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
		this.zindex = this.extra.zindex !== undefined ? this.extra.zindex : 0;
		this.flags = this.extra.flags !== undefined ? this.extra.flags : new BitSet(0b0000010);
		/*+-+-----------+------------+-----------+-------+----------+-------+-----------+
		 *|7|		6   |      5     |	4  	   	 |	3  	 |	2 	  	|	1  	|	0  		|	index
		 *+-+-----------+------------+-----------+-------+----------+-------+-----------+
		 *| |Destructive|Destructible|From Player|Movable|Projectile|Visible|Rigid group|	flag
		 *+-+-----------+------------+-----------+-------+----------+-------+-----------+
		 *| | 		0   | 	0	     | 	0  	     | 0	 | 	0	    |	1  	|     0     |	default
		 *+-+-----------+------------+-----------+-------+----------+-------+-----------+
		 */
	
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		this.center = {
			x: this.wx + this.w / 2,
			y: this.wy + this.h / 2
		}
		
		this.children = [];
		
		if(this.extra.add || this.extra.add === undefined)
			Global.currentScene.add(this);
	}
	addChild(tile){
		this.children.push(tile);
	}
	removeChild(tile){
		for(var i = 0; i < this.children.length; i++){
			if(this.children[i] === tile){
				this.children.splice(i, 1);
				break;
			}
		}
	}
	setSrc(src){
		this.img.src = src;
	}
	addX(x){
		this.x += x;
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.center.x = this.wx + this.w / 2;
	}
	addY(y){
		this.y += y;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		this.center.y = this.wy + this.h / 2;
	}
	setX(x){
		this.x = x;
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.center.x = this.wx + this.w / 2;
	}
	setWX(wx){
		this.wx = wx;
		this.x = this.wx / (this.grid ? Global.tilesize : 1);
		this.center.x = this.wx + this.h / 2;
	}
	setY(y){
		this.y = y;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		this.center.y = this.wy + this.h / 2;
	}
	setWY(wy){
		this.wy = wy;
		this.y = this.wy / (this.grid ? Global.tilesize : 1);
		this.center.y = this.wy + this.h / 2;
	}
	draw(time, offx, offy){
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(this.img, this.wx + offx, this.wy + offy, this.w, this.h);
		if(this.rigid)
			Tools.testRigids(this);
		
		var self = this;
		this.children.forEach(function(c){
			c.draw(time, offx + self.wx, offy + self.wy);
		});
	}
}
function TileStretch(src, x, y, w, h, extra){
	extra = extra ? extra : {};
	var width = extra.w ? extra.w : Global.tilesize, height = extra.h ? extra.h : Global.tilesize;
	
	for(var i = 0; i < h; i++)
		for(var j = 0; j < w; j++)
			new Tile(src, x + j, y + i, width, height, extra);
}
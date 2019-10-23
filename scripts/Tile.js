class Tile {
	constructor(src, x, y, extra){
		this.img = new Image();	//texture
		this.img.src = src;	//filepath of image

		this.extra = extra ? extra : {};	//optional parameters
		//Scene coordinates
		this.x = x;
		this.y = y;
		//width and height
		this.w = (this.extra.w ? this.extra.w : 1) * Global.tilesize;
		this.h = (this.extra.h ? this.extra.h : 1) * Global.tilesize;

		//set values from optional parameters
		this.grid = this.extra.grid !== undefined ? this.extra.grid : true;
		this.alpha = this.extra.alpha !== undefined ? this.extra.alpha : 1;
		this.rigid = this.extra.rigid !== undefined ? this.extra.rigid : false;
		this.zindex = this.extra.zindex !== undefined ? this.extra.zindex : 0;
		this.flags = this.extra.flags !== undefined ? this.extra.flags : new BitSet(0b0000010);	//visible only
		/*+-+-----------+------------+-----------+-------+----------+-------+-----------+
		 *|7|		6   |      5     |	4  	   	 |	3  	 |	2 	  	|	1  	|	0  		|	index
		 *+-+-----------+------------+-----------+-------+----------+-------+-----------+
		 *| |Destructive|Destructible|From Player|Movable|Projectile|Visible|Rigid group|	flag
		 *+-+-----------+------------+-----------+-------+----------+-------+-----------+
		 *| | 		0   | 	0	     | 	0  	     | 0	 | 	0	    |	1  	|     0     |	default
		 *+-+-----------+------------+-----------+-------+----------+-------+-----------+
		 */

		//world coordinates
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		//coordinate of center of rectangle
		this.center = {
			x: this.wx + this.w / 2,
			y: this.wy + this.h / 2
		}

		//Tiles that are attached to this Tile
		this.children = [];

		//automatically add to Scene
		if(this.extra.add || this.extra.add === undefined)
			Global.currentScene.add(this);
	}
	addChild(tile){	//add Tile to child array. Items are put here so that they automatically follow the player around
		this.children.push(tile);
	}
	removeChild(tile){	//remove Tile from child array
		for(var i = 0; i < this.children.length; i++){
			if(this.children[i] === tile){
				this.children.splice(i, 1);
				break;
			}
		}
	}
	setSrc(src){	//change texture
		this.img.src = src;
	}
	addX(x){	//move along x-axis and recalculate center point
		this.x += x;
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.center.x = this.wx + this.w / 2;
	}
	addY(y){	//move along y-axis and recalculate center point
		this.y += y;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		this.center.y = this.wy + this.h / 2;
	}
	setX(x){	//set Scene grid x position
		this.x = x;
		this.wx = (this.grid ? Global.tilesize : 1) * this.x;
		this.center.x = this.wx + this.w / 2;
	}
	setWX(wx){	//set world x position
		this.wx = wx;
		this.x = this.wx / (this.grid ? Global.tilesize : 1);
		this.center.x = this.wx + this.h / 2;
	}
	setY(y){	//set Scene grid y position
		this.y = y;
		this.wy = (this.grid ? Global.tilesize : 1) * this.y;
		this.center.y = this.wy + this.h / 2;
	}
	setWY(wy){	//set world y position
		this.wy = wy;
		this.y = this.wy / (this.grid ? Global.tilesize : 1);
		this.center.y = this.wy + this.h / 2;
	}
	draw(time, offx, offy){	//draw and prevent collision with other tiles. Do so for all children as well
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
function TileStretch(src, x, y, w, h, extra){	//generates rectangular grid of Tiles
	extra = extra ? extra : {};
	var width = extra.w ? extra.w : Global.tilesize, height = extra.h ? extra.h : Global.tilesize;

	for(var i = 0; i < h; i++)
		for(var j = 0; j < w; j++)
			new Tile(src, x + j, y + i, width, height, extra);
}

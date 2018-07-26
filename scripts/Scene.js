class Scene {
	constructor(lightMin){
		this.layers = [];
		this.layers.push([]);
		this.bounds = {};
		this.lightMin = lightMin;
		this.lightMap = [];
		this.lights = [];
		this.rigids = [];
		this.updatables = [];
		this.ui = [];
	}
	remove(obj){
		for(var i = 0; i < this.layers.length; i++)
			for(var j = 0; j < this.layers[i].length; j++)
				if(this.layers[i][j] === obj){
					this.layers[i].splice(j, 1);
					return;
				}
	}
	removeUpdatable(u){
		for(var i = 0; i < this.updatables.length; i++)
			if(this.updatables[i] === u){
				this.updatables.splice(i, 1);
				return;
			}
	}
	add(obj){
		if(obj.update)
			this.updatables.push(obj);
		else{
			var z = obj.zindex !== undefined ? obj.zindex : 0;
			if(z == -1)
				this.ui.push(obj);
			else{
				while(this.layers.length - 1 < z)
					this.layers.push([]);
				this.layers[z].push(obj);
				
				if(obj.wx !== undefined && obj.wy !== undefined){	//is tile
					this.bounds.left = this.bounds.left !== undefined ? Math.min(this.bounds.left, obj.wx) : obj.wx;
					this.bounds.right = this.bounds.right !== undefined ? Math.max(this.bounds.right, obj.wx + obj.w) : obj.wx + obj.w;
					this.bounds.top = this.bounds.top !== undefined ? Math.min(this.bounds.top, obj.wy) : obj.wy;
					this.bounds.bottom = this.bounds.bottom !== undefined ? Math.max(this.bounds.bottom, obj.wy + obj.h) : obj.wy + obj.h;
					
					if(obj.extra.light)
						this.lights.push({
							x: (obj.wx - this.bounds.left) / Global.tilesize, 
							y: (obj.wy - this.bounds.top) / Global.tilesize, 
							i: obj.extra.light
						});
					if(obj.extra.rigid)
						this.rigids.push(obj);
				}
			}
		}
	}
	finalize(){
		for(var i = 0; i < (this.bounds.bottom - this.bounds.top) / Global.tilesize; i++)
			this.lightMap.push(new Array((this.bounds.right - this.bounds.left) / Global.tilesize).fill(this.lightMin));

		var self = this;
		function propagate(x, y, i){
			var value = Tools.clamp(self.lightMin + i, -Global.lightMax, Global.lightMax);
			var sign = Math.sign(i);
			if(i == 0 || (x < 0 || x >= self.lightMap[0].length || y < 0 || y >= self.lightMap.length) ||
				sign * self.lightMap[y][x] > sign * value)
				return;
				
			self.lightMap[y][x] = value;
			
			propagate(x, y - 1, i - sign);
			propagate(x - 1, y, i - sign);
			propagate(x, y + 1, i - sign);
			propagate(x + 1, y, i - sign);
		}
		
		this.lights.forEach(function(l){
			propagate(l.x, l.y, l.i);
		});
	}
}
class Scene {
	constructor(lightMin){
		this.layers = [];
		this.layers.push([]);
		this.bounds = {};
		this.lightMin = lightMin;
		this.lightMap = [];
		this.lights = [];
		this.rigids = [];
		this.updateables = [];
	}
	add(obj){
					
		if(obj.wx !== undefined && obj.wy !== undefined){	//is tile
			this.bounds.left = this.bounds.left ? Math.min(this.bounds.left, obj.wx) : obj.wx;
			this.bounds.right = this.bounds.right ? Math.max(this.bounds.right, obj.wx + obj.w) : obj.wx + obj.w;
			this.bounds.top = this.bounds.top ? Math.min(this.bounds.top, obj.wy) : obj.wy;
			this.bounds.bottom = this.bounds.bottom ? Math.max(this.bounds.bottom, obj.wy + obj.h) : obj.wy + obj.h;
			
			if(obj.extra.light)
				this.lights.push({
					x: (obj.wx - this.bounds.left) / Global.tilesize, 
					y: (obj.wy - this.bounds.top) / Global.tilesize, 
					i: Math.min(Global.lightMax - this.lightMin, obj.extra.light)
				});
			if(obj.extra.rigid)
				this.rigids.push(obj);
		}
		
		if(obj.update)
			this.updateables.push(obj);
		else
			this.layers[0].push(obj);
	}
	finalize(){
		for(var i = 0; i < (this.bounds.bottom - this.bounds.top) / Global.tilesize; i++){
			var row = [];
			for(var j = 0; j < (this.bounds.right - this.bounds.left) / Global.tilesize; j++)
				row.push(this.lightMin);
			this.lightMap.push(row);
		}

		var self = this;
		function propagate(x, y, i){
			var value = Math.min(Global.lightMax, self.lightMin + i);
			if(i <= 0 || (x < 0 || x >= self.lightMap[0].length || y < 0 || y >= self.lightMap.length) ||
				self.lightMap[y][x] >= value)
				return;
				
			self.lightMap[y][x] = value;
			
			propagate(x, y - 1, i - 1);
			propagate(x - 1, y, i - 1);
			propagate(x, y + 1, i - 1);
			propagate(x + 1, y, i - 1);
		}
		
		this.lights.forEach(function(l){
			propagate(l.x, l.y, l.i);
		});
	}
}
class Scene {	//holds Tiles and light data
	constructor(lightMin){
		this.layers = [];	//layers of Tiles
		this.layers.push([]);	//add first layer (zindex 0)

		this.bounds = {};	//top, left, right, and bottom -most boundaries of Tiles in this Scene

		this.lightMin = lightMin;	//minimum light value for any Tile
		this.lightMap = [];	//grid of light values
		this.lights = [];	//light objects used to calculate lightMap

		this.rigids = [];	//separate array of rigid Tiles for faster processing
		this.updatables = [];	//separate array of Tiles with an update function
		this.ui = [];	//UI elements to be drawn after everything else
	}
	remove(obj){	//remove obj from all arrays that contain it
		var found = false;
		//while not found, seach
		//on find, remove from array
		for(var i = 0; !found && i < this.layers.length; i++){
			for(var j = 0; !found && j < this.layers[i].length; j++){
				if(this.layers[i][j] === obj){
					this.layers[i].splice(j, 1);
					found = true;
				}
			}
		}
		//remove from rigid array as well
		if(obj.rigid){
			for(var i = 0; i < this.rigids.length; i++){
				if(this.rigids[i] === obj){
					this.rigids.splice(i, 1);
					return;
				}
			}
		}
	}
	//remove object from updatable array
	removeUpdatable(u){
		for(var i = 0; i < this.updatables.length; i++){
			if(this.updatables[i] === u){
				this.updatables.splice(i, 1);
				return;
			}
		}
	}
	//add Tile to all appropriate arrays
	add(obj){
		if(obj.update)	//if it has an update method
			this.updatables.push(obj);
		else{
			var z = obj.zindex !== undefined ? obj.zindex : 0;	//layer to put this Tile in

			if(z == -1)	//put in UI instead of layer
				this.ui.push(obj);
			else {
				while(this.layers.length - 1 < z)	//create empty layers until necessary one exists
					this.layers.push([]);
				this.layers[z].push(obj);	//add to correct layer

				if(obj.wx !== undefined && obj.wy !== undefined){	//is tile
					if(!obj.flags.at(Global.Flags.fromPlayer)){	//if not a player-created Tile (like arrow from bow)
						this.bounds.left = this.bounds.left !== undefined ? Math.min(this.bounds.left, obj.wx) : obj.wx;
						this.bounds.right = this.bounds.right !== undefined ? Math.max(this.bounds.right, obj.wx + obj.w) : obj.wx + obj.w;
						this.bounds.top = this.bounds.top !== undefined ? Math.min(this.bounds.top, obj.wy) : obj.wy;
						this.bounds.bottom = this.bounds.bottom !== undefined ? Math.max(this.bounds.bottom, obj.wy + obj.h) : obj.wy + obj.h;
					}

					if(obj.extra.light){	//if has a light value, put in light array from lightMap creation
						this.lights.push({
							x: (obj.wx - this.bounds.left) / Global.tilesize,
							y: (obj.wy - this.bounds.top) / Global.tilesize,
							i: obj.extra.light
						});
					}
					if(obj.extra.rigid)	//automatically add to rigid array
						this.rigids.push(obj);
				}
			}
		}
	}
	propagate(x, y, i){	//spreads light out from a source and updates lightMap
		var value = Tools.clamp(this.lightMin + i, -Global.lightMax, Global.lightMax);	//value of light at (x, y) created by current light
		var sign = Math.sign(i);	//sign of light value (- or +)
		//if out of bounds or current value > new value
		if(i == 0 || (x < 0 || x >= this.lightMap[0].length || y < 0 || y >= this.lightMap.length) ||
			sign * this.lightMap[y][x] > sign * value)
			return;

		this.lightMap[y][x] = value;	//set to new value

		//propagate in all cardinal directions
		this.propagate(x, y - 1, i - sign);
		this.propagate(x - 1, y, i - sign);
		this.propagate(x, y + 1, i - sign);
		this.propagate(x + 1, y, i - sign);
	}
	finalize(){
		//create lightMap
		for(var i = 0; i < (this.bounds.bottom - this.bounds.top) / Global.tilesize; i++)
			this.lightMap.push(new Array((this.bounds.right - this.bounds.left) / Global.tilesize).fill(this.lightMin));

		//fill lightMap
		var self = this;
		this.lights.forEach(function(l){
			self.propagate(l.x, l.y, l.i);
		});
	}
}

class Camera {	//calculates coordinate offsets and displays Scene
	constructor(target){
		this.target = target;	//Tile to calculate offsets based on
		//debugging info
		this.maxSprites = 0;	//max number of sprites displayed in current Scene
		this.minSprites = Number.MAX_SAFE_INTEGER;	//min number of sprites displayed in current Scene
		this.sprites = 0;	//sprites displayed in current frame
	}
	draw(t, time, offx, offy){
		//if Tile is visible based on current offsets, display it
		if(t.flags.at(Global.Flags.visible) && ((t.wx + t.w > this.target.tile.center.x - c.width / 2 && t.wy < this.target.tile.center.x + c.width / 2) &&
			(t.wy + t.h > this.target.tile.center.y - c.height / 2 && t.wy < this.target.tile.center.y + c.height / 2) ||
			(t !== self.target || t.zindex == -1))){
			t.draw(time, offx, offy);
			this.sprites++;
		}
	}
	render(scene){
		this.target.update(time, offx, offy);	//update target Tile before calculating offsets

		var time = performance.now(), self = this;
		var cx = this.target.tile.center.x, cy = this.target.tile.center.y;	//coordinates of center of target Tile
		//target.x + offx = c.width / 2 - target.w / 2
		//offx = c.width / 2 - target.w / 2 - target.x = c.width / 2 - (target.x + target.w / 2) = c.width / 2 - cx
		var offx = c.width / 2 - cx, offy = c.height / 2 - cy;
		this.sprites = 0;	//reset per frame sprite counter

		//if possible, bound offset coordinates to Scene so that dead space isn't displayed
		if(scene.bounds.right - scene.bounds.right > c.width && scene.bounds.bottom - scene.bounds.top > c.height){
			if(cx - scene.bounds.left < c.width / 2)
				offx = -scene.bounds.left;
			if(scene.bounds.right - cx < c.width / 2)
				offx = -scene.bounds.right + c.width;
			if(cy - scene.bounds.top < c.height / 2)
				offy = -scene.bounds.top;
			if(scene.bounds.bottom - cy < c.height / 2)
				offy = -scene.bounds.bottom + c.height;
		}

		//round to integer to avoid weird lighting effects
		offx = Math.round(offx);
		offy = Math.round(offy);

		//update all before drawing
		scene.updatables.forEach(function(u){
			u.update(time, offx, offy);
		});

		//draw first layer
		scene.layers[0].forEach(function(t){
			self.draw(t, time, offx, offy);
		});

		//draw target on top of first layer
		this.target.draw(time, offx, offy);
		this.sprites++;

		//draw remaining layers
		for(var i = 1; i < scene.layers.length; i++)
			scene.layers[i].forEach(function(t){
				self.draw(t, time, offx, offy);
			});

		//draw lighting effects on top of Scene
		var lm = scene.lightMap;
		for(var i = 0; i < lm.length; i++)
			for(var j = 0; j < lm[i].length; j++)
				Tools.rect(
					scene.bounds.left + i * Global.tilesize + offx,
					scene.bounds.top + j * Global.tilesize + offy,
					Global.tilesize,
					Global.tilesize,
					"#000000", 1 - ((1 / Global.lightMax) * scene.lightMap[i][j]));

		//draw UI elements on top of everything else
		scene.ui.forEach(function(t){
			self.draw(t, time, 0, 0);
		});

		//update min and max sprite counters
		this.minSprites = Math.min(this.minSprites, this.sprites);
		this.maxSprites = Math.max(this.maxSprites, this.sprites);
	}
}

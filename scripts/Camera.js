class Camera {
	constructor(target){
		this.target = target;
		this.maxSprites = 0;
		this.minSprites = Number.MAX_SAFE_INTEGER;
		this.sprites = 0;
	}
	draw(t, time, offx, offy){
		if((t.wx + t.w > this.target.tile.center.x - c.width / 2 && t.wy < this.target.tile.center.x + c.width / 2 &&
			t.wy + t.h > this.target.tile.center.y - c.height / 2 && t.wy < this.target.tile.center.y + c.height / 2 &&
			t !== self.target || t.zindex == -1) && t.flags.at(Global.Flags.visible)){
			t.draw(time, offx, offy);
			this.sprites++;
		}
	}
	render(scene){
		this.target.update(time, offx, offy);
		
		var time = performance.now(), self = this;
		var cx = this.target.tile.center.x, cy = this.target.tile.center.y;
		var offx = c.width / 2 - cx, offy = c.height / 2 - cy;
		this.sprites = 0;
	
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
		
		offx = Math.round(offx);
		offy = Math.round(offy);
		
		scene.updatables.forEach(function(u){
			u.update(time, offx, offy);
		});
		
		scene.layers[0].forEach(function(t){
			self.draw(t, time, offx, offy);
		});
		
		this.target.draw(time, offx, offy);
		this.sprites++;
		
		for(var i = 1; i < scene.layers.length; i++)
			scene.layers[i].forEach(function(t){
				self.draw(t, time, offx, offy);
			});
		
		var lm = scene.lightMap;
		for(var i = 0; i < lm.length; i++)
			for(var j = 0; j < lm[i].length; j++)
				Tools.rect(scene.bounds.left + i * Global.tilesize + offx, scene.bounds.top + j * Global.tilesize + offy, Global.tilesize, Global.tilesize, 
					"#000000", 1 - ((1 / Global.lightMax) * scene.lightMap[i][j]));
					
		scene.ui.forEach(function(t){
			self.draw(t, time, 0, 0);
		});
		
		this.maxSprites = Math.max(this.maxSprites, this.sprites);
		this.minSprites = Math.min(this.minSprites, this.sprites);
	}
}
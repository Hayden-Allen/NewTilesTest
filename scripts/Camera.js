class Camera {
	constructor(target){
		this.target = target;
	}
	render(scene){		
		scene.updateables.forEach(function(u){
			u.update();
		});
		
		var cx = this.target.tile.center.x, cy = this.target.tile.center.y;
		var offx = c.width / 2 - cx, offy = c.height / 2 - cy;
	
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
						
		var time = performance.now(), self = this;
		
		scene.layers[0].forEach(function(t){
			if(t !== self.target)
				t.draw(time, offx, offy);
		});
		
		this.target.draw(time, offx, offy);
		
		var lm = scene.lightMap;
		for(var i = 0; i < lm.length; i++)
			for(var j = 0; j < lm[i].length; j++)
				Tools.rect(scene.bounds.left + i * Global.tilesize + offx, scene.bounds.top + j * Global.tilesize + offy, Global.tilesize, Global.tilesize, 
					"#000000", 1 - ((1 / Global.lightMax) * scene.lightMap[i][j]));
	}
}
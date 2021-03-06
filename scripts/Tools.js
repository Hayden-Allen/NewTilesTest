var Tools = {	//contains utility functions
	rect: function(x, y, w, h, color, opacity){	//draws colored rectangle at given coordinates
		ctx.fillStyle = color;
		ctx.globalAlpha = opacity;
		ctx.fillRect(x, y, w, h);
	},
	angle: function(x1, y1, x2, y2){	//angle between (x1, y1) and (x2, y2)
		var dx = x1 - x2, dy = y1 - y2;
		var theta = Math.atan(dy / dx);

		if(dx >= 0)
			theta = Math.PI * 2 - theta;
		else{
			if(dy <= 0)
				theta = Math.PI - theta;
			else
				theta = Math.PI * 3 - theta;
		}

		if(theta > Math.PI * 2)
			theta -= Math.PI * 2;
		if(theta < 0)
			theta += Math.PI * 2;

		return {dx: dx, dy: dy, theta: theta, deg: theta * (180 / Math.PI), sin: Math.sin(theta), cos: Math.cos(theta)};
	},
	sleep: function(ms){	//wait for the specified number of milliseconds
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	debug: function(target, msg){	//sets text value of <p> tags
		document.getElementById(target).innerHTML = msg;
	},
	clamp: function(val, min, max){	//clamps x to [min, max]
		return Math.max(Math.min(val, max), min);
	},
	testRigids: function(tile){	//prevent collisions with a given Tile
		var collision = false;
		Global.currentScene.rigids.forEach(function(r){
			if(!(tile.flags.at(Global.Flags.rigidGroup) && r.flags.at(Global.Flags.rigidGroup))){
				var angle = Tools.angle(tile.center.x, tile.center.y, r.center.x, r.center.y).deg;

				if((angle > 45 && angle <= 135) &&
				   (tile.wx + tile.w > r.wx && tile.wx < r.wx + r.w && tile.wy + tile.h > r.wy)){
					if(tile.flags.at(Global.Flags.movable))
						tile.setWY(r.wy - tile.h);
					collision = true;
				}
				else if((angle > 135 && angle <= 225) &&
						(tile.wy + tile.h > r.wy && tile.wy < r.wy + r.h && tile.wx + tile.w > r.wx)){
					if(tile.flags.at(Global.Flags.movable))
						tile.setWX(r.wx - tile.w);
					collision = true;
				}
				else if((angle > 225 && angle <= 315) &&
						(tile.wx + tile.w > r.wx && tile.wx < r.wx + r.w && tile.wy < r.wy + r.h)){
					if(tile.flags.at(Global.Flags.movable))
						tile.setWY(r.wy + r.h);
					collision = true;
				}
				else if((angle > 315 || angle <= 45) &&
						(tile.wy + tile.h > r.wy && tile.wy < r.wy + r.h && tile.wx < r.wx + r.w)){
					if(tile.flags.at(Global.Flags.movable))
						tile.setWX(r.wx + r.w);
					collision = true;
				}

				if(collision){
					if(r.flags.at(Global.Flags.destructive) && tile.flags.at(Global.Flags.destructible))
						Global.currentScene.remove(tile);
					return;
				}
			}
		});
		return collision;
	}
}

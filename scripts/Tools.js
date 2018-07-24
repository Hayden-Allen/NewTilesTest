var Tools = {
	rect: function(x, y, w, h, color, opacity){
		ctx.fillStyle = color;
		ctx.globalAlpha = opacity;
		ctx.fillRect(x, y, w, h);
	},
	angle: function(x1, y1, x2, y2){
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
	sleep: function(ms){
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	debug: function(target, msg){
		document.getElementById(target).innerHTML = msg;
	},
	clamp: function(val, min, max){
		return Math.max(Math.min(val, max), min);
	},
	testRigids: function(tile){
		Global.currentScene.rigids.forEach(function(r){
			var angle = Tools.angle(tile.center.x, tile.center.y, r.center.x, r.center.y).deg;
			
			if((angle > 45 && angle <= 135) &&
				tile.wx + tile.w > r.x && tile.wx < r.x + r.w && tile.wy + tile.h > r.y)
				tile.setY(r.y - tile.h);
			if((angle > 135 && angle <= 225) &&
				tile.wy + tile.h > r.y && tile.wy < r.y + r.h && tile.wx + tile.w > r.x)
				tile.setX(r.x - tile.w);
			if((angle > 225 && angle <= 315) &&
				tile.wx + tile.w > r.x && tile.wx < r.x + r.w && tile.wy < r.y + r.h)
				tile.setY(r.y + r.h);
			if((angle > 315 || angle <= 45) &&
				tile.wy + tile.h > r.y && tile.wy < r.y + r.h && tile.wx < r.x + r.w)
				tile.setX(r.x + r.w);
		});
	}
}
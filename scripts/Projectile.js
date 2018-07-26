class Projectile {
	constructor(src, x, y, extra, speed, direction){
		extra.flags = new BitSet(0b110);
		this.tile = new Tile(src, x, y, extra);
		this.speed = speed;
		this.direction = direction;
		this.orientation = (Math.PI / 2) * (direction.x + Math.max(0, direction.y * 2));
		
		var self = this;
		this.tile.draw = function(time, offx, offy){
			ctx.save();
			ctx.translate(self.tile.center.x + offx, self.tile.center.y + offy);
			ctx.rotate(self.orientation);
			ctx.drawImage(self.tile.img, self.tile.wx - self.tile.center.x, self.tile.wy - self.tile.center.y, self.tile.w, self.tile.h);
			ctx.restore();
		}
		
		Global.currentScene.add(this);
	}
	update(time, offx, offy){
		this.tile.addX(this.speed * this.direction.x);
		this.tile.addY(this.speed * this.direction.y);
		
		//this.tile.draw(time, offx, offy);
		
		var collision = Tools.testRigids(this.tile);
		
		if(collision || this.tile.wy < Global.currentScene.bounds.top || this.tile.wy + this.tile.h > Global.currentScene.bounds.bottom ||
			this.tile.wx < Global.currentScene.bounds.left || this.tile.wx + this.tile.w > Global.currentScene.bounds.right){
				Global.currentScene.remove(this.tile);
				Global.currentScene.removeUpdatable(this);
				if(this.onDestroy)
					this.onDestroy();
			}
	}
}
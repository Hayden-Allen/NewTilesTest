class Projectile {	//Tile that moves in a direction until it hits something
	constructor(src, x, y, extra, speed, direction){
		if(extra.flags)	//force projectile flag
			extra.flags.set(Global.Flags.projectile, true);
		else
			extra.flags = new BitSet(0b110);	//non-rigid, visible, projectile

		this.tile = new Tile(src, x, y, extra);
		this.speed = speed;	//number of pixels to scale direction vector by
		this.direction = direction;	//vector containing x and y components of movement
		this.orientation = (Math.PI / 2) * (direction.x + Math.max(0, direction.y * 2));	//used for graphical rotation

		var self = this;
		this.tile.draw = function(time, offx, offy){
			ctx.save();	//save canvas state
			ctx.translate(self.tile.center.x + offx, self.tile.center.y + offy);	//move origin to center of Tile
			ctx.rotate(self.orientation);	//apply rotation
			//draw Tile
			ctx.drawImage(self.tile.img, self.tile.wx - self.tile.center.x, self.tile.wy - self.tile.center.y, self.tile.w, self.tile.h);
			ctx.restore();	//reset canvas state
		}

		Global.currentScene.add(this);	//add to Scene for automatic updates and rendering
	}
	update(time, offx, offy){
		//update position
		this.tile.addX(this.speed * this.direction.x);
		this.tile.addY(this.speed * this.direction.y);

		var collision = Tools.testRigids(this.tile);	//whether or not someting has been hit

		if(collision ||	//if something has been hit and it's not the end of the Scene
		   (this.tile.wy < Global.currentScene.bounds.top || this.tile.wy + this.tile.h > Global.currentScene.bounds.bottom) ||
		   (this.tile.wx < Global.currentScene.bounds.left || this.tile.wx + this.tile.w > Global.currentScene.bounds.right)){
				//remove from Scene
				Global.currentScene.remove(this.tile);
				Global.currentScene.removeUpdatable(this);
			}
	}
}

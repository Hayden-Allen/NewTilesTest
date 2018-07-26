class Player extends Character{
	constructor(tile, inventory, speed){
		super(tile, inventory, speed);
		
		var self = this;
		this.controls = new Controls(this.tile, {speed: this.speed * Global.tilesize}, function(keys){
			var speed = this.extra.speed;
			if(!keys.log2())
				speed /= Global.sqrt2;
			
			speed *= Global.delta;
			
			this.target.addX(Math.round((keys.at(0) * speed) - (keys.at(2) * speed)));
			this.target.addY(Math.round((keys.at(1) * speed) - (keys.at(3) * speed)));
				
			this.target.setX(Tools.clamp(this.target.wx, Global.currentScene.bounds.left, Global.currentScene.bounds.right - this.target.w));
			this.target.setY(Tools.clamp(this.target.wy, Global.currentScene.bounds.top, Global.currentScene.bounds.bottom - this.target.h));
			
			if(keys.at(4))
				self.equipped.use();
			if(keys.value > 16)
				self.equip(9 - (parseInt(Math.log2(keys.value)) - 4));
		});
	}
}
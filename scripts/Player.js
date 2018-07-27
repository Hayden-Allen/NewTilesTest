class Player extends Character{
	constructor(tile, inventory, speed){
		super(tile, inventory, speed);
		
		var self = this;
		this.controls = new Controls(this.tile, {speed: this.speed * Global.tilesize}, function(keys){
			var speed = this.extra.speed;
			if(!keys.log2())
				speed /= Global.sqrt2;
			
			speed *= Global.delta;
			
			this.target.addX(Math.round((keys.at(Global.Keys.d) * speed) - (keys.at(Global.Keys.a) * speed)));
			this.target.addY(Math.round((keys.at(Global.Keys.s) * speed) - (keys.at(Global.Keys.w) * speed)));
				
			this.target.setX(Tools.clamp(this.target.wx, Global.currentScene.bounds.left, Global.currentScene.bounds.right - this.target.w));
			this.target.setY(Tools.clamp(this.target.wy, Global.currentScene.bounds.top, Global.currentScene.bounds.bottom - this.target.h));
			
			if(keys.at(Global.Keys._))
				self.equipped.use();
			if(keys.value > Math.pow(2, Global.Keys._))
				self.equip((Global.Keys.$1 - Global.Keys.c + 1) - (parseInt(Math.log2(keys.value)) - Global.Keys._));
		});
	}
}
class Player extends Character{	//specific Character with built in controls
	constructor(tile, inventory, speed){
		super(tile, inventory, speed);

		var self = this;
		this.controls = new Controls(this.tile, {speed: this.speed * Global.tilesize}, function(keys){
			var speed = this.extra.speed;
			if(!keys.log2())	//if moving diagonally, divide by sqrt(2) to maintain constant speed
				speed /= Global.sqrt2;

			speed *= Global.delta;	//scale by frame time

			//left (a) is -x, right (d) is +x. So total x-axis movement is right - left
			//up (w) is -y, down (s) is +x. So total y-axis movement is down - up
			this.target.addX(Math.round((keys.at(Global.Keys.d) * speed) - (keys.at(Global.Keys.a) * speed)));
			this.target.addY(Math.round((keys.at(Global.Keys.s) * speed) - (keys.at(Global.Keys.w) * speed)));

			//prevent from moving outside the Scene
			this.target.setX(Tools.clamp(this.target.wx, Global.currentScene.bounds.left, Global.currentScene.bounds.right - this.target.w));
			this.target.setY(Tools.clamp(this.target.wy, Global.currentScene.bounds.top, Global.currentScene.bounds.bottom - this.target.h));

			if(keys.at(Global.Keys._))	//when space is pressed, use item
				self.equipped.use();
			if(keys.value > Math.pow(2, Global.Keys._))	//keys to switch current Item
				self.equip((Global.Keys.$1 - Global.Keys.c + 1) - (parseInt(Math.log2(keys.value)) - Global.Keys._));
		});
	}
}

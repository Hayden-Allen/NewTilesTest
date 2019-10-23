class Item{	//held by Characters, stored in Inventory
	constructor(src, x, y, extra, attack, postCooldown){
		extra.add = false;	//don't automatically add to Scene
		this.tile = new Tile(src, x, y, extra);	//graphical representation of this Item

		this.attack = attack ? attack : function(){};	//function to be executed when used
		this.postCooldown = postCooldown ? postCooldown : function(){};	//function to be executed directly after use

		this.cooldown = extra.cooldown !== undefined ? extra.cooldown : 0;	//milliseconds between last use and next use
		this.canAttack = true;	//whether or not cooldown is active
	}
	async use(){
		if(this.canAttack){	//if active
			this.canAttack = false;	//set inactive

			await this.attack();	//use
			await Tools.sleep(this.cooldown);	//wait
			await this.postCooldown();	//cleanup

			this.canAttack = true;	//set active
		}
	}
}

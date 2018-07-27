class Item{
	constructor(src, x, y, extra, attack, postCooldown){
		extra.add = false;
		this.tile = new Tile(src, x, y, extra);
		
		this.attack = attack ? attack : function(){};
		this.postCooldown = postCooldown ? postCooldown : function(){};
		
		this.cooldown = extra.cooldown !== undefined ? extra.cooldown : 0;
		this.canAttack = true;
	}
	async use(){
		if(this.canAttack){
			this.canAttack = false;
			
			await this.attack();
			await Tools.sleep(this.cooldown);
			await this.postCooldown();
			
			this.canAttack = true;
		}
	}
}
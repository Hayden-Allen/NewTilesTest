class Item{
	constructor(src, x, y, extra, cooldown, attack){
		extra.add = false;
		this.tile = new Tile(src, x, y, extra);
		this.attack = attack ? attack : function(){};
		this.canAttack = true;
		this.cooldown = cooldown;
	}
	async use(){
		if(this.canAttack){
			this.canAttack = false;
			await this.attack();
			await Tools.sleep(this.cooldown);
			this.canAttack = true;
		}
	}
}
class Inventory {
	constructor(size, items){
		this.size = size;
		this.items = items ? items : [];
		if(this.items.length > this.size)
			this.items = items.splice(0, this.size);
	}
	get(index){
		return this.items[index];
	}
}
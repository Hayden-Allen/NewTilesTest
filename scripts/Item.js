class Item {
	constructor(src, x, y, extra, stats, attack){
		extra.add = false;
		this.tile = new Tile(src, x, y, extra);
		this.stats = stats;
		this.attack = attack;
	}
}
class Inventory {
	constructor(size, items){
		this.size = size;
		this.items = items ? items : [];
		this.equipped = this.items.length ? this.items[0] : undefined;
		if(this.items.length > this.size)
			this.items.splice(this.size, this.items.length - this.size);
	}
	add(item){
		if(this.items.length < size)
			this.items.push(item);
	}
	equip(index){
		this.equipped = this.items[index];
	}
}
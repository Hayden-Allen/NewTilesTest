class Character{
	constructor(tile, inventory, speed){
		this.tile = tile;
		this.speed = speed / 1000;
		this.direction = 0;
		
		this.inventory = inventory ? inventory : new Inventory();
		this.equipped;
		this.equip(0);
		
		Global.currentScene.add(this);
	}
	update(time, offx, offy){
		Tools.testRigids(this.tile);
	}
	draw(time, offx, offy){
		ctx.save();
		ctx.translate(this.tile.center.x + offx, this.tile.center.y + offy);
		ctx.rotate(Math.PI / 2 * this.direction);
		this.tile.draw(time, -this.tile.center.x, -this.tile.center.y);
		ctx.restore();
	}
	equip(index){
		if(index < this.inventory.items.length){
			if(this.equipped)
				this.tile.removeChild(this.equipped.tile);
			this.equipped = this.inventory.get(index);
			this.tile.addChild(this.equipped.tile);
			this.inventory.setCursor(index);
		}
	}
}
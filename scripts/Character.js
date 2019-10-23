class Character{	//Tile that moves around and has Items
	constructor(tile, inventory, speed){
		this.tile = tile;	//Tile that represents this Character
		this.speed = speed / 1000;	//movement speed (divide by 1000 to account for the fact that time delta is in ms)
		this.direction = 0;	//direction this character is facing (used to rotate)

		this.inventory = inventory ? inventory : new Inventory();	//list of Items this Character has
		this.equipped;	//Item currently equipped
		this.equip(0);

		Global.currentScene.add(this);
	}
	update(time, offx, offy){
		Tools.testRigids(this.tile);	//make sure this is not intersecting with rigid Tiles in the Scene
	}
	draw(time, offx, offy){
		ctx.save();	//save current canvas state
		ctx.translate(this.tile.center.x + offx, this.tile.center.y + offy);	//move origin to center of Tile
		ctx.rotate(Math.PI / 2 * this.direction);	//rotate about origin based on direction
		this.tile.draw(time, -this.tile.center.x, -this.tile.center.y);	//draw Tile
		ctx.restore();	//revert canvas state
	}
	equip(index){
		if(index < this.inventory.items.length){
			if(this.equipped)
				this.tile.removeChild(this.equipped.tile);	//remove current Item Tile from this Tile
			this.equipped = this.inventory.get(index);	//change equipped Item
			this.tile.addChild(this.equipped.tile);	//add new Item to this Tile
			this.inventory.setCursor(index);	//move UI cursor to new Item's position
		}
	}
}

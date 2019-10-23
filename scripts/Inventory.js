class Inventory {	//list of Items
	constructor(items, size){
		this.size = size ? Math.max(size, 9) : 9;	//max number of Items this Inventory can hold
		this.items = items ? items : [];	//list of Items
		if(this.items.length > this.size)	//remove items if given list is longer than allowed by size
			this.items = items.splice(this.size, this.items.length - this.size);

		this.tiles = [];	//for UI
		this.extra = Global.tilesize / 8;	//formatting constant
		//x coordinate of UI element that is farthest left
		this.start = Math.round(c.width / 2) - ((Global.tilesize + this.extra * 2) * 9 + this.extra * 8) / 2;
		//amount to increment x coordinate by
		this.tsize = (Global.tilesize + this.extra * 3);

		for(var i = 0; i < 9; i++)	//add UI background panels to Scene (assumes size of 9)
			this.tiles.push(new Tile(
								"assets/ui/inventory_panel.png",
								this.start + i * this.tsize,
								c.height - this.tsize,
								{
									grid: false,
									zindex: -1,
									alpha: .5,
									w: 1 + this.extra * 2 / Global.tilesize,
									h: 1 + this.extra * 2 / Global.tilesize
								}
							));
		//add UI Item sprites
		for(var i = 0; i < Math.min(9, this.items.length); i++){
			var tile = this.items[i].tile;
			this.tiles.push(new Tile(
								tile.img.src,
								this.start + this.extra + ((Global.tilesize - tile.w) / 2) + i * this.tsize,
								c.height - this.tsize + this.extra + (Global.tilesize - tile.h) / 2,
								{
									grid: false,
									zindex: -1,
									w: tile.w / Global.tilesize,
									h: tile.h / Global.tilesize
								}
							));
		}
		//UI element that hovers over currently selected Item
		this.cursor = new Tile(
						"assets/ui/cursor_fixed.png",
						this.start,
						c.height -this. tsize,
						{
							grid: false,
							zindex: -1,
							w: 1 + this.extra * 2 / Global.tilesize,
							h: 1 + this.extra * 2 / Global.tilesize
						}
					);
	}
	get(index){
		return this.items[index];
	}
	setCursor(index){	//moves cursor to x coordinate of Item at index
		this.cursor.setX(this.start + index * this.tsize);
	}
}

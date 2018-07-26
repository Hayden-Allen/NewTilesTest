class Inventory {
	constructor(items, size){
		this.size = size ? Math.max(size, 9) : 9;
		this.items = items ? items : [];
		if(this.items.length > this.size)
			this.items = items.splice(0, this.size);
		
		this.tiles = [];
		this.extra = 2;
		this.start = (c.width - (Global.tilesize + this.extra) * 9) / 2 - this.extra * 8.5;
		
		for(var i = 0; i < 9; i++)
			this.tiles.push(new Tile("assets/ui/inventory_panel.png", 
									this.start + i * (Global.tilesize + this.extra * 3),
									c.height - Global.tilesize - this.extra * 3, 
									{
										grid: false, 
										zindex: -1, 
										alpha: .5, 
										w: 1 + (this.extra * 2) / Global.tilesize, 
										h: 1 + (this.extra * 2) / Global.tilesize
									}));
			
		for(var i = 0; i < Math.min(this.items.length, 9); i++){
			var tile = this.items[i].tile;
			var w = tile.w / Global.tilesize, h = tile.h / Global.tilesize;
			this.tiles.push(new Tile(tile.img.src, 
									this.start + i * (Global.tilesize + this.extra * 3) + (Global.tilesize - w * Global.tilesize) / 2, 
									c.height - Global.tilesize - this.extra * 2 + (Global.tilesize - h * Global.tilesize) / 2, 
									{
										grid: false, 
										zindex: -1,
										w: w,
										h: h
									}));
		}
		
		this.cursor = new Tile("assets/ui/cursor_fixed.png", 
								this.start + this.extra, 
								c.height - Global.tilesize * 5 / 4 + this.extra * 3, 
								{
									grid: false, 
									zindex: -1
								});
	}
	get(index){
		return this.items[index];
	}
	setCursor(index){
		this.cursor.setX(this.start + this.extra + index * (Global.tilesize + this.extra * 3));
	}
}
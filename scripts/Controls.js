class Controls {	//provides basic framework for controlling Tiles
	constructor(target, extra, on){
		this.target = target;	//Tile to be controlled
		this.on = on;	//function to be executed
		this.extra = extra;	//extra data
		this.locked = false;	//whether or not these Controls can be used
		Global.controls.push(this);	//add to Global array for automatic updating
	}
	lock(){
		this.locked = true;
	}
	unlock(){
		this.locked = false;
	}
	update(keys){
		if(!this.locked)
			this.on(keys);
	}
}

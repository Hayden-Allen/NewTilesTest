class Controls {
	constructor(target, extra, on){
		this.target = target;
		this.on = on;
		this.extra = extra;
		this.locked = false;
		Global.controls.push(this);
	}
	update(keys){
		if(!this.locked)
			this.on(keys);
	}
}
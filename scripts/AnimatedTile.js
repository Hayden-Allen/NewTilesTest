class AnimatedTile extends Tile {
	constructor(frames, time, src, x, y, extra){
		super(src, x, y, extra);
		this.frames = frames;
		this.frame = 0;
		this.frameTime = time / frames;
		this.last = performance.now();
		this.cropw = extra && extra.cropw ? extra.cropw : undefined;
		this.croph = extra && extra.croph ? extra.croph : undefined;
		
		var self = this;
		this.img.onload = function(){
			if(self.cropw === undefined)
				self.cropw = self.img.width / self.frames;
			if(self.croph === undefined)
				self.croph = self.img.height;
		}
	}
	draw(time, offx, offy){
		if(time - this.last >= this.frameTime){
			this.frame = (this.frame + 1) % this.frames;
			this.last = performance.now();
		}
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(this.img, this.frame * this.cropw, 0, this.cropw, this.croph, this.wx + offx, this.wy + offy, this.w, this.h);
	}
}
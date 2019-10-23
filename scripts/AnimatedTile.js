class AnimatedTile extends Tile {
	constructor(frames, time, src, x, y, extra){
		super(src, x, y, extra);
		this.frames = frames;	//number of frames of animation
		this.frame = 0;	//current frame
		this.frameTime = time / frames;	//time per frame
		this.last = performance.now();	//time of last frame switch
		this.cropw = extra && extra.cropw ? extra.cropw : undefined;	//crop width for spritesheet
		this.croph = extra && extra.croph ? extra.croph : undefined;	//crop height for spritesheet

		var self = this;
		this.img.onload = function(){	//if specific crop dimensions unspecified, set them to default
			if(self.cropw === undefined)
				self.cropw = self.img.width / self.frames;
			if(self.croph === undefined)
				self.croph = self.img.height;
		}
	}
	draw(time, offx, offy){
		if(time - this.last >= this.frameTime){	//if enough time has passed, switch to next frame
			this.frame = (this.frame + 1) % this.frames;	//loops back to 0 automatically
			this.last = performance.now();
		}
		ctx.globalAlpha = this.alpha;
		//draw only current frame of sprite
		ctx.drawImage(this.img, this.frame * this.cropw, 0, this.cropw, this.croph, this.wx + offx, this.wy + offy, this.w, this.h);
	}
}

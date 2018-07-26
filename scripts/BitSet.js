function BitSet(value) {
	this.value = value;
	this.at = function(index){
		var val = new Number((this.value & Math.pow(2, index)) > 0);
		return val.valueOf();
	}
	this.set = function(index, val){
		if(this.at(index) != val)
			this.value ^= Math.pow(2, index);
		return this;
	}
	this.flip = function(index){
		this.value ^= Math.pow(2, index);
	}
	this.log2 = function(){
		return (this.value == 0) || (Math.log2(this.value) === parseInt(Math.log2(this.value)));
	}
	this.zeroSet = function(index, val){
		this.value = value;
		this.set(index, val);
	}
}
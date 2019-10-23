function BitSet(value) {
	this.value = value;
	this.at = function(index){	//true if bit at index is 1, false otherwise
		return (this.value & Math.pow(2, index)) > 0;
	}
	this.set = function(index, val){	//sets bit at index to given value (1 or 0)
		if(this.at(index) != val)
			this.value ^= Math.pow(2, index);
		return this;
	}
	this.flip = function(index){	//flips value at given index
		this.value ^= Math.pow(2, index);
	}
	this.log2 = function(){	//true if value is a power of 2
		return Math.log2(this.value) === parseInt(Math.log2(this.value));
	}
	this.zeroSet = function(index, val){	//clears array then sets bit at index to val
		this.value = 0;
		this.set(index, val);
	}
}

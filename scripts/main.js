var Global = {
	tilesize: 40,
	clearColor: "#000000",
	currentScene: null,
	keys: new BitSet(0),
	controls: [],
	sqrt2: Math.sqrt(2),
	lightMax: 15,
	delta: 0
}

var c = document.getElementById("c");
c.width = window.innerWidth - Global.tilesize;
c.height = window.innerHeight - Global.tilesize;
c.style = "border: 1px solid black;";
var ctx = c.getContext("2d");

function clearScreen(){
	requestAnimationFrame(update);
	
	ctx.clearRect(0, 0, c.width, c.height);
	Tools.rect(0, 0, c.width, c.height, Global.clearColor, 1);
	
	Global.delta = performance.now() - last;
	last = performance.now();
}

var scene1 = new Scene(10);
Global.currentScene = scene1;

//var player = new Tile("assets/tile/player.png", 100, 100, {add: false, grid: false});
var player = new Player(new Tile("assets/tile/player.png", 100, 100, {add: false, grid: false}), 
						new Inventory(5, [
							new Item("assets/item/sword.png", Global.tilesize, -Global.tilesize, {grid: false, w: .5}, {}, async function(){
								console.log("A");
								this.tile.y -= Global.tilesize / 2;
								await Tools.sleep(500);
								this.tile.y += Global.tilesize / 2;
							})
						]), 15);

TileStretch("assets/tile/grass.png", -4, -4, 16, 16);
var light = new AnimatedTile(3, 250, "assets/animation/fire.png", 0, 0, {light: 15, rigid: true});


var camera = new Camera(player.tile);

scene1.finalize();



var last = performance.now();
function update(){
	clearScreen();
	
	camera.render(Global.currentScene);
	
	//console.log(player.tile.x + ", " + player.tile.y);
	
	Global.controls.forEach(function(c){
		c.update(Global.keys);
	});
}
update();

window.onkeydown = function(e){
	switch(e.keyCode){
	case 87: Global.keys.set(3, true); break;
	case 65: Global.keys.set(2, true); break;
	case 83: Global.keys.set(1, true); break;
	case 68: Global.keys.set(0, true); break;
	case 32: Global.keys.set(4, true); break;
	}
}
window.onkeyup = function(e){
	switch(e.keyCode){
	case 87: Global.keys.set(3, false); break;
	case 65: Global.keys.set(2, false); break;
	case 83: Global.keys.set(1, false); break;
	case 68: Global.keys.set(0, false); break;
	}
}
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

var sword = new Item("assets/item/sword.png", Global.tilesize / 2, -Global.tilesize / 2, {grid: false, w: .5}, 100,
					async function(){
						player.controls.lock();
						
						this.tile.addY(-Global.tilesize / 2);
						await Tools.sleep(500);
						this.tile.addY(Global.tilesize / 2);
						
						player.controls.unlock();
					});
var shield = new Item("assets/item/shield_inactive.png", Global.tilesize / 4, Global.tilesize / 4, {grid: false, w: .5, h: .5}, 1000,
					async function(){
						player.controls.lock();
						this.tile.setSrc("assets/item/shield_active.png");
						
						var radius = Global.tilesize * 2.25;
						var step = Math.PI / 15;
						var cur = 0;
						var tiles = [];
						
						while(cur < Math.PI){
							var tile = new Tile("assets/item/shield_active.png", 
												Global.tilesize / 4 + radius * Math.cos(cur),
												Global.tilesize / 4 + radius * -Math.sin(cur), 
												{add: false, grid: false, w: .5, h: .5});
												
							player.tile.addChild(tile);
							tiles.push(tile);
							
							cur += step;
							await Tools.sleep(5);
						}
						
						player.controls.unlock();
						
						await Tools.sleep(3000);
						tiles.forEach(function(t){
							player.tile.removeChild(t);
						});
						this.tile.setSrc("assets/item/shield_inactive.png");
					});

var player = new Player(new Tile("assets/tile/player.png", 0, 0, {add: false, grid: false}), new Inventory(5, [shield]), 15);


//TileStretch("assets/tile/grass.png", 0, 0, 29, 29);
//var light = new AnimatedTile(3, 250, "assets/animation/fire.png", 14, 14, {light: 15, rigid: true});

new Tile("assets/tile/grass.png", 0, 0);
new Tile("assets/tile/grass.png", -2, 0);
new Tile("assets/tile/grass.png", 2, 0);
new Tile("assets/tile/grass.png", 0, -2);
new Tile("assets/tile/grass.png", 0, 2);

var camera = new Camera(player);

scene1.finalize();

var last = performance.now();
function update(){
	clearScreen();
	
	camera.render(Global.currentScene);
	
	Tools.debug("debug", player.tile.x + ", " + player.tile.y);
	
	Global.controls.forEach(function(c){
		c.update(Global.keys);
	});
}
update();

window.onkeydown = function(e){
	e.preventDefault();
	switch(e.keyCode){
	case 87: Global.keys.set(3, true); player.direction = 0; break;
	case 65: Global.keys.set(2, true); player.direction = 3; break;
	case 83: Global.keys.set(1, true); player.direction = 2; break;
	case 68: Global.keys.set(0, true); player.direction = 1; break;
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
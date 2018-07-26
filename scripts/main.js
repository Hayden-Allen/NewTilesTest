var Global = {
	tilesize: 40,
	clearColor: "#000000",
	currentScene: null,
	keys: new BitSet(0),
	/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	 *|D|C|B|A|9|8|7|6|5|4|3|2|1|0|
	 *+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	 *|1|2|3|4|Q|E|R|F|C|_|W|A|S|D|
	 *+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	 */
	controls: [],
	sqrt2: Math.sqrt(2),
	lightMax: 15,
	delta: 0,
	Flags: {
		rigidGroup: 0,
		visible: 1
	}
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

var sword = new Item("assets/item/sword.png", Global.tilesize / 2, -Global.tilesize / 2, {grid: false, w: .5, cooldown: 100},
					async function(){
						player.controls.lock();
						
						this.tile.addY(-Global.tilesize / 2);
						await Tools.sleep(100);
						this.tile.addY(Global.tilesize / 2);
						
						player.controls.unlock();
					});
var shield = new Item("assets/item/shield_inactive.png", Global.tilesize / 4, Global.tilesize / 4, {grid: false, w: .5, h: .5, cooldown: 1000},
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
												{add: false, grid: false, rigid: true, w: .5, h: .5, flags: new BitSet(0b111)});
												
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
						this.tile.setSrc("assets/item/shield_disabled.png");
					}, 
					function(){
						this.tile.setSrc("assets/item/shield_inactive.png");
					});
var bow = new Item("assets/item/bow.png", 0, 0, {cooldown: 500},
						async function(){
							var p = new Projectile("assets/item/arrow.png", 
											player.tile.wx,
											player.tile.wy,
											{
												grid: false
											},
											10,
											{
												x: Math.cos((player.direction - 1) * Math.PI / 2),
												y: Math.sin((player.direction - 1) * Math.PI / 2)
											});
											
							p.onDestroy = function(){
								console.log("boing");
							}
						});

var player = new Player(new Tile("assets/tile/player.png", 5 * Global.tilesize, 14 * Global.tilesize, {add: false, grid: false}), 
						new Inventory([shield, bow, sword, sword, sword, sword, sword, sword, sword]),
						15);

TileStretch("assets/tile/grass.png", 0, 0, 15, 15);
//new Tile("assets/tile/stone.png", 5, 5, {rigid: true});
var p = new Projectile("assets/item/arrow.png", 5 * Global.tilesize, 5 * Global.tilesize, {grid: false}, 10, {x: 0, y: 1});


var camera = new Camera(player);
scene1.finalize();

var last = performance.now(), debug = new DebugInfo();
function update(){
	clearScreen();
	
	camera.render(Global.currentScene);	
	
	
console.log(p.tile.wx + ", " + p.tile.wy);
	
	debug.update(player.tile.wx, player.tile.wy, camera.sprites, camera.minSprites, camera.maxSprites, 1000 / Global.delta);
	Tools.debug("debug", debug.string());	
	
	Global.controls.forEach(function(c){
		c.update(Global.keys);
	});
}
update();

window.onkeydown = function(e){
	e.preventDefault();
	switch(e.keyCode){
	case 49: Global.keys.set(13, true); break;
	case 50: Global.keys.set(12, true); break;
	case 51: Global.keys.set(11, true); break;
	case 52: Global.keys.set(10, true); break;
	case 81: Global.keys.set(9, true); break;
	case 69: Global.keys.set(8, true); break;
	case 82: Global.keys.set(7, true); break;
	case 70: Global.keys.set(6, true); break;
	case 67: Global.keys.set(5, true); break;
	case 32: Global.keys.set(4, true); break;
	case 87: Global.keys.set(3, true); player.direction = 0; break;
	case 65: Global.keys.set(2, true); player.direction = 3; break;
	case 83: Global.keys.set(1, true); player.direction = 2; break;
	case 68: Global.keys.set(0, true); player.direction = 1; break;
	}
}
window.onkeyup = function(e){
	switch(e.keyCode){
	case 49: Global.keys.set(13, false); break;
	case 50: Global.keys.set(12, false); break;
	case 51: Global.keys.set(11, false); break;
	case 52: Global.keys.set(10, false); break;
	case 81: Global.keys.set(9, false); break;
	case 69: Global.keys.set(8, false); break;
	case 82: Global.keys.set(7, false); break;
	case 70: Global.keys.set(6, false); break;
	case 67: Global.keys.set(5, false); break;
	case 32: Global.keys.set(4, false); break;
	case 87: Global.keys.set(3, false); break;
	case 65: Global.keys.set(2, false); break;
	case 83: Global.keys.set(1, false); break;
	case 68: Global.keys.set(0, false); break;
	}
}
var Global = {
	tilesize: 40,	//default width and height of every Tile
	clearColor: "#000000",	//background color
	currentScene: null,	//Scene currently being displayed
	keys: new BitSet(0),	//keeps track of input
	/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	 *|D|C|B|A|9|8|7|6|5|4|3|2|1|0|
	 *+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	 *|1|2|3|4|Q|E|R|F|C|_|W|A|S|D|
	 *+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	 */
	controls: [],	//list of all controls for automatic update each frame
	sqrt2: Math.sqrt(2),	//for normalizing movement vectors
	lightMax: 15,	//maximum light value
	delta: 0,	//milliseconds between last and current frames
	Flags: {	//indices and values for Bitset flags
		rigidGroup: 0,	//group of rigid Tiles that a Tile will interact with
		visible: 1,	//whether or not to update a Tile each frame
		projectile: 2,	//whether or not a Tile is a projectile
		movable: 3,	//whether or not a Tile can be moved by other rigid Tiles
		fromPlayer: 4,	//whether or not a Tile was created by a player
		destructible: 5,	//wether or not a Tile can be destroyed
		destructive: 6,	//whether or not a Tile can destroy destructible Tiles

		rg: 1,	//rigid group
		vis: 2,	//visible
		proj: 4,	//projectile
		mov: 8,	//movable
		fp: 16,	//from player
		dsb: 32,	//destructible
		dsv: 64	//destructive
	},
	Keys: {	//indices for keys Bitset
		$1: 0xD,	//1 key
		$2: 0xC,	//2 key
		$3: 0xB,	//3 key
		$4: 0xA,	//4 key
		q:  9,
		e:  8,
		r:  7,
		f:  6,
		c:  5,
		_:  4,	//space
		w:  3,
		a:  2,
		s:  1,
		d:  0
	}
}
var gf = Global.Flags;	//shortcut

var c = document.getElementById("c");	//canvas
//size canvas
c.width = window.innerWidth - Global.tilesize;
c.height = window.innerHeight - Global.tilesize;
var ctx = c.getContext("2d");	//canvas draw context

function clearScreen(){	//clear screen, draw background color, update delta
	requestAnimationFrame(update);

	ctx.clearRect(0, 0, c.width, c.height);
	Tools.rect(0, 0, c.width, c.height, Global.clearColor, 1);

	Global.delta = performance.now() - last;
	last = performance.now();
}


var scene1 = new Scene(10);
Global.currentScene = scene1;
TileStretch("assets/tile/grass.png", 0, 0, 15, 15);	//15x15 grid of grass Tiles
//Tile that emits light, is visible, and is destructible
var stone = new Tile("assets/tile/stone.png", 5, 5, {rigid: true, flags: new BitSet(gf.dsb | gf.vis), light: 5});
scene1.finalize();	//create lightMap

var sword = new Item(	//jabs forward to attack
				"assets/item/sword.png",
				Global.tilesize / 2,	//x offset by width / 2
				-Global.tilesize / 2,	//y offset by height / 2
				{
					grid: false,	//coordinates aren't in Scene space
					w: .5,	//half a Tile wide
					cooldown: 100	//milliseconds between uses
				},
				async function(){
					player.controls.lock();	//prevent movement

					this.tile.addY(-Global.tilesize / 2);	//move forward relative to player
					await Tools.sleep(100);	//wait for a bit
					this.tile.addY(Global.tilesize / 2);	//move back to original position

					player.controls.unlock();	//end attack and allow player to move again
				}
			);
var shield = new Item(	//creates a semicircle of rigid Tiles around the player for protection
				"assets/item/shield_inactive.png",
				//small square displayed in center of player
				Global.tilesize / 4,
				Global.tilesize / 4,
				{
					grid: false,
					//half a Tile wide and tall
					w: .5,
					h: .5,
					cooldown: 1000	//1 second cooldown
				},
				async function(){
					player.controls.lock();	//prevent movement
					this.tile.setSrc("assets/item/shield_active.png");

					var radius = Global.tilesize * 2.25;	//radius of circle created by shield Tiles
					var step = Math.PI / 15;	//amount to add to angle each iteration
					var tiles = [];	//list of shield Tiles
					var direction = (player.direction * Math.PI / 2);	//angle to rotate by (based on which way player is facing)
					let end = direction + Math.PI;	//angle to end at

					while(direction <= end){
						var tile = new Tile(
										"assets/item/shield_active.png",
										//starts at center of player, offset by radius and current angle
										(player.tile.wx + Global.tilesize / 4) + radius * -Math.cos(direction),
										(player.tile.wy + Global.tilesize / 4) + radius * -Math.sin(direction),
										{
											add: true,	//add to Scene
											grid: false,	//not Scene coordinates
											rigid: true,	//interacts with other rigit Tiles (to block attacks)
											//half a Tile wide and tall
											w: .5,
											h: .5,
											flags: new BitSet(gf.vis | gf.rg)	//visible and rigid
										}
									);

						direction += step;	//increase angle

						tiles.push(tile);	//add to list of shield Tiles
						await Tools.sleep(10);	//wait for a little bit before creating next one (for visual effect)
					}

					player.controls.unlock();	//allow player movement
					await Tools.sleep(3000);	//leave shield up for 3 seconds

					tiles.forEach(function(t){	//delete shield
						Global.currentScene.remove(t);
					});

					this.tile.setSrc("assets/item/shield_disabled.png");	//change to disabled texture
				},
				function(){
					this.tile.setSrc("assets/item/shield_inactive.png");	//after cooldown, set back to inactive texture
				}
			);
var bow = new Item(	//shoots arrows in a straight line
				"assets/item/bow.png",
				//not offset
				0,
				0,
				{
					cooldown: 500	//half a second between shots
				},
				async function(){
					new Projectile(	//create new projectile in direction the player is facing. Automatically added to Scene
						"assets/item/arrow.png",
						//starts at player position
						player.tile.wx,
						player.tile.wy,
						{
							grid: false,
							flags: new BitSet(gf.proj | gf.vis | gf.rg)	//is a projectile, is visible, and is rigid
						},
						10,	//speed
						{
							//directional components based on direction player is facing
							x: Math.cos((player.direction - 1) * Math.PI / 2),
							y: Math.sin((player.direction - 1) * Math.PI / 2)
						}
					);
				}
			);
var ballandchain = new Item(	//swings a ball in an arc around the player
						"assets/item/chain.png",
						//no coordinate offset
						0,
						0,
						{
							cooldown: 500	//half a second between uses
						},
						async function(){
							player.controls.lock();	//prevent player from moving

							var direction = (player.direction - 1) * Math.PI / 2;	//to determine where the ball starts
							var radius = Global.tilesize * 2;	//the ball is two Tiles away from player at all times

							var ball = new Tile(
											"assets/item/ball.png",
											player.tile.wx + radius * Math.cos(direction),
											player.tile.wy + radius * Math.sin(direction),
											{
												grid: false,
												rigid: true,	//interacts with other rigid tiles
												flags: new BitSet(gf.dsv | gf.fp | gf.vis)	//destructive, from player, visible
											}
										);

							var chain = [];	//list of chain links from player to ball
							var chains = 3;	//number of chains
							var chainstep = radius / chains;	//distance between each chain
							for(var i = 0; i < chains; i++)
								chain.push(new Tile(
												"assets/item/chain.png",
												//position depends on which link it is
												player.tile.wx + chainstep * i * Math.cos(direction),
												player.tile.wy + chainstep * i * Math.sin(direction),
												{
													grid: false,
													rigid: false,
													flags: new BitSet(gf.fp | gf.vis),	//from player, visible
													zindex: 1
												}
											));

							var cur = 0, step = Math.PI / 15;	//current angle, angle increment
							while(cur < Math.PI * 2){	//one complete revolution
								cur += step;	//add to current angle

								//update ball position
								ball.setX(player.tile.wx + radius * Math.cos(direction + cur));
								ball.setY(player.tile.wy + radius * Math.sin(direction + cur));

								//update all chain positions
								for(var i = 0; i < chain.length; i++){
									chain[i].setX(player.tile.wx + chainstep * i * Math.cos(direction + cur));
									chain[i].setY(player.tile.wy + chainstep * i * Math.sin(direction + cur));
								}

								await Tools.sleep(25);	//wait before next increment
							}

							//delete everything
							Global.currentScene.remove(ball);
							chain.forEach(function(c){
								Global.currentScene.remove(c);
							});

							player.controls.unlock();	//allow player to move again
						}
					);

var player = new Player(
				new Tile(
					"assets/tile/player.png",
					//position
					5 * Global.tilesize,
					14 * Global.tilesize,
					{
						add: false,	//not automatically added to Scene (its display and update is handled by Camera)
						grid: false,
						flags:
						new BitSet(gf.mov | gf.vis | gf.rg)	//movable by rigids, visible, rigid
					}
				),
				new Inventory([ballandchain, shield, bow, sword, sword, sword, sword, sword, sword]),	//all items
				15	//movement speed
			);


var camera = new Camera(player);	//center rendering on player
var last = performance.now();	//time of last frame
var debug = new DebugInfo();	//debug string to be displayed under canvas
function update(){
	clearScreen();	//clear screen, draw background color, update time

	camera.render(Global.currentScene);	//update and draw everything

	//update debug info
	debug.update(player.tile.wx, player.tile.wy, camera.sprites, camera.minSprites, camera.maxSprites, 1000 / Global.delta);
	Tools.debug("debug", debug.string());

	//update all controls for next frame
	Global.controls.forEach(function(c){
		c.update(Global.keys);
	});
}
update();

//handle all input
window.onkeydown = function(e){
	switch(e.keyCode){
	case 49: Global.keys.set(13, true); break;	//1
	case 50: Global.keys.set(12, true); break;	//2
	case 51: Global.keys.set(11, true); break;	//3
	case 52: Global.keys.set(10, true); break;	//4
	case 81: Global.keys.set(9, true); break;	//q
	case 69: Global.keys.set(8, true); break;	//e
	case 82: Global.keys.set(7, true); break;	//r
	case 70: Global.keys.set(6, true); break;	//f
	case 67: Global.keys.set(5, true); break;	//c
	case 32: e.preventDefault(); Global.keys.set(4, true); break;	//preventDefault because otherwise page will scroll down when space is pressed
	case 87: Global.keys.set(3, true); player.direction = 0; break;	//w
	case 65: Global.keys.set(2, true); player.direction = 3; break;	//a
	case 83: Global.keys.set(1, true); player.direction = 2; break;	//s
	case 68: Global.keys.set(0, true); player.direction = 1; break;	//d
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

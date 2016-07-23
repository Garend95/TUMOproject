var stage, queue, bg, player, socketPlayer, ball;

//var tileId = Array[][];

$(function()
	{
	
	var socket;

		window["socket"] = socket;				

		stage = new createjs.Stage("my_canvas");

		queue = new createjs.LoadQueue(true);
		
		queue.addEventListener("complete", handleComplete);
		
		queue.loadManifest([{id:"gold", src:"/public/pics/resource/gold.png"},
							{id:"goldUp", src:"/public/pics/resource/cargo_gold_2.png"},
							{id:"goldDown", src:"/public/pics/resource/cargo_gold_4.png"},
							{id:"goldLeft", src:"/public/pics/resource/cargo_gold_1.png"},
							{id:"goldRight", src:"/public/pics/resource/cargo_gold_3.png"},
							{id:"tankRedLeft", src:"/public/pics/resource/player_red_1.png"}
							{id:"tankRedRight", src:"/public/pics/resource/player_red_3.png"}
							{id:"tankRedUp", src:"/public/pics/resource/player_red_2.png"}
							{id:"tankRedDown", src:"/public/pics/resource/player_red_4.png"}
							{id:"tankBlueLeft", src:"/public/pics/resource/player_blue_1.png"}
							{id:"tankBlueRight", src:"/public/pics/resource/player_blue_3.png"}
							{id:"tankBlueUp", src:"/public/pics/resource/player_blue_2.png"}
							{id:"tankBlueDown", src:"/public/pics/resource/player_blue_4.png"}
							{id:"tankyellowLeft", src:"/public/pics/resource/player_yellow_1.png"}
							{id:"tankyellowRight", src:"/public/pics/resource/player_yellow_3.png"}
							{id:"tankyellowUp", src:"/public/pics/resource/player_yellow_2.png"}
							{id:"tankyellowDown", src:"/public/pics/resource/player_yellow_4.png"}
							{id:"tankgreenLeft", src:"/public/pics/resource/player_green_1.png"}
							{id:"tankgreenRight", src:"/public/pics/resource/player_green_3.png"}
							{id:"tankgreenUp", src:"/public/pics/resource/player_green_2.png"}
							{id:"tankgreenDown", src:"/public/pics/resource/player_green_4.png"}
							{id:"camp1", src:"/public/pics/resource/camp_blue.png"},
							{id:"camp2", src:"/public/pics/resource/camp_yellow.png"},
							{id:"camp3", src:"/public/pics/resource/camp_red.png"},
							{id:"camp4", src:"/public/pics/resource/camp_green.png"},
							{id:"bulletH", src:"/public/pics/resource/bullet1_1.png"},
							{id:"bulletV", src:"/public/pics/resource/bullet1_2.png"},
							{id:"grass", src:"/public/pics/grass.png"},
							{id:"mars", src:"/public/pics/mars.png"},
							{id:"moon", src:"/public/pics/moon.png"},
							{id:"sand", src:"/public/pics/sand.png"}]);


		function handleComplete(evt)
				{
					var i = 0, j = 0;
					for(var y = 0; y < 929; y + 32 )
						{
							for(var x = 0; x < 929; x + 32)
							{
								/*tileId.push(y);
								tileId[y].push(x);*/

								tile = new Tile(("id" +j) + i, x, y);

								stage.addChild(tile.tileImage);

								i++;
							}
							j++;
						}


					socket = io.connect();
					
					update();
				}	
			
});

function Tile(id, x, y)
{
	this.id = id;

	this.x = x;
	this.y = y;

	var luck = Math.random();

	if(luck < 0 && luck >= 0.25) this.tileImage = new createjs.Bitmap(queue.getResult("sand"));
	else if(luck < 0.25 && luck >= 0.50) this.tileImage = new createjs.Bitmap(queue.getResult("mars"));
	else if(luck < 0.50 && luck >= 0.75) this.tileImage = new createjs.Bitmap(queue.getResult("grass"));
	else this.tileImage = new createjs.Bitmap(queue.getResult("moon"));
	
	this.tileImage.x = this.x;
	this.tileImage.y = this.y;
}

function Bullet(id, x, y)
{
	this.id = id;

	this.x = x;
	this.y = y;
	
	this.ballImage = new createjs.Bitmap(queue.getResult("ball"));

	//if shooting tank is looking up or down image should be vertical bullet else horizontal bullet
	
	this.bulletImage.x = this.x;
	this.bulletImage.y = this.y;
}
//another project's code for reference purposes

/*var stage, queue, bg, player, socketPlayer, ball;

$(function()
	{
		var socket;
		
		//making socket global
		window["socket"] = socket;				
		
		//creating the stage
		stage = new createjs.Stage("my_canvas");
		
		//true - load data from server
		queue = new createjs.LoadQueue(true);
		
		//waiting to load all the assets
		queue.addEventListener("complete", handleComplete);
		
		//loading the assets
		queue.loadManifest([{id:"paddle", src:"/public/pics/paddle.png"},
							{id:"ball", src:"/public/pics/ball.png"},
							{id:"background", src:"/public/pics/Stars.png"}]);
		
		//Manipulating images
		function handleComplete(evt)
		{
			//creating the background image
			bg = new createjs.Bitmap(queue.getResult("background"));
			
			//adding be to the stage
			stage.addChild(bg);
			
			//stretching the bg to fit the screen
			bg.scaleY = 600/500;
			
			//connecting
			socket = io.connect();
			
			//getting player data
			socket.on("yourID", function(data)
			{
				//making the side global
				window["side"] = data["side"];
				
				//creating the object
				player = new Player(data["name"], window["side"], data["player"], data["x"], data["y"]);
				
				//adding player to the stage
				stage.addChild(player.playerImage);
			
				//Report the server that player is created, and send the data
				socket.emit("newPlayerCreated", {"id":player.id, "x":player.x, "y":player.y, "side":player.screenSide, "player":player.who});
				
				// show everything in the stage				
				stage.update();				
			});
			
			//Listen for second player to connect
			socket.on("newPlayer", function(data)
			{

				//creating the second player, as a socket player
				socketPlayer = new Player(data["id"], data["side"], data["player"], data["x"], data["y"]);
				
				//adding the second player to the stage
				stage.addChild(socketPlayer.playerImage);
				
				// show everything in the stage				
				stage.update();
			});
			
			//This is only for the second player, in his case socket is player1
			socket.on("firstPosition", function(data)
			{
				//creating the first player, as a socket player
				socketPlayer = new Player(data["id"], data["side"], data["player"], data["x"], data["y"]);
				
				//adding the first player to the stage
				stage.addChild(socketPlayer.playerImage);
				
				//show everything in the stage	
				stage.update();
				
				//Tell server that players are ready, pass canvas data
				socket.emit("playersReady", {"x":stage.canvas.width, "y":stage.canvas.height});
			});
			
			//Listening for ball to appear
			socket.on("enterTheBall", function(data)
			{
				//creating the ball
				ball = new Ball(data["id"], data["x"], data["y"]);
				
				//adding the ball to the stage
				stage.addChild(ball.ballImage);
				
				//show everything in the stage
				stage.update();
			});

			socket.on("drawMap", function(data)
			{
				tile = new 
			})
			
			//waiting for players to leave the game
			socket.on("playerLeft", function(data)
			{
				//Removing the player that left
				stage.removeChild(socketPlayer.playerImage);
				
				//show everything in the stage
				stage.update();
				
				//Nullifying the player object
				socketPlayer = null;
			});
			
			//attaching the event listener
			window.addEventListener("keydown", movement);
			
			window.addEventListener("keyup", chMovement);
			
			//Listening to any movement
			socket.on("someOneMove", function(data)
			{
				//who is moving
				console.log("playes is - " + data["player"]);
				
				//deciding who moved, and animating his movement locally,
				//for the first player
				if(data["player"] == "first")
				{
					if(data["id"] == player.id)
						player.playerImage.y = data["y"];
					else
						socketPlayer.playerImage.y = data["y"];
				}
				
				//deciding who moved, and animating his movement locally,
				//for the first player				
				if(data["player"] == "second")
				{
					if(data["id"] == player.id)
						player.playerImage.y = data["y"];
					else
						socketPlayer.playerImage.y = data["y"];
				}
				
				//shows the player's real localtion
				console.log("first players coord is - " + player.y);
			});
			
			function movement(evt)
			{
				switch(evt.keyCode)
				{
					case 40: 	//Tell the server that player went down(moved)
								socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "down"});
								break;
					case 38: 	//Tell the server that player went up(moved)
								socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "up"});
								break;
				}
			}
			
			function chMovement(evt)
			{
				switch(evt.keyCode)
				{
					case 40:	//Tell the server that player stopped(moved)
								socket.emit("move", {"player":player.who, "y" : player.y, "dir" : ""});
								break;
					case 38: 	//Tell the server that player stopped(moved)
								socket.emit("move", {"player":player.who, "y" : player.y, "dir" : ""});
								break;
				}
			}
			
			//Setting FPS to 60 frames per second
			createjs.Ticker.setFPS(60);
			
			//listening to tick event
			createjs.Ticker.addEventListener("tick",tickHandler);
		}
		
		//Handler function for tick event
		function tickHandler(e)
		{
			//animating the background
			if(--bg.x <= -699)
				bg.x = -200;
			
			var startAngle = Math.random*(2*Math.PI);

			ball.data["x"] += Math.cos(startAngle);
			ball.data["y"] += Math.sin(startAngle);
			//each time updating the stage locally
			stage.update();
		}
	}
 ); 
 
//creating the player class locally
function Player(id, sd, wh, x, y)
{
	this.id = id;
	
	this.screenSide = sd;
	
	this.who = wh;
	
	this.x = x;
	this.y = y;
	
	this.playerImage = new createjs.Bitmap(queue.getResult("paddle"));
	
	this.playerImage.x = this.x;
	this.playerImage.y = this.y;
}

function Tile(id, x, y)
{
	this.id = id;

	this.x = x;
	this.y = y;

	var luck = Math.random();

	if(luck < 0 && luck >= 0.25) this.tileImage = new createjs.Bitmap(queue.getResult("sand"));
	else if(luck < 0.25 && luck >= 0.50) this.tileImage = new createjs.Bitmap(queue.getResult("mars"));
	else if(luck < 0.50 && luck >= 0.75) this.tileImage = new createjs.Bitmap(queue.getResult("grass"));
	else this.tileImage = new createjs.Bitmap(queue.getResult("moon"));

	this.tileImage.x = this.x;
	this.tileImage.y = this.y;
}
//creating the ball class locally
function Ball(id, x, y)
{
	this.id = id;

	this.x = x;
	this.y = y;
	
	this.ballImage = new createjs.Bitmap(queue.getResult("ball"));
	
	this.ballImage.x = this.x;
	this.ballImage.y = this.y;
}*/
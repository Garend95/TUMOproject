//added movement key codes 
//someone move added for all players but does it send the locations to all the clients
//added tick handler
//added image property to new player function and first position
//removed innacuracy in bullet object
//need to connect players to their tank colors (solved?) 
//removed tick handler as it had no use
//added goldBit object
//attach second canvas
//changed where tiles are drawn and instead put in players ready function as a socket.on
//implemented chat without 

var stage, secondStage, queue, bg, player, socketPlayer, ball, tile, gold;


//var tileId = Array[][];

$(function()
	{
	
	var socket;

		window["socket"] = socket;	

		var messageForm = $("#send-message");
		var messageBox = $("#textbox");	

		var chat = $("#chat_box");

		messageForm.submit(function(e){
			e.preventDefault();

			socket.emit('send message', messageBox.val());

			messageBox.val('');
		});		

		submitClicked = function()
		{
			socket.emit('send message', messageBox.val());

			messageBox.val('');
		}

		

		stage = new createjs.Stage("my_canvas");
		secondStage = new createjs.Stage("upper_canvas");

		queue = new createjs.LoadQueue(true);
		
		queue.addEventListener("complete", handleComplete);
		
		queue.loadManifest([{id:"gold", src:"/public/pics/resource/gold.png"},
							{id:"goldUp", src:"/public/pics/resource/cargo_gold_2.png"},
							{id:"goldDown", src:"/public/pics/resource/cargo_gold_4.png"},
							{id:"goldLeft", src:"/public/pics/resource/cargo_gold_1.png"},
							{id:"goldRight", src:"/public/pics/resource/cargo_gold_3.png"},
							{id:"tankRedLeft", src:"/public/pics/resource/player_red_1.png"},
							{id:"tankRedRight", src:"/public/pics/resource/player_red_3.png"},
							{id:"tankRedUp", src:"/public/pics/resource/player_red_2.png"},
							{id:"tankRedDown", src:"/public/pics/resource/player_red_4.png"},
							{id:"tankBlueLeft", src:"/public/pics/resource/player_blue_1.png"},
							{id:"tankBlueRight", src:"/public/pics/resource/player_blue_3.png"},
							{id:"tankBlueUp", src:"/public/pics/resource/player_blue_2.png"},
							{id:"tankBlueDown", src:"/public/pics/resource/player_blue_4.png"},
							{id:"tankyellowLeft", src:"/public/pics/resource/player_yellow_1.png"},
							{id:"tankyellowRight", src:"/public/pics/resource/player_yellow_3.png"},
							{id:"tankyellowUp", src:"/public/pics/resource/player_yellow_2.png"},
							{id:"tankyellowDown", src:"/public/pics/resource/player_yellow_4.png"},
							{id:"tankgreenLeft", src:"/public/pics/resource/player_green_1.png"},
							{id:"tankgreenRight", src:"/public/pics/resource/player_green_3.png"},
							{id:"tankgreenUp", src:"/public/pics/resource/player_green_2.png"},
							{id:"tankgreenDown", src:"/public/pics/resource/player_green_4.png"},
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
					/*var i = 0, j = 0;
					for(var y = 0; y < 929; y + 32 )
						{
							for(var x = 0; x < 929; x + 32)
							{
								tileId.push(y);
								tileId[y].push(x);

								tile = new Tile(("id" +j) + i, x, y);

								stage.addChild(tile.tileImage);

								i++;
							}
							j++;
						}*/

					socket = io.connect();
						
					socket.on("new message", function(data)
						{
							chat.append(data + "<br/>");
						});

					socket.on("yourID", function(data)
						{
							console.log("")
							window["side"] = data["side"];

							player = new Player(data["name"], window["side"], data["player"], data["x"], data["y"], data["img"]);
						
							
							//secondStage.addChild(player.playerImage);
						
							socket.emit("newPlayerCreated", {"id":player.id, "x":player.x, "y":player.y, "side":player.screenSide, "player":player.who, "img":player.img});

											
							secondStage.update();				
						});


					socket.on("all players", function(data)
						{
							for( var i in data)
							{
								//console.log("the value of i is " + i);
								if( data[i]["id"] != player["id"]  ){
									
									console.log("i created a socket player");
									socketPlayer = new Player(data[i]["id"], data[i]["side"], data[i]["player"], data[i]["x"], data[i]["y"], data[i]["img"]);
									
									secondStage.addChild(socketPlayer.playerImage);

								
								}
							}

							
							secondStage.addChild(socketPlayer.playerImage);

							secondStage.update();
							//console.log(data);
						 	socket.emit("playersReady");
						});
					
				
					socket.on("drawMap", function(data){

							for(var t = 0; t < 875; t++)
							{
								
								tile = new Tile(data[t]["count"], data[t]["x"], data[t]["y"], data[t]["img"]);
								//console.log("this tile was made" + tile.id + " " + tile.x + " " + tile.y)
								//console.log("tile image is " + tile.tileImage)
								stage.addChild(tile.tileImage);
								//console.log(tile);
								
								
							}

							stage.update();
	
						});


					socket.on("enterGoldBit", function(data)
						{
							
							for(var i = 0; i < 50; i++){
								gold = new goldBit(data["id"], data["x"], data["y"]);
								
								secondStage.addChild(gold.goldBitImage);
							
							}

							secondStage.update();
						});
					
					socket.on("playerLeft", function(data)
								{
									stage.removeChild(socketPlayer.playerImage);
									
									stage.update();
									
									socketPlayer = null;
								});

					socket.on("someOneMove", function(data)
						{
							//who is moving
							console.log("player is - " + data["player"]);
							
					
							if(data["player"] == "first")
							{
								if(data["id"] == player.id)
									player.playerImage.y = data["y"];
								else
									socketPlayer.playerImage.y = data["y"];
							}
							
						
							if(data["player"] == "second")
							{
								if(data["id"] == player.id)
									player.playerImage.y = data["y"];
								else
									socketPlayer.playerImage.y = data["y"];
							}

							if(data["player"] == "third")
							{
								if(data["id"] == player.id)
									player.playerImage.y = data["y"];
								else
									socketPlayer.playerImage.y = data["y"];
							}

							if(data["player"] == "fourth")
							{
								if(data["id"] == player.id)
									player.playerImage.y = data["y"];
								else
									socketPlayer.playerImage.y = data["y"];
							}
							
							//shows the player's real localtion
							console.log("first players coord is - " + player.y);
						});


					window.addEventListener("keydown", movement);
		
					window.addEventListener("keyup", chMovement);
					
					function movement(evt)
						{
							/*switch(evt.keyCode)
							{
								case 87: 	
											socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "up"});
											break;
								case 83: 	
											socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "down"});
											break;
								case 65:
											socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "left"});
											break;	
								case 68:
											socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "right"});
											break;			
							}*/
						}
					
					function chMovement(evt)
						{
							/*switch(evt.keyCode)
							{
								case 87: 	
											socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "up"});
											break;
								case 83: 	
											socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "down"});
											break;
								case 65:
											socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "left"});
											break;	
								case 68:
											socket.emit("move", {"player":player.who, "y" : player.y, "dir" : "right"});
							}*/
						}



							createjs.Ticker.setFPS(60);

					
					stage.update();
			}	


				
			
});

function Player(id, sd, wh, x, y, img)
{
	
	
	this.id = id;
	
	this.screenSide = sd;
	
	this.who = wh;
	
	this.x = x;
	this.y = y;

	this.img = img;
	
	switch (this.img){
		case 1:
			this.playerImage = new createjs.Bitmap(queue.getResult("tankRedUp"));
			break;
		case 2:
			this.playerImage = new createjs.Bitmap(queue.getResult("tankBlueUp"));
			break;
		case 3:
			this.playerImage = new createjs.Bitmap(queue.getResult("tankYellowUp"));
			break;
		case 4:	
			this.playerImage = new createjs.Bitmap(queue.getResult("tankGreenUp"));
			break;	
		default:
			console.log("no image was chosen also I hate my life");
			break;	
	
	}

	
	this.playerImage.x = this.x;
	this.playerImage.y = this.y;
}

function Tile(id, x, y, img)
{
	this.id = id;

	this.x = x;
	this.y = y;

	this.img = img;

	if(this.img >= 0 && this.img <= 3) this.tileImage = new createjs.Bitmap(queue.getResult("sand"));
	else if(this.img >= 3 && this.img <= 8) this.tileImage = new createjs.Bitmap(queue.getResult("grass"));
	else if(this.img >= 8 && this.img <= 9) this.tileImage = new createjs.Bitmap(queue.getResult("mars"));
	else this.tileImage = new createjs.Bitmap(queue.getResult("moon"));
	
	this.tileImage.x = this.x;
	this.tileImage.y = this.y;
}

function Bullet(id, x, y, dir)
{
	this.id = id;

	this.x = x;
	this.y = y;
	
	//if shooting tank is looking up or down image should be vertical bullet else horizontal bullet
	if(dir == "horizontal") this.bulletImage = new createjs.Bitmap(queue.getResult("bulletH"));
	else if(dir == "vertical") this.bulletImage = new createjs.Bitmap(queue.getResult("bulletV"));
	
	this.bulletImage.x = this.x;
	this.bulletImage.y = this.y;
}

function goldBit(id, x, y)
{
	this.id = id;

	this.x = x;
	this.y = y;

	this.goldBitImage = new createjs.Bitmap(queue.getResult("gold"));

	this.goldBitImage.x = this.x;
	this.goldBitImage.y = this.y;	
}

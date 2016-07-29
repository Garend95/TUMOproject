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
var scktarray = []; // used to move the correct socketplayer on the clien't screen
var gldarray = []; // storing the goldBit objects for collision detection via id

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
							{id:"tankYellowLeft", src:"/public/pics/resource/player_yellow_1.png"},
							{id:"tankYellowRight", src:"/public/pics/resource/player_yellow_3.png"},
							{id:"tankYellowUp", src:"/public/pics/resource/player_yellow_2.png"},
							{id:"tankYellowDown", src:"/public/pics/resource/player_yellow_4.png"},
							{id:"tankGreenLeft", src:"/public/pics/resource/player_green_1.png"},
							{id:"tankGreenRight", src:"/public/pics/resource/player_green_3.png"},
							{id:"tankGreenUp", src:"/public/pics/resource/player_green_2.png"},
							{id:"tankGreenDown", src:"/public/pics/resource/player_green_4.png"},
							{id:"camp1", src:"/public/pics/resource/camp_red.png"},
							{id:"camp2", src:"/public/pics/resource/camp_blue.png"},
							{id:"camp3", src:"/public/pics/resource/camp_yellow.png"},
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
					fors(var y = 0; y < 929; y + 32 )
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
							
							window["side"] = data["side"];

							player = new Player(data["name"], window["side"], data["player"], data["x"], data["y"], data["img"], data["base"]);
						
							
							secondStage.addChild(player.playerImage);
							secondStage.addChild(player.baseImage);
						
							socket.emit("newPlayerCreated", {"id":player.id, "x":player.x, "y":player.y, "side":player.screenSide, "player":player.who, "img":player.img, "base":player.base});

											
							secondStage.update();				
						});


					socket.on("all players", function(data)
						{
							for( var i in data)
							{
								//console.log("the value of i is " + i);
								if( data[i]["id"] != player["id"]  ){
									
									//console.log("i created a socket player");
									socketPlayer = new Player(data[i]["id"], data[i]["side"], data[i]["player"], data[i]["x"], data[i]["y"], data[i]["img"], data[i]["base"]);
									
									scktarray.push(socketPlayer);
									secondStage.addChild(socketPlayer.playerImage);
									secondStage.addChild(socketPlayer.baseImage);

								
								}
							}

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
								gold = new goldBit(data[i]["id"], data[i]["x"], data[i]["y"]); //tried to use data[i]["id"] etc instead but It says data[i] is undefined
								gldarray.push(gold);
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
							console.log("player is - " + data["pl"]["player"]);
							
					
							if(data["pl"]["player"] == "first")
							{
								//console.log("first was accessed");
								if(data["pl"]["id"] == player.id){
									player.playerImage.y = data["pl"]["y"];
									player.playerImage.x = data["pl"]["x"];

									//tankDirection(data["pl"],data["dir"]);
									goldCollision(player.playerImage);

								}
								else 
								{
									for( var i = 0; i < scktarray.length; i++ ){
										
										if(scktarray[i].who == "first")
											{
												scktarray[i].playerImage.y = data["pl"]["y"];
												scktarray[i].playerImage.x = data["pl"]["x"];

												goldCollision(scktarray[i].playerImage);

												//tankDirection(scktarray[i],data["dir"]);
											}

									}

								}	
									
							}
							else if(data["pl"]["player"] == "second")
							{

								if(data["pl"]["id"] == player.id){
									player.playerImage.y = data["pl"]["y"];
									player.playerImage.x = data["pl"]["x"];

									goldCollision(player.playerImage);
									
								//	tankDirection(data["pl"],data["dir"]);
								}
								else
								{
									for( var i = 0; i < scktarray.length; i++ ){
										
										if(scktarray[i].who == "second")
											{
												scktarray[i].playerImage.y = data["pl"]["y"];
												scktarray[i].playerImage.x = data["pl"]["x"];

												goldCollision(scktarray[i].playerImage);

												//tankDirection(scktarray[i],data["dir"]);
											}
									}
								}	
							}
							else if(data["pl"]["player"] == "third")
							{
								
								if(data["pl"]["id"] == player.id){
									player.playerImage.y = data["pl"]["y"];
									player.playerImage.x = data["pl"]["x"];

									goldCollision(player.playerImage);

									//tankDirection(data["pl"],data["dir"]);
	
								}
								else
								{
									for( var i = 0; i < scktarray.length; i++ ){
										
										if(scktarray[i].who == "third")
											{
												scktarray[i].playerImage.y = data["pl"]["y"];
												scktarray[i].playerImage.x = data["pl"]["x"];

												goldCollision(scktarray[i].playerImage);

												//tankDirection(scktarray[i],data["dir"]);
											}
									}
								}	
							}
							else if(data["pl"]["player"] == "fourth")
							{

								if(data["pl"]["id"] == player.id){
									player.playerImage.y = data["pl"]["y"];
									player.playerImage.x = data["pl"]["x"];

									goldCollision(player.playerImage);

									//tankDirection(data["pl"],data["dir"]);

								}
								else
								{
									for( var i = 0; i < scktarray.length; i++ ){
										
										if(scktarray[i].who == "fourth")
											{
												scktarray[i].playerImage.y = data["pl"]["y"];
												scktarray[i].playerImage.x = data["pl"]["x"];

												goldCollision(scktarray[i].playerImage);

												//tankDirection(scktarray[i],data["dir"]);
											}
									}
								}	
							}

							secondStage.update();
							
							//shows the player's real localtion
							//console.log("first players coord is - " + player.y);
						});


					window.addEventListener("keydown", movement);
		
					window.addEventListener("keyup", chMovement);
					
					function movement(evt)
						{
							switch(evt.keyCode)
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
							}
						}
					
					function chMovement(evt)
						{
							switch(evt.keyCode)
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
							}	
						}



							createjs.Ticker.setFPS(60);

					
					stage.update();
			}	


				
			
});

function tankDirection( tank , dir)
{
	var d = dir;
	console.log("tank.who is " + tank.who)
	if(tank.who == "first"){
		
		switch(d)
				{
					case "up":
						console.log("lol");
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankRedUp"));
						break;
					case "down":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankRedDown"));
						break;
					case "left":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankRedLeft"));
						break;
					case "right":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankRedRight"));
						break;			
				}

	}else if(tank.who == "second"){	

		switch(d)
				{
					case "up":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankBlueUp"));
						break;
					case "down":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankBlueDown"));
						break;
					case "left":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankBlueLeft"));
						break;
					case "right":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankBlueRight"));
						break;				
				}

	}else if(tank.who == "third"){	

		switch(d)
				{
					case "up":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankYellowUp"));
						break;
					case "down":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankYellowDown"));
						break;
					case "left":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankYellowLeft"));
						break;
					case "right":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankYellowRight"));
						break;				
				}

	}else if(tank.who == "fourth"){

		switch(d)
				{
					case "up":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankGreenUp"));
						break;
					case "down":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankGreenDown"));
						break;
					case "left":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankGreenLeft"));
						break;
					case "right":
						tank.playerImage = new createjs.Bitmap(queue.getResult("tankGreenRight"));
						break;					
				}

	}			
}

function Player(id, sd, wh, x, y, img, base)
{
	
	
	this.id = id;
	
	this.screenSide = sd;
	
	this.who = wh;
	
	this.x = x;
	this.y = y;

	this.img = img;
	this.base = base;
	
	switch (this.img){
		case 1:
			this.playerImage = new createjs.Bitmap(queue.getResult("tankRedUp"));
			break;
		case 2:
			this.playerImage = new createjs.Bitmap(queue.getResult("tankBlueUp"));
			break;
		case 3:
			this.playerImage = new createjs.Bitmap(queue.getResult("tankYellowDown"));
			//console.log("yellow tank chosen");
			break;
		case 4:	
			this.playerImage = new createjs.Bitmap(queue.getResult("tankGreenDown"));
			//console.log("yellow tank chosen");
			break;	
		default:
			console.log("no image was chosen also I hate my life");
			break;	
	
	}

	
	switch (this.base){
		case 1:
			this.baseImage = new createjs.Bitmap(queue.getResult("camp1"));
			this.baseImage.x = 0;
			this.baseImage.y = 864;
			break;
		case 2:
			this.baseImage = new createjs.Bitmap(queue.getResult("camp2"));
			this.baseImage.x = 864;
			this.baseImage.y = 864;
			break;
		case 3:
			this.baseImage = new createjs.Bitmap(queue.getResult("camp3"));
			this.baseImage.x = 0;
			this.baseImage.y = 0;
			break;
		case 4:	
			this.baseImage = new createjs.Bitmap(queue.getResult("camp4"));
			this.baseImage.x = 864;
			this.baseImage.y = 0;
			break;	
		default:
			console.log("no base was chosen 3spooky5me");
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

	this.cargo = false;

	this.goldBitImage = new createjs.Bitmap(queue.getResult("gold"));

	this.goldBitImage.x = this.x;
	this.goldBitImage.y = this.y;	
}


function goldCollision(pImage)
{
	for(var i in gldarray)
	{
		if((pImage.x +32 >= gldarray[i].x && pImage.x <= gldarray[i].x +32) && (pImage.y +32 >= gldarray[i].y && pImage.y <= gldarray[i].y +32))
		{
			gldarray[i].x = pImage.x;
			gldarray[i].goldBitImage.x = pImage.x;

			//console.log(gldarray[i].x + "gl");
			//console.log(pImage.x + "pi")
			gldarray[i].y = pImage.y;
			gldarray[i].goldBitImage.y = pImage.y;
			gldarray[i].cargo = true;
			//secondStage.update();

		}
		else gldarray[i].cargo = false;

		//console.log(gldarray[i].cargo)
	}
}

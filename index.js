//another project's code for reference purposes

/*var sckt = [];
var players = [];
var ball = {};

//Requesting http and express modules
var express = require('express');
var app = express();

var http = require('http').createServer(app);

//Requiring socket.io and attaching to our server
var io = require('socket.io').listen(http);

//Listening at port 8080
http.listen(8080);

//Minifying the log info, in the command prompt
io.set('log level', 1);

//We use static files, that are not in the root folder
app.use("/public", express.static(__dirname + '/public'));

//Filtering other requests
app.get('/:file', function(req, res, next)
	{	
		//Logging the requests
		console.log("File is - " + req.params.file);
	
		res.sendfile(__dirname + '/' + req.params.file);
	}
	);

//Listening for newly connected sockets
io.sockets.on('connection', function(socket)
{	
	//All clients get there unique socket ID
	console.log("The id of connected socket - " + socket.id);
	
	//out game is for two players ONLY
	if(players.length == 2)
		return false;
	
	//Loggint all players' ID-s
	for(var skt in io.sockets.sockets)
	{
		console.log(io.sockets.sockets[skt].id);
	}
	
	//storing socket IS-s in sckt array
	sckt.push(socket.id);
	
	//Each player gets his infromation
	socket.emit("yourID", {
							"name":socket.id,
							"side":(sckt.length == 1?"left" : "right"),
							"player":(sckt.length == 1?"first" : "second"),
							"x":(sckt.length == 1 ? 25 : 750),
							"y":250
						  });
	
	//Listening to any movement	
	socket.on('move', function(data)
						 {
							//server checks which player moved
							//callculates new coordinates
							//send them back to all players
							//this way you can't lie or confuse the server
							for(var tmp in players)
							{
								if(players[tmp]["player"] == data["player"])
								{
									if(data["dir"] == "down")
										players[tmp]["y"] += 5;
										
									if(data["dir"] == "up")
										players[tmp]["y"] -= 5;
										
									io.sockets.emit("someOneMove", players[tmp]);
								}
							}							
						 });
	
	//Listening for new player creation completion
	socket.on('newPlayerCreated', function(data)
	{
		//Storing all players in players array
		players.push({"id":data["id"], "x":data["x"], "y":data["y"], "side":data["side"], "player":data["player"]});
		
		//deciding his position on the map
		console.log("This is new player position - " + data["side"]);
		
		//sending the new player's data to the other player
		socket.broadcast.emit("newPlayer", data);
		
		//Telling the second player first player's position
		if(data["player"] == "second")
			socket.emit("firstPosition", players[0]);
	});
	
	//Listens for players to be ready, and sends the ball's position
	socket.on("playersReady", function(data)
	{
		ball = {
					"id" : "superBall",
					"x" : (data["x"]/2 - 13),
					"y" : (data["y"]/2 - 13)
			   };
			   
		io.sockets.emit("enterTheBall", ball);	   
	});
	
	//Listening players to disconnect
	socket.on('disconnect', function()
							{
								var xxx = sckt.indexOf(socket.id);
								
								//deleting the player that left
								if(sckt.indexOf(socket.id) != -1)
								{
									sckt.splice(xxx, 1);
								}
								
								//deleting the player that left							
								for(var tmp in players)
								{
									if(players[tmp]["id"] == socket.id)
									{
										//Sending the data of the player, that left
										io.sockets.emit("playerLeft", players[tmp]);
										
										players.splice(tmp, 1);
									}
									
									//Logging the players count
									console.log(players.length);
								}
								
								//Logging the socket array
								console.log(sckt);	
							});	
});			*/
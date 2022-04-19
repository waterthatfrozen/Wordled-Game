"use strict"; 

var express = require("express"),
	http = require("http"),
	app;

app = express();

const path = __dirname + "/client";
const PORT = process.env.PORT || 3000;
app.use(express.static(path));
http.createServer(app).listen(PORT, function() {
	console.log("Server listening on: http://localhost:"+PORT);
});

// set up our routes
app.get("/hello", function (req, res) {
    res.send("Hello World!");
});

app.get("/",function(req,res){
	res.sendFile(path+"/index.html");
});

app.get("/world-stats",function(req,res){
	res.sendFile(path+"/stats.html");
});

app.get("/how-to-play",function(req,res){
	res.sendFile(path+"/instruction.html");
});
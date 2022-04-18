"use strict"; 

var express = require("express"),
	http = require("http"),
	app;

app = express();
const path = __dirname + "/client";
app.use(express.static(path));
const port = 8080;
http.createServer(app).listen(port);
console.log('Server started');

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
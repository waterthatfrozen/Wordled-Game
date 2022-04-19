"use strict"; 

var express = require("express"),
	// https = require("https"),
	http = require("http"),
	// fs = require("fs"),
	app;

app = express();

// var options = {
// 	key: fs.readFileSync(__dirname + '/cert/server.key'),
// 	cert: fs.readFileSync(__dirname + '/cert/server.cert')
// };

// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

const path = __dirname + "/client";
app.use(express.static(path));
http.createServer(app).listen(8080);
// https.createServer(options, app).listen(443);
console.log('Server started at http://localhost');

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
"use strict"; 

var express = require("express"),
	http = require("http"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	app;

app = express();
app.use(bodyParser.json());

const path = __dirname + "/client";
const PORT = process.env.PORT || 3000;
app.use(express.static(path));
http.createServer(app).listen(PORT, function() {
	console.log("Server listening on: http://localhost:"+PORT);
});

const uri = "mongodb+srv://des422-wordled:IvMBkmr7NgBMWvv8@des422-wordled.rtbin.mongodb.net/wordled-stats?retryWrites=true&w=majority";
mongoose.connect(uri);
console.log("Connected to MongoDB");
const scorecardSchema = mongoose.Schema({
	score: Number,
	count: Number
});
const scoreModel = mongoose.model('stats', scorecardSchema);

// set up our routes
app.get("/hello", function (_req, res) {
    res.send("Hello World!");
});

app.get("/",function(_req,res){
	res.sendFile(path+"/index.html");
});

app.get("/world-stats",function(_req,res){
	res.sendFile(path+"/stats.html");
});

app.get("/how-to-play",function(_req,res){
	res.sendFile(path+"/instruction.html");
});

app.get("/get-stats",function(_req,res){
	scoreModel.find({}).sort({score: -1}).exec(function(err,obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
});

app.get("/reset-stats",function(_req,res){
	scoreModel.updateMany({},{$set:{"count":0}},function(err,_obj){
		if(err){
			res.send("Reset wordled stats failed!\nError: "+err);
		}else{
			res.send("Reset wordled stats successful!");
		}
	});
});

app.post("/update-stats",function(req,res){
	var score = req.body.score;
	scoreModel.findOne({"score":{$eq:score}}, function(err, obj){
		if(err){
			res.send("error with finding record "+err);
		}else{
			var new_count = obj["count"] + 1;
			scoreModel.updateOne({"score":score},{$set:{"count":new_count}}, function(err, _obj){
				if(err){
					res.send("error with finding record "+err);
				}else{
					res.send("update stats record successful");
				}
			});
		}
	});
});
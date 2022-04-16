var express = require("express"),
	http = require("http"),
	app;

// Create our Express-powered HTTP server
// and have it listen on port 8080

app = express();
app.use(express.static(__dirname + "/client"));
http.createServer(app).listen(8080);

// set up our routes
app.get("/hello", function (req, res) {
    res.send("Hello World!");
});

app.get("/goodbye", function (req, res) {
	res.send("Goodbye World!");
});
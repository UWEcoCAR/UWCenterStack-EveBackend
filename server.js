var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;

var express = require("express");
var app = express();
var mongoose = require('mongoose');
var UserModel = require("./models.js/User.js"),
    TripModel = require('./models.js/Trip.js'),
    DataPointModel = require('./models.js/DataPoint.js');

app.get("/getDataPoints", function(req, res) {
  console.log("request for data points");
  databaseQueries.getDataPoints(function(data) {
    console.log("I got the data", data);
    var efficiencyAndLocation = [];
    for (var i = 0; i < data.length; i++) {
      efficiencyAndLocation.push({
        location: data[i].location,
        efficiency: Math.floor((Math.random() * 100) + 1)
      });
    }
    res.send(efficiencyAndLocation);
  });
});

/* serves main page */
app.get("/", function(req, res) {
  res.sendfile('index.html')
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){
   console.log('static file request : ' + req.params);
   res.sendfile( __dirname + req.params[0]);
});

var port = process.env.PORT || 8888;
app.listen(port, function() {
 console.log("Listening on " + port);
});

var User;
var Trip;
var DataPoint;

mongoose.connect('mongodb://localhost/ecocarData');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var databaseQueries = {};

db.once('open', function(callback) {
  // ready
  console.log("database ready");

  User = mongoose.model('User', UserModel, 'User');
  Trip = mongoose.model('Trip', TripModel, 'Trip');
  DataPoint = mongoose.model('DataPoint', DataPointModel, 'DataPoint');

  databaseQueries.getDataPoints = function(callback) {
    return DataPoint.find(function(err, dataPts) {
      if (err) return console.log(err);
      console.log(dataPts);
      callback(dataPts);
    });
  }
});




console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;

var express = require("express");
var app = express();
var mongoose = require('mongoose');
var UserModel = require('./models/User.js'),
    TripModel = require('./models/Trip.js'),
    DataPointModel = require('./models/DataPoint.js');

app.get("/getDataPoints", function(req, res) {
  console.log('getDataPoints: ' + JSON.stringify(req.query));
  databaseQueries.getDataPoints(req.query, function(data) {
    console.log(data);
    var efficiencyAndLocation = [];
    // for (var i = 0; i < data.length; i++) {
    //   efficiencyAndLocation.push({
    //     location: data[i].location,
    //     efficiency: Math.floor((Math.random() * 100) + 1)
    //   });
    // }
    res.send(data);
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

mongoose.connect('mongodb://localhost/ecocar2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var databaseQueries = {};

db.once('open', function(callback) {
  // ready
  mongoose.connection.db.collectionNames(function (err, names) {
    console.log(names);
  });
  console.log("database ready");

  //User = mongoose.model('User', UserModel, 'User');
  //Trip = mongoose.model('trip', TripModel, 'trip');
  DataPoint = mongoose.model('datapoints', DataPointModel, 'datapoints');

  databaseQueries.getDataPoints = function(range, callback) {

var topLeft     = [range.left,range.top];
var bottomRight = [range.right,range.bottom];
var topRight    = [range.right,range.top];
var bottomLeft  = [range.left,range.bottom];

DataPoint.find({
    geo: {
        $geoWithin : {
            $geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    topLeft,
                    topRight,
                    bottomRight,
                    bottomLeft,
                    topLeft // close off the polygon
                  ]
                ]
            }
        }
    }
}, function(err, results) {
  if (err) console.log(err);
  for (var i = 0; i < results.length; i++) {
    results[i].efficiecy = 10;
  }

  callback(results);
});
    /*
    return DataPoint.find()
      .where('location.lat').gte(range.bottom).lte(range.top)
      .where('location.long').gte(range.right).lte(range.left)
      .exec(function(err, dataPts) {
        if (err) return console.log(err);

        console.log("got", dataPts);
        callback(dataPts);
      });
*/
  }
});




console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

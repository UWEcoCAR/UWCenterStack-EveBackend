var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;

var express = require("express");
var app = express();
var mongoose = require('mongoose');

var User;
var Trip;
var DataPoint;

app.get("/getDataPoints", function(req, res) {
  console.log("request for data points");
  databaseQueries.getDataPoints(function(data) {
    console.log("I got the data", data);
    var efficiencyAndLocation = [];
    for (var i = 0; i < data.length; i++) {
      efficiencyAndLocation.push({
        location: data[i].location,
        efficiency: Math.floor((Math.random() * 25) + 1)
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



mongoose.connect('mongodb://localhost/ecocarData');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var databaseQueries = {};

db.once('open', function(callback) {
    // ready
    console.log("database ready");
  var dataPointSchema = mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      tripId: mongoose.Schema.Types.ObjectId,
      location: {lat: Number, long: Number},
      fuelConsumption: Number,
      pedalPosition: Number,
      optimalPosition: Number,
      speed: Number,
      acceleration: Number,
      engineTRQ: Number,
      engineRPM: Number,
      motorTRQ: Number,
      motorRPM: Number,
      batterySoc: {type: Number, min: 0, max: 100},
      batteryVolatage: Number,
      batteryCurrent: Number,
      fuel: {type: Number, min: 0, max: 100},
      engineTemp: Number,
      motorTemp: Number,
      batteryTemp: Number,
      elevation: Number,
      timestamp: {type: Date, default: Date.now}
  });

  var tripSchema = mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      _id: mongoose.Schema.Types.ObjectId,
      startLocation: {
          time: {type: Date, default: Date.now},
          location: {lat: Number, long: Number},
      },
      endLocation: {
          time: Date,
          location: {lat: Number, long: Number},
      },
      MPGe: Number,
      distance: Number,
      cost: Number,
      speed: Number,
      dieselEnergy: Number,
      electricEnergy: Number
  });


  // define custom methods
  // Taken from nicks code

  /**
   * Updates the user stats based off of child trips
   * @param Closure callback
   */
  tripSchema.methods.calculate = function(callback) {
      console.log('calculated trip: '+this._id);
      callback && callback(null, this);
  };

  /**
   * Adds a DataPoint to the trip
   * @param object params
   * @param Closure callback
   */
  tripSchema.methods.newPoint = function(params, callback) {
      params.tripId = this._id;
      (new DataPoint(params)).save(callback);
  };

  // make remove and calculate cascade down
  tripSchema.pre('remove', function(next) {
      DataPoint.find({tripId : this._id}).remove(next);
  });
  tripSchema.pre('calculate', function(next) {
      // not cascading this yet, might not even need too
      next();
  });

// create user schema
var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {type:String, default: ""},
    lastName: {type:String, default: ""},
    distance: Number,
    MPGe: Number,
    cost: Number,
    dieselEnergy: Number,
    electricEnergy: Number
});

// define custom methods

/**
 * Updates the user stats based off of child trips
 * @param Closure callback
 */
userSchema.methods.calculate = function(callback) {
    console.log('calculated user: '+this._id);
    callback && callback();
};

/**
 * Creates a new trip linked to the user
 * @param object params
 * @param Closure callback
 */
userSchema.methods.newTrip = function(params, callback) {
    params.userId = this._id;
    (new Trip(params)).save(callback);
}

// cascade delete and calculate
userSchema.pre('remove', function(next) {
    Trip.find({userId : this._id}).remove().exec();
    DataPoint.find({userId : this._id}).remove().exec();
    next();
});
userSchema.pre('calculate', function(next) {
    Trip.find({userId : this._id}).stream()
        .on('err', function(err) {
            console.log(error);
            next();
        })
        .on('data', function(doc) {
            doc.calculate();
        })
        .on('close', function() {
            next();
        });
});

 User = mongoose.model('User', userSchema, 'User');
 Trip = mongoose.model('Trip', tripSchema, 'Trip');
 DataPoint = mongoose.model('DataPoint', dataPointSchema, 'DataPoint');
    databaseQueries.getDataPoints = function(callback) {
      return DataPoint.find(function(err, dataPts) {
        if (err) return console.log(err);
        console.log(dataPts);
        callback(dataPts);
      });
    }
});




console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

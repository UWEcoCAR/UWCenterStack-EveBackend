var _ = require('underscore');
var util = require('util');
var events = require('events');
var loc = require('./elevation/ElevationService');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/evebackend-' + (process.NODE_ENV === 'production' ? 'prod' : 'dev'));

var Trip = require('./models/Trip');
var User = require('./models/User');
var Timer = require('./Timer');
var _ = require('underscore');

var dieselEnergy = function(fuelConsumption) {
    return -fuelConsumption * 9.96 * 1000 * .1 / 3600.0;
}

var electricalEnergy = function(volt, current) {
    return volt * current * .1 / 3600.0;
}

var kinecticEnergy = function(speed, prevSpeed) {
    return 0.5 * 2025 * (Math.pow(speed * 1000 / 3600.0, 2) - Math.pow(prevSpeed * 1000 / 3600.0, 2)) * 2.78 / 10000;
}

var potentialEnergy = function(elevation, prevElevation) {
    return 2054 * 9.81 * (elevation - prevElevation) * 2.78 / 10000;
}

// initialize these to first datapoint
var prevSpeed = 0;
var prevElevation = null;

// Local variables to save data to update Trip every time
var DE = 0;
var EE = 0;
var KE = 0;
var PE = 0;
var speed = 0;
var counter = 0;

/**
 * Function logs data into the database every 0.1 seconds
 * Makes a new trip and creates datapoints for that trip
 * finds or creates user
 *
 * @param Finds Can Messsages for data
 * @param username to find or create user
 * @param emits Events
 * @param Closure callback
 */
module.exports.EveBackend = function(canReadWriter, username, eventEmitter, callback) {
    this.eventEmitter = eventEmitter;
    var self = this;
    // Finds or makes a User
    var name = username.split(" ");
    var self = this;

    // Set elevation
    this.elevation = null;
    try {
        var quadrant = new loc.Quadrant({
            filename: './elevation/data/N42W084.hgt'
        });
        canReadWriter.on('gpsLatitude', function() {
            quadrant.read(canReadWriter.getMail('gpsLatitude'), canReadWriter.getMail('gpsLongitude'), function(err, height) {
                if (err) {
                    console.error(err);
                    return;
                }
                self.elevation = height;
            });
        });
    } catch (err) {
        console.err(err);
    }

    // Finds or makes a User
    User.findOne({firstName: name[0], lastName: name[1]}, function(err,user) {
        if (user == null) {
            this.user = new User({
                firstName: name[0],
                lastName: name[1],
            });
            this.user.save();
        } else {
            this.user = user;
        }
        // Adds a new trip to user
        this.user.newTrip({}, function(trip) {
            this.timer = new Timer().setInterval(100, 5, _.bind(function() {
                counter++;
                DE = dieselEnergy(canReadWriter.getMail('fuelConsumption'));
                EE = electricalEnergy(canReadWriter.getMail('batteryVoltage'), canReadWriter.getMail('batteryCurrent'));
                KE = kinecticEnergy(canReadWriter.getMail('vehicleSpeed'), prevSpeed);
                PE = self.elevation !== null && prevElevation != null ? potentialEnergy(self.elevation, prevElevation) : 0;
                speed = canReadWriter.getMail('vehicleSpeed');
                trip.newPoint({
                        geo: [canReadWriter.getMail('gpsLatitude'), canReadWriter.getMail('gpsLongitude')],
                        pedalPosition: canReadWriter.getMail('vehicleAccel'),
                        speed: canReadWriter.getMail('vehicleSpeed'),
                        engineTrq: canReadWriter.getMail('engineTorque'),
                        engineRpm: canReadWriter.getMail('engineRpm'),
                        engineTemp: canReadWriter.getMail('engineTemp'),
                        motorTrq: canReadWriter.getMail('motorTorque'),
                        motorRpm: canReadWriter.getMail('motorRpm'),
                        motorTemp: canReadWriter.getMail('motorTemp'),
                        batterySoc: canReadWriter.getMail('batterySoc'),
                        batteryVoltage: canReadWriter.getMail('batteryVoltage'),
                        batteryCurrent: canReadWriter.getMail('batteryCurrent'),
                        batteryTemp: canReadWriter.getMail('batteryTemp'),
                        fuelConsumption: canReadWriter.getMail('fuelConsumption'),
                        elevation: self.elevation,
                        dieselEnergyChange: dieselEnergy(canReadWriter.getMail('fuelConsumption')),
                        electricalEnergyChange: electricalEnergy(canReadWriter.getMail('batteryVoltage'), canReadWriter.getMail('batteryCurrent')),
                        kinecticEnergyChange: kinecticEnergy(canReadWriter.getMail('vehicleSpeed'), prevSpeed),
                        potentialEnergyChange: self.elevation !== null && prevElevation != null ? potentialEnergy(self.elevation, prevElevation) : 0
                    }, // dataPoint to manipulate or call methods on
                    function(dataPoint) {
                        eventEmitter.emit('MPGe', dataPoint.calcMPGe());
                        eventEmitter.emit('vehichleEfficiencyScore', dataPoint.vehicleEfficiencyScore);
                    });
                prevElevation = self.elevation;
                prevSpeed = canReadWriter.getMail('vehicleSpeed');

                // Updates trip
                trip.distance += speed * 0.1;
                trip.dieselEnergy += DE;
                trip.electricalEnergy += EE;
                trip.kinecticEnergy += KE;
                trip.potentialEnergy += PE;
                // console.log(trip.potentialEnergy);
                trip.save(function(err) {
                    err && console.error(err);
                });
                user.dieselEnergy += DE;
                user.electricalEnergy += EE;
                user.kinecticEnergy += KE;
                user.potentialEnergy += PE;
                user.distance += speed * 0.1;
                // console.log(speed);
                user.save(function(err) {
                    err && console.error(err);
                });
            }, this));
            // Call a callback on user
            callback(user);
        });
    });
}

/**
 * Finds and calls a callback on all users
 * @param Closure callback on all the users
 */
module.exports.EveBackend.prototype.getAllUsers = function(callback) {
    User.find(function(err, results) {
        if(!err) {
            callback(results);
        } else {
            console.log(err);
        }
    })
}

/**
 * Given a username, finds all trips and calls callback on them
 * @param username
 * @param callback
 */
module.exports.EveBackend.prototype.getAllTrips = function(username, callback) {
    var name = username.split(" ");
    User.findOne({firstName: name[0], lastName: name[1]}, function(err,user) {
        if (user == null) {
            console.log("User not found");
        } else {
            user.getTrips(callback);
        }
    });
}

/*************************************************************************************
 *
 *
 *
 *
 ***************************************************************************************/

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
var UserModel = require('./models/User.js'),
    TripModel = require('./models/Trip.js'),
    DataPointModel = require('./models/DataPoint.js');

module.exports.Maps = function() {

};

module.exports.Maps.prototype.getDataPoints = function(query, callback) {
    console.log('getDataPoints: ' + JSON.stringify(query));
    databaseQueries.getDataPoints(query, function(data) {
        console.log(data);
        var efficiencyAndLocation = [];
        // for (var i = 0; i < data.length; i++) {
        //   efficiencyAndLocation.push({
        //     location: data[i].location,
        //     efficiency: Math.floor((Math.random() * 100) + 1)
        //   });
        // }
        callback(data);
    });
};

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var databaseQueries = {};

db.once('open', function(callback) {
    // ready
    mongoose.connection.db.collectionNames(function(err, names) {
        console.log(names);
    });
    console.log("database ready");

    //User = mongoose.model('User', UserModel, 'User');
    //Trip = mongoose.model('trip', TripModel, 'trip');
    //DataPoint = mongoose.model('evebackend-dev.datapoints', DataPointModel, 'evebackend-dev.datapoints');

    databaseQueries.getDataPoints = function(range, callback) {
        var topLeft     = [range.top,range.left];
        var bottomRight = [range.bottom,range.right];
        var topRight    = [range.top,range.right];
        var bottomLeft  = [range.bottom,range.left];

        DataPointModel.find({
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
            console.log('results:   ' + results);
            if (err) console.log(err);
            for (var i = 0; i < results.length; i++) {
                results[i].efficiency = results[i].calcMPGe();
                console.log(results[i].efficiency);
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
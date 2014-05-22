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


    return 2025 * 9.81 * (elevation - prevElevation) * 2.78 / 10000;
}

// initialize these to first datapoint
var prevSpeed = 0;
var prevElevation = 0;

// Local variables to save data to update Trip every time
// Can alternatively use trip.update but this should work as well
var DE = 0;
var EE = 0;
var KE = 0;
var PE = 0;
var speed = 0;
module.exports.EveBackend = function(canReadWriter, username, callback) {

  var name = username.split(" ");
  console.log(name);
  var self = this;
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
    // Adds a new trip
    this.user.newTrip({}, function(trip) {
        this.timer = new Timer().setInterval(100, 5, _.bind(function() {
        DE = dieselEnergy(canReadWriter.getMail('fuelConsumption'));
        EE = electricalEnergy(canReadWriter.getMail('batteryVoltage'), canReadWriter.getMail('batteryCurrent'));
        KE = kinecticEnergy(canReadWriter.getMail('vehicleSpeed'), prevSpeed);
        PE = potentialEnergy(canReadWriter.getMail('elevation'), prevElevation);
        speed = canReadWriter.getMail('vehicleSpeed');
            trip.newPoint({
                location: {
                    lat: canReadWriter.getMail('gpsLatitude'),
                    long: canReadWriter.getMail('gpsLongitude')
                },
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
                elevation: canReadWriter.getMail('elevation'),
                dieselEnergyChange: dieselEnergy(canReadWriter.getMail('fuelConsumption')),
                electricalEnergyChange: electricalEnergy(canReadWriter.getMail('batteryVoltage'), canReadWriter.getMail('batteryCurrent')),
                kinecticEnergyChange: kinecticEnergy(canReadWriter.getMail('vehicleSpeed'), prevSpeed),
                potentialEnergyChange: potentialEnergy(canReadWriter.getMail('elevation'), prevElevation)
            }, function(dataPoint) {
                prevElevation = dataPoint.elevation;
                prevSpeed = dataPoint.speed;
                // console.log(speed)

            });
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
        callback(user);
    });
  });
}

module.exports.EveBackend.prototype.getAllUsers = function(callback) {
    User.find(function(err, results) {
        if(!err) {
            callback(results);
        } else {
            console.log(err);
        }
    })
}

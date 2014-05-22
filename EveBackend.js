var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/evebackend-' + (process.NODE_ENV === 'production' ? 'prod' : 'dev'));

var Trip = require('./models/Trip');
var User = require('./models/User');
var Timer = require('./Timer');
var _ = require('underscore');

module.exports.CanLogger = function(canReadWriter, username) {
  var name = username.split(" ");
  console.log(name);
  var self = this;
  User.findOne({firstName: name[0], lastName: name[1]}, function(err,user) {
    if (user == null) {
      this.user = new User({
        firstName: name[0],
        lastName: name[1],
        distance: 0,
        MPGe: 0,
        cost: 0,
        dieselEnergy: 0,
        electricEnergy: 0
      });
      this.user.save();
      console.log("made user");
    } else {
      console.log("found")
      this.user = user;
    }
    this.user.newTrip({}, function(trip) {
      console.log(trip);
      this.timer = new Timer().setInterval(100, 5, _.bind(function() {
        trip.newPoint({
            location: {
              lat : canReadWriter.getMail('gpsLatitude'),
              long : canReadWriter.getMail('gpsLongitude')
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
            fuelConsumption: canReadWriter.getMail('fuelConsumption')
        }, function(err) {
          err && console.log(err);
        });
      }, this));
    });
  });
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/evebackend-' + (process.NODE_ENV === 'production' ? 'prod' : 'dev'));

var Trip = require('./models/Trip');
var Timer = require('./Timer');
var _ = require('underscore');

module.exports.CanLogger = function(canReadWriter) {
    this.trip = new Trip({});
    this.trip.save(_.bind(function(err) {
        err && console.log(err);
        this.timer = new Timer().setInterval(100, 5, _.bind(function() {
            this.trip.newPoint({
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
                fuelConsumption: canReadWriter.getMail('fuelConsumption')
            }, function(err) {
                err && console.log(err);
            });
        }, this));
    }, this));
}

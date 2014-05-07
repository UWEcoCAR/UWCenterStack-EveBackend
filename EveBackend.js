var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/evebackend-' + (process.NODE_ENV === 'production' ? 'prod' : 'dev'));

var Trip = require('./models/Trip');
var Timer = require('./Timer');
var _ = require('underscore');

var DieselEnergy = function(fuelConsumption) {
    return -fuelConsumption * 9.96 * 1000 * .1 / 3600.0;
}

var ElectricalEnergy = function(volt, current) {
    return volt * current * .1 / 3600.0;    
}

var KinecticEnergy = function(speed, prevSpeed) {
    return 0.5 * 2025 * (Math.pow(speed * 1000 / 3600.0, 2) - Math.pow(prevSpeed * 1000 / 3600.0, 2)) * 2.78 / 10000;
}

var PotentialEnergy = function(elevation, prevElevation) {
    return 2025 * 9.81 * (elevation - prevElevation) * 2.78 / 10000;
}

// initialize these to first datapoint
var prevSpeed = 25;
var prevElevation = 40;

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
                elevation: canReadWriter.getMail('elevation');
                DieselEnergyChange: DieselEnergy(this.fuelConsumption);
                ElectricalEnergyChange: ElectricalEnergy(this.batteryVoltage, this.batteryCurrent);
                KinecticEnergyChange: KinecticEnergy(speed, prevSpeed);
                PotentialEnergyChange: PotentialEnergy(elevation, prevElevation);
                prevElevation = this.elevation
                prevSpeed = this.speed
            }, function(err) {
                err && console.log(err);
            });
        }, this));

    }, this));
}

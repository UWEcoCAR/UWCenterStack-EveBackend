var mongoose = require('mongoose');

var dataPointSchema = mongoose.Schema({
    tripId: mongoose.Schema.Types.ObjectId, 
    location: {lat: Number, long: Number},
    fuelConsumption: Number,
    pedalPosition: Number,
    optimalPosition: Number,
    speed: Number,
    acceleration: Number,
    engineTrq: Number,
    engineRpm: Number,
    motorTrq: Number,
    motorTpm: Number,
    batterySoc: {type: Number, min: 0, max: 100},
    batteryVoltage: Number,
    batteryCurrent: Number,
    fuel: {type: Number, min: 0, max: 100},
    engineTemp: Number,
    motorTemp: Number,
    batteryTemp: Number,
    elevation: Number,
    DieselEnergyChange: Number,
    ElectricalEnergyChange: Number,
    KinecticEnergyChange: Number,
    PotentialEnergyChange: Number,
    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('DataPoint', dataPointSchema);

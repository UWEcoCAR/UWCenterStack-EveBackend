var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var dataPointSchema = mongoose.Schema({
    tripId: mongoose.Schema.Types.ObjectId, 
    location: {lat: mongoose.Schema.Types.Double, long: mongoose.Schema.Types.Double},
    fuelConsumption: mongoose.Schema.Types.Double,
    pedalPosition: mongoose.Schema.Types.Double,
    optimalPosition: mongoose.Schema.Types.Double,
    speed: mongoose.Schema.Types.Double,
    acceleration: mongoose.Schema.Types.Double,
    engineTrq: mongoose.Schema.Types.Double,
    engineRpm: mongoose.Schema.Types.Double,
    motorTrq: mongoose.Schema.Types.Double,
    motorTpm: mongoose.Schema.Types.Double,
    batterySoc: {type: mongoose.Schema.Types.Double, min: 0, max: 100},
    batteryVoltage: mongoose.Schema.Types.Double,
    batteryCurrent: mongoose.Schema.Types.Double,
    fuel: {type: mongoose.Schema.Types.Double, min: 0, max: 100},
    engineTemp: mongoose.Schema.Types.Double,
    motorTemp: mongoose.Schema.Types.Double,
    batteryTemp: mongoose.Schema.Types.Double,
    elevation: mongoose.Schema.Types.Double,
    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('DataPoint', dataPointSchema);

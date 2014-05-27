var mongoose = require('mongoose');

var dataPointSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tripId: mongoose.Schema.Types.ObjectId, 
    geo: {type: [Number], index: '2d'},
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

module.exports = mongoose.model('datapoints', dataPointSchema);

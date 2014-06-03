var mongoose = require('mongoose');

var dataPointSchema = mongoose.Schema({
    tripId: mongoose.Schema.Types.ObjectId,
    geo: {type: [Number], index: '2d'},
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
    dieselEnergyChange: Number,
    electricalEnergyChange: Number,
    kinecticEnergyChange: Number,
    potentialEnergyChange: Number,
    vehicleEfficiencyScore: {type: Number, default: 0},
    timestamp: {type: Date, default: Date.now}
});

/**
 * Calculates the total MPGe given the current
 * energy changes
 */
dataPointSchema.methods.calcMPGe= function () {
  var totalEnergyChange = this.dieselEnergyChange + this.electricalEnergyChange +
    this.kinecticEnergyChange + this.potentialEnergyChange;
  var MPGe = (this.speed * 0.1 / 3600 * 0.621) / (totalEnergyChange / 1000 / 37.72);
  return MPGe;
}

module.exports = mongoose.model('datapoints', dataPointSchema);

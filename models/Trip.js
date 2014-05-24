var mongoose = require('mongoose'),
    DataPoint = require('./DataPoint.js');

// create trip schema
var tripSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    startLocation: {
        time: {type: Date, default: Date.now},
        location: {lat: Number, long: Number}
    },
    endLocation: {
        time: Date,
        location: {lat: Number, long: Number}
    },
    distance: {type: Number, default: 0},
    cost: Number,
    dieselEnergy: {type: Number, default: 0},
    electricalEnergy: {type: Number, default: 0},
    kinecticEnergy: {type: Number, default: 0},
    potentialEnergy: {type: Number, default: 0}
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
 * Calculates the total MPGe given the current
 * energy changes
 * @returns {MPGe this trip}
 */
tripSchema.methods.getMPGe = function() {
  var totalEnergyChange = this.dieselEnergy + this.electricalEnergy +
    this.kinecticEnergy + this.potentialEnergy;
  var MPGe = -(this.distance / 1000 * 0.621) / (totalEnergyChange / 1000 / 37.72);
  return MPGe;
}

/**
 *
 * @returns {Diesel Consumed this trip}
 */
tripSchema.methods.getDieselEnergyConsumption = function() {
    return this.dieselEnergy;
}

/**
 *
 * @returns {Electricity Consumed this trip}
 */
tripSchema.methods.getElectricalEnergyConsumption = function() {
    return this.electricalEnergy;
}

/**
 *
 * @returns {Diesel Cost this trip}
 */
tripSchema.methods.getDieselCost= function() {
    var dieselEnergyCost = - (this.dieselEnergy / 1000 / 37.72 * 3.98) / (this.distance / 1000 * 0.621);
    return dieselEnergyCost;
}

/**
 *
 * @returns {Electricity Cost this trip}
 */
tripSchema.methods.getElectricCost = function() {
    var electricalEnergyCost = - this.electricalEnergy / 1000 * 0.11 / (this.distance / 1000 * 0.621);
    return electricalEnergyCost;
}

/**
 *
 * @returns {*[Elecrtical Energy Consumed, Diesel Energy Consumed]}
 */
tripSchema.methods.calculateConsumptions = function() {
  var energyConsumed = [this.electricalEnergy, this.dieselEnergy];
  return energyConsumed;
}

/**
 * Adds a DataPoint to the trip
 * @param object params
 * @param Closure callback
 */
tripSchema.methods.newPoint = function(params, callback) {
  params.tripId = this._id;
  var dataPoint = new DataPoint(params);
  dataPoint.save(function() {
      callback(dataPoint);
  });
};

// make remove and calculate cascade down
tripSchema.pre('remove', function(next) {
  DataPoint.find({tripId : this._id}).remove(next);
});
tripSchema.pre('calculate', function(next) {
  // not cascading this yet, might not even need too
  next();
});

// finally export the Model
module.exports = mongoose.model('Trip', tripSchema);

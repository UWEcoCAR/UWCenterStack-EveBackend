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
  MPGe: Number,
  distance: Number,
  cost: Number,
  speed: Number,
  dieselEnergy: Number,
  electricEnergy: Number
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
 * Adds a DataPoint to the trip
 * @param object params
 * @param Closure callback
 */
tripSchema.methods.newPoint = function(params, callback) {
  params.tripId = this._id;
  (new DataPoint(params)).save(callback);
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

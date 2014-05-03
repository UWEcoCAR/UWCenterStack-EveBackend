var mongoose = require('mongoose'),
    DataPoint = require('./DataPoint.js');
require('mongoose-double')(mongoose);

// create trip schema
var tripSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    startLocation: {
        time: {type: Date, default: Date.now},
        location: {lat: mongoose.Schema.Types.Double, long: mongoose.Schema.Types.Double}
    },
    endLocation: {
        time: Date,
        location: {lat: mongoose.Schema.Types.Double, long: mongoose.Schema.Types.Double}
    },
    MPGe: mongoose.Schema.Types.Double,
    distance: mongoose.Schema.Types.Double,
    cost: mongoose.Schema.Types.Double,
    speed: mongoose.Schema.Types.Double,
    dieselEnergy: mongoose.Schema.Types.Double,
    electricEnergy: mongoose.Schema.Types.Double
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

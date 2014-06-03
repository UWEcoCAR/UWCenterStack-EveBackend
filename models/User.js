var mongoose = require('mongoose'),
    Trip = require('./Trip.js'),
    DataPoint = require('./DataPoint.js');

// create user schema
var userSchema = mongoose.Schema({
    firstName: {type:String, default: ""},
    lastName: {type:String, default: ""},
    distance: {type: Number, default: 0},
    cost: {type: Number, default: 0},
    dieselEnergy: {type: Number, default: 0},
    electricalEnergy: {type: Number, default: 0},
    kinecticEnergy: {type: Number, default: 0},
    potentialEnergy: {type: Number, default: 0}
});

// define custom methods

/**
 * Updates the user stats based off of child trips
 * @param Closure callback
 */
userSchema.methods.calculate = function(callback) {
    console.log('calculated user: '+this._id);
    callback && callback();
};

/**
 * Calculates the total MPGe given the current
 * energy changes
 */
userSchema.methods.getMPGe = function () {
    var totalEnergyChange = this.dieselEnergy + this.electricalEnergy +
    this.kinecticEnergy + this.potentialEnergy;
    var MPGe = - (this.distance/1000 * 0.621) / (totalEnergyChange / 1000 / 37.72);
    return MPGe;
}

/**
 * Creates a new trip linked to the user
 * @param object params
 * @param Closure callback
 */
userSchema.methods.newTrip = function(params, callback) {
    params.userId = this._id;
    var trip = new Trip(params);
    trip.save(function() {
        callback(trip);
    });
}

// Gets all trips for that user
userSchema.methods.getTrips = function(callback) {
    Trip.find({userId : this._id}, function(err, trips) {
        callback(trips);
    });
}

// cascade delete and calculate
userSchema.pre('remove', function(next) {
    Trip.find({userId : this._id}).remove().exec();
    DataPoint.find({userId : this._id}).remove().exec();
    next();
});
userSchema.pre('calculate', function(next) {
    Trip.find({userId : this._id}).stream()
        .on('err', function(err) {
            console.log(error);
            next();
        })
        .on('data', function(doc) {
            doc.calculate();
        })
        .on('close', function() {
            next();
        });
});

var User = mongoose.model('User', userSchema);

module.exports = User;

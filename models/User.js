var mongoose = require('mongoose'),
    Trip = require('./Trip.js'),
    DataPoint = require('./DataPoint.js');

// create user schema
var userSchema = mongoose.Schema({
    firstName: {type:String, default: ""},
    lastName: {type:String, default: ""},
    distance: Number,
    MPGe: Number,
    cost: Number,
    dieselEnergy: Number,
    electricEnergy: Number
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

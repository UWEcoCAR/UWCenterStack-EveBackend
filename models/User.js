var mongoose = require('mongoose'),
    Trip = require('./Trip.js'),
    DataPoint = require('./DataPoint.js');
require('mongoose-double')(mongoose);

// create user schema
var userSchema = mongoose.Schema({
    firstName: {type:String, default: ""},
    lastName: {type:String, default: ""},
    distance: mongoose.Schema.Types.Double,
    MPGe: mongoose.Schema.Types.Double,
    cost: mongoose.Schema.Types.Double,
    dieselEnergy: mongoose.Schema.Types.Double,
    electricEnergy: mongoose.Schema.Types.Double
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
    (new Trip(params)).save(callback);
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

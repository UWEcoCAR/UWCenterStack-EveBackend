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
    DieselEnergyChange: Number,
    ElectricalEnergyChange: Number,
    KinecticEnergyChange: Number,
    PotentialEnergyChange: Number,
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
 * Calculates the total MPGe given the current
 * energy changes
 */
userSchema.methods.calcMPGe= function () {
  var totalEnergyChange = this.DieselEnergyChange + this.ElectricalEnergyChange +
    this.KinecticEnergyChange + this.PotentialEnergyChange;
  var MPGe = (0.1 / 3600 * 0.621) / (totalEnergyChange / 1000 / 37.72);
  return MPGe;
}

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

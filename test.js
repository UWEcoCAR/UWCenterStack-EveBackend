var emitter = require('./TestCanEmitter');
var EveBackend = require('./EveBackend').EveBackend;
var _ = require('underscore');
var User = require('./models/User');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var efficiencyEventEmitter = new events.EventEmitter();

/**
 * Catches all events emitted
 * Events are MPGe scores for every datapoint
 */
eventEmitter.on('MPGe', function(MPGe) {
    //console.log(MPGe);
});

/**
 * Catches vehicleEfficiencyScores
 */
efficiencyEventEmitter.on("vehicleEfficiencyScore", function(score) {
  // Do something with score
  // score is emitted every time there is a new datapoint
})

var eveBackend = new EveBackend(new emitter(), "Arush Rathnam", eventEmitter, function(user) {
    console.log('User MPGe: ' + user.getMPGe());
    var trips = user.getTrips(function(trips) {
        _.each(trips, function(trip) {
            // console.log('trip: ' + trip);
            console.log("MPGe: " + trip.getMPGe());
            console.log("Electric Energy Consumption: " + trip.getElectricalEnergyConsumption());
            console.log("Diesel Energy Consumption: " + trip.getDieselEnergyConsumption());
            console.log("Electric Cost: " + trip.getElectricCost());
            console.log("Diesel Cost: " + trip.getDieselCost());
        })
    });
});

/**
 * Gets all users, can do something with them
 */
var users = eveBackend.getAllUsers(function(users){
    console.log(users);
});

/**
 * Gets all trips
 * @param Name
 * @param Closure Callback
 */
var trips = eveBackend.getAllTrips("Arush Rathnam", function(trips){
 // do something with trips array
 // refer to Trip.js model for all methods that can be called
 console.log(trips);
});

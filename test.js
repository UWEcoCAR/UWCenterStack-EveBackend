var emitter = require('./TestCanEmitter');
var EveBackend = require('./EveBackend').EveBackend;
var _ = require('underscore');
var User = require('./models/User');



var eveBackend = new EveBackend(new emitter(), "Arush Shankar", function(user) {
    console.log('User MPGe: ' + user.getMPGe());
    var trips = user.getTrips(function(trips) {
        _.each(trips, function(trip) {
            console.log('trip: ' + trip);
            console.log("MPGe: " + trip.getMPGe());
            console.log("Electric Energy Consumption: " + trip.getElectricalEnergyConsumption());
            console.log("Diesel Energy Consumption: " + trip.getDieselEnergyConsumption());
            console.log("Electric Cost: " + trip.getElectricCost());
            console.log("Diesel Cost: " + trip.getDieselCost());
        })
    });

});
var users = eveBackend.getAllUsers(function(users){
    // console.log(users);
});

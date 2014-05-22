var emitter = require('./TestCanEmitter');
var EveBackend = require('./EveBackend').EveBackend;
var _ = require('underscore');



var eveBackend = new EveBackend(new emitter(), "Arush Shankar", function(user) {
    // TODO:
    // console.log(user.getMPGe());
    // // array
    // var trips = user.getTrips();
    // _.each(trips, function(trip) {
    //     console.log(trip.getMPGe());
    //     console.log(trip.getElectricEnergyConsumption());
    //     console.log(trip.getDieselEnergyConsumption());
    //     console.log(trip.getElectricCost());
    //     console.log(trip.getDieselCost());
    // })
});
var users = eveBackend.getAllUsers(function(users){
    console.log(users);
});

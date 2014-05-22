var _ = require('underscore');
var util = require('util');
var events = require('events');

/**
 * Fakes CAN messages. Events fire every 100 ms. Values fluctuate randomly. You can use the
 * accelPress, brakePressed, inPark, and charging properties to enact change in the values.
 * @type {Function}
 */

var TestCanEmitter = module.exports = function() {
    this.elevation = 0;
    this.prevElevation = 0;

    this.accelPressed = false;
    this.brakePressed = false;
    this.inPark = false;
    this.charging = false;

    this.fuelConsumption = 7;
    this.batteryVoltage = 375;
    this.batteryCurrent = -25;
    this.batterySoc = 80;
    this.batteryTemp = 20;
    this.motorRpm = 0;
    this.motorTorque = 0;
    this.motorTemp = 20;
    this.transGear = -2;
    this.transRatio = 0;
    this.engineRpm = 1000;
    this.engineTorque = 20;
    this.engineTemp = 20;
    this.vehicleAccel = 0;
    this.vehicleBrake = 0;
    this.vehicleSpeed = 50;
    this.chargerVoltage = 0;
    this.chargerCurrent = 0;

    setInterval(_.bind(function() {
        if (this.accelPressed) {
            this.fuelConsumption = 100;
            this.transGear = Math.max(Math.min(this.transGear + 0.2, 6), 1);
            this.transRatio = 6.12 / this.transGear;
            this.vehicleAccel = 100;
            this.vehicleBrake = 'no';
            this.prevVehicleSpeed = this.vehicleSpeed;
            this.vehicleSpeed = Math.min(this.vehicleSpeed + 2, 120);
            this.engineRpm = Math.min(this.engineRpm + 100, 5000);
            this.engineTorque = 300;
            this.engineTemp = Math.min(this.engineTemp + 0.2, 100);
            this.motorRpm = Math.min(this.motorRpm + 200, 10000);
            this.motorTorque = 300;
            this.motorTemp = Math.min(this.motorTemp + 0.2, 100);
            this.batteryVoltage = 360;
            this.batteryCurrent = 400;
            this.batterySoc = Math.max(this.batterySoc - 0.4, 10);
            this.batteryTemp = Math.min(this.batteryTemp + 0.2, 100);
        } else if (this.brakePressed) {
            this.fuelConsumption = 0;
            this.transGear = Math.max(this.transGear - 0.2, 1);
            this.transRatio = 6.12 / this.transGear;
            this.vehicleAccel = 0;
            this.vehicleBrake = 'yes';
            this.prevVehicleSpeed = this.vehicleSpeed;
            this.vehicleSpeed = Math.max(this.vehicleSpeed - 2, 0);
            this.engineRpm = Math.max(this.engineRpm - 100, 1000);
            this.engineTorque = 20;
            this.engineTemp = Math.max(this.engineTemp - 0.2, 20);
            this.motorRpm = Math.max(this.motorRpm - 200, 0);
            this.motorTorque = -200;
            this.motorTemp = Math.max(this.motorTemp - 0.2, 20);
            this.batteryVoltage = 390;
            this.batteryCurrent = -200;
            this.batterySoc = Math.min(this.batterySoc + 0.1, 100);
            this.batteryTemp = Math.max(this.batteryTemp - 0.2, 20);
        } else {}

        if (this.inPark) {
            this.transGear = -2;
        }

        if (this.charging) {
            this.chargerVoltage = 240;
            this.chargerCurrent = 10;
        } else {
            this.chargerVoltage = 0;
            this.chargerCurrent = 0;
        }

        var random = Math.random();
        var randomAroundZero = random - 0.5;
        this.emit('distance', random*50)
        this.emit('batteryVoltage', this.batteryVoltage + randomAroundZero);
        this.emit('batteryCurrent', this.batteryCurrent + randomAroundZero * 10);
        this.emit('batterySoc', this.batterySoc);
        this.emit('batteryTemp', this.batteryTemp + randomAroundZero);
        this.emit('motorRpm', this.motorRpm + randomAroundZero * 10);
        this.emit('motorTorque', this.motorTorque + randomAroundZero * 5);
        this.emit('motorTemp', this.motorTemp + randomAroundZero);
        this.emit('transGear', this.transGear);
        this.emit('transRatio', this.transRatio);
        this.emit('engineRpm', this.engineRpm + randomAroundZero * 20);
        this.emit('engineTorque', this.engineTorque + randomAroundZero * 7);
        this.emit('engineTemp', this.engineTemp + randomAroundZero);
        this.emit('vehicleAccel', this.vehicleAccel - random * 5);
        this.emit('vehicleBrake', this.vehicleBrake);
        this.emit('vehicleSpeed', this.vehicleSpeed + random * 2);
        this.emit('chargerVoltage', this.chargerVoltage);
        this.emit('chargerCurrent', this.chargerCurrent);
        this.emit('elevation', this.elevation);
        // this.emit('DieselEnergyChange' DieselEnergy(this.fuelConsumption))
        // this.emit('ElectricalEnergyChange', ElectricalEnergy(this.batteryVoltage, this.batteryCurrent))
        // this.emit('KinecticEnergyChange', KinecticEnergy(this.vehicleSpeed, x))
        // this.emit('PotentialEnergyChange', PotentialEnergy(this.elevation, this.prevElevation))
    }, this), 100);
};
util.inherits(TestCanEmitter, events.EventEmitter);

TestCanEmitter.prototype.getMail = function(address) {
    return this[address];
}

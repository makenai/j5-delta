var Deltabot = require('../index');
var five = require('johnny-five');
var mocks = require("mock-firmata");
var MockFirmata = mocks.Firmata;
var sinon = require('sinon');
var assert = require('chai').assert;

var board = new five.Board({
  io: new MockFirmata(),
  debug: false,
  repl: false
});

var deltabot = new Deltabot();

var servoWrite = sinon.spy(MockFirmata.prototype, "servoWrite");

deltabot.go(0,0,-160);

console.log( servoWrite.firstCall.args );
console.log( servoWrite.secondCall.args );
console.log( servoWrite.thirdCall.args );
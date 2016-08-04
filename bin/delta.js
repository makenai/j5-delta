#!/usr/bin/env node
var five = require("johnny-five");
var Deltabot = require("../index");

var board = new five.Board({
  debug: false
});

board.on("ready", function() {

  printHelp();

  var deltabot = new Deltabot({
    type: 'tapster'
  });

  this.repl.inject({
    home: function() {
      deltabot.home();
    },
    moveTo: function(x,y,z) {
      deltabot.moveTo([ x, y, z ]);
    },
    getPosition: function() {
      return deltabot.getPosition();
    },
    help: function() {
      printHelp();
    },
    tap: function(x,y) {
      deltabot.tap(x,y);
    }
  });

});

function printHelp() {
  console.log('');
  console.log('▲ Welcome to the Deltabot REPL! ▲');
  console.log('');
  console.log('Available commands:');
  console.log('');
  console.log('help() - this screen');
  console.log('home() - move to home position');
  console.log('moveTo(x,y,z) - move to the specified coordinates');
  console.log('getPosition() - calculate current end effector position');
  console.log('');
}
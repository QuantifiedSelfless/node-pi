var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {

  button1 = new five.Button({
    pin: 21
});
  button2 = new five.Button({
    pin: 22,
});
  button3 = new five.Button({
    pin: 23,
});


  button1.on("down", function(value) {
    console.log("SWITCH1-DOWN");
  });

//  button2.on("up", function(value) {
//   console.log("B2-UP");
//  });

  button3.on("down", function(value) {
    console.log("SWITCH2-Down");
  });

});

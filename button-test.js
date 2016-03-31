var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

var counter1 = 0;
var counter2 = 0;
var counter3 = 0;
var counter4 = 0;

board.on('ready', function() {

  button1 = new five.Button({
    pin: 12,
});
  button2 = new five.Button({
    pin: 3,
});
  button3 = new five.Button({
    pin: 2,
});
  button4 = new five.Button({
    pin: 0,
});


  button1.on("down", function(value) {
    console.log("Counter 1:\t%d",counter1);
    counter1 = counter1 + 1;
  });
  button2.on("down", function(value) {
    console.log("Counter 2:\t%d",counter2);
    counter2 = counter2 + 1;
  });
  button3.on("down", function(value) {
    console.log("Counter 3:\t%d",counter3);
    counter3 = counter3 + 1;
  });
  button4.on("down", function(value) {
    console.log("Counter 4:\t%d",counter4);
    counter4 = counter4 + 1;
  });

});

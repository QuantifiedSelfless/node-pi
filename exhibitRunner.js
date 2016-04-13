var express = require('express'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    five = require('johnny-five'),
    raspi = require('raspi-io');

var hid = require('hidstream')

//RFID PID finder vars
var devices = hid.devices();
var rfidDev = -7;
var vid = 65535;
var pid = 53;

rfidDev = devices.find(function (d) {
  return (d.vendorId == vid && d.productId == pid);
});

if(rfidDev != -7) {
  var RFID = new hid.device(rfidDev.path, { 'parser' : hid.parser.newline });
}
else { 
  console.log("Unable to find the RFID Reader :(");
}

server = http.createServer(app);
server.listen(3000);

var sockio = require('socket.io').listen(server);

board = new five.Board({
  io: new raspi()
});

board.on("ready", function() {
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

  sockio.sockets.on('connection', function (socket) {

    button1.on('down', function(){
      socket.emit('button1');
      console.log('button1 pressed');
    });

    button2.on('down', function(){
      socket.emit('button2');
      console.log('button2 pressed');
    });

    button3.on('down', function(){
      socket.emit('button3');
      console.log('button3 pressed');
    });

    button4.on('down', function(){
      socket.emit('button4');
      console.log('button4 pressed');
    });

    RFID.on("data", function (data) {
      socket.emit('rfid', {user_id : data });
    });

    // socket.on('pressed', function(){
    //   console.log('LED');
    //   led.on();
    });
  });

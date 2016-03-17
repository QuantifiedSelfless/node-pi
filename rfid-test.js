var hid = require('hidstream');

var devices = hid.devices();

var RFID = new hid.device(devices[0].path,{ 'parser' : hid.parser.newline });

RFID.on("data", function(data) {console.log(data) });

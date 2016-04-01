var hid = require('hidstream');

var devices = hid.devices();

var RFID = new hid.device(devices[0].path,{ 'parser' : hid.parser.keyboard });

RFID.on("data", function(data) {console.log(data) });

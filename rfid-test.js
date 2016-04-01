var hid = require('hidstream');

var devices = hid.devices();

var rfidDev = -7;

var vid = 65535;

var pid = 53;

var loginCount = 0;


// console.log(devices);
	
for (var i = devices.length - 1; i >= 0; i--) {
	if(devices[i].vendorId == vid && devices[i].productId == pid )
		rfidDev = i;
}
if(rfidDev != -7) {
//Debug Message
// console.log("Connecting to device:.....\n........\n.......\n...... ");
// console.log(devices[rfidDev]);

var RFID = new hid.device(devices[rfidDev].path,{ 'parser' : hid.parser.newline });

RFID.on("data", function(data) {
	loginCount++;
	console.log("New Login #%d",loginCount);
	console.log(data);
});

}
else { 
	console.log("Unable to find the RFID Reader :(");
}




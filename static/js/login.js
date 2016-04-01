var socket = io.connect('http://localhost:3000');
var buttons;
var needData;
var user_info = {"name": "Mike Skirpan"};

var player1 = null;
var player2 = null;
var player3 = null;
var player4 = null;

$.getJSON("static/data/exhibit.json", function (data) {
    console.log("got the exhibit!");
    console.log(data);
    $('#extitle').text(data.title);
    $('#exdetails').text(data.description);
    $('#explay').text(data.players);
    buttons = data.buttons;
    needData = data.data;
}).done(function (data) {
   console.log("all done");
   console.log(data);
}).fail( function () {
	console.log("shitty error!");
});

socket.on('rfid', function (data) {
    console.log(data.user_id);
    data.name = data.user_id;
    addCard(data.user_id);

})


socket.on('button1', function(){
    console.log("Button 1 Received!");
    // socket.emit('pressed');

});

socket.on('button2', function(){
    console.log("Button 2 Received!");
    // socket.emit('pressed');

});

socket.on('button3', function(){
    console.log("Button 3 Received!");
    // socket.emit('pressed');

});

socket.on('button4', function(){
    console.log("Button 4 Received!");
    // socket.emit('pressed');

});


function addCard(userinfo) {
    name = userinfo.name;
    elem = "<div class='card flex-auto'>\
                <header class='card-head'>\
                  <h3>" + name + "</h3>\
                </header>\
                <div class='conf flex flex-center'>\
                  <img src='/static/img/Yellow-Tree-logo.png'\
                  class='flex-auto' style='width: 5%'>\
                  <p class='flex-auto'>Connected</p>\
                </div>\
            </div>";
    $('#login').append(elem);
}

function badPlayer() {
    toastr.error('This user is unauthorized to use this companion. Please consider sharing more with DesignCraft for a better experience.', 'User Not Allowed', {positionClass: "toast-top-full-width"});
}



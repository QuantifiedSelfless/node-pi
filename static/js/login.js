var socket = io.connect('http://localhost:3000');
var buttons;
var needData;
var user_info = {"name": "Mike Skirpan"};
var numPlayers;
var startTimer;
var players = [];

var player1 = null;
var player2 = null;
var player3 = null;
var player4 = null;
var url = "http://localhost:7070?"
//Need to add per-exhibit route
var backendurl = "quantifiedselfbackend.local"

$.getJSON("static/data/exhibit.json", function (data) {
    console.log("got the exhibit!");
    console.log(data);
    $('#extitle').text(data.title);
    $('#exdetails').text(data.description);
    $('#explay').text(data.players);
    buttons = data.buttons;
    numPlayers = data.numPlay
    needData = data.data;
}).done(function (data) {
   console.log("all done");
   console.log(data);
}).fail( function () {
	console.log("shitty error!");
});

socket.on('rfid', function (data) {
    if (players.indexOf(data.user_id) != -1){
        toastr.error('You are already logged in to this DesignCraft Companion', {positionClass: "toast-top-full-width"});

    }
    if (players.length == numPlayers) {
        toastr.error('You are trying to sign in too many users to this companion. Wait your turn!', {positionClass: "toast-top-full-width"});
        return;
    }

    clearTimeout(startTimer);
    console.log(data.user_id);
    userid = data.user_id;
    // Will use below AJAX call when ready for live testing..

    // $.ajax({
    //     type: 'POST',
    //     url: backendurl,
    //     data: { "userid" : userid }, 
    //     success: function(resp) {
    //         addCard(resp.name);
    //         players.push(data.user_id);
    //         startTimer = setTimeout( runGame, 8000);
    //     },
    //     error: function(resp) {
    //         toastr.error('This user is unauthorized to use this companion. Please consider sharing more with DesignCraft for a better experience.', 'User Not Allowed', {positionClass: "toast-top-full-width"});
    //     }
    // });
    addCard(data);
    players.push(data.user_id);
    startTimer = setTimeout( runGame, 8000);

});

function runGame () {
    for (play in players){
        url += "userid=" + players[play] + "&";
    }
    window.location = url;
}


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
    name = userinfo.user_id;
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



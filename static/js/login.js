//Get Exhibit JSON
var numPlayers;
var redirectionTimer;
var backendurl = 'quantifiedselfbackend.local';
var startTimer;
var baseurl = "http://localhost:7070?";

$.getJSON("static/data/exhibit.json", function (data) {
    console.log("got the exhibit!");
    console.log(data);
    $('#extitle').text(data.title);
    $('#exdetails').text(data.description);
    $('#explay').text(data.players);
    redirectionTimer = data.timer;
    numPlayers = data.numPlay
    bakendurl = data.backendurl || backendurl;
}).done(function (data) {
   console.log("all done");
   console.log(data);
}).fail( function () {
    console.log("shitty error!");
});

function runGame () {

    if (numPlayers == 1) {
        baseurl += "userid=" + players[play];
    } else {
        for (play in players){
            baseurl += "userid" + play + "=" + players[play] + "&";
        }
    }
    window.location = url;
}

function badPlayer() {
    toastr.error('This user is unauthorized to use this companion. Please consider sharing more with DesignCraft for a better experience.', 'User Not Allowed', {positionClass: "toast-top-full-width"});
}

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

function make_AJAX_call(url, data, tryCount, retryLimit){

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        success: function(resp) {
            name = resp.name || "User";
            addCard(name);
            startTimer = setTimeout( runGame, 8000);
            return true;
        },
        error: function(resp) {
            if (resp.statusCode == 403) {
                badPlayer();
            }
            tryCount++;
            if (tryCount >= retryLimit){
                return "bad server";
            }
            else { //Try again with exponential backoff.
                setTimeout(function(){ 
                    return make_AJAX_call(data, transition, tryCount, retryLimit);
                }, Math.pow(2, tryCount) * 1000);
                return false;
            }
        }
    });
}

function getURLParams() {
 var re = /[?&]([^&=]+)(?:[&=])([^&=]+)/gim;
 var m;
 var v={};
 while ((m = re.exec(location.search)) != null) {
   if (m.index === re.lastIndex) {
     re.lastIndex++;
   }
   v[m[1]]=m[2];
 }
 return v;
};


var socket = io.connect('http://localhost:3000');
var players = [];

$(document).ready(function () {
    //After DOM mounts
    params = getURLParams();
    if (params['error']){
       toastr.error("Something went wrong on DesignCraft's servers. Please try again.", {positionClass: "toast-top-full-width"});
    }
    
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
        permission = make_AJAX_call(bakendurl, {"userid": userid}, 0, 3);
        addCard(data);
        players.push(data.user_id);

    });

});

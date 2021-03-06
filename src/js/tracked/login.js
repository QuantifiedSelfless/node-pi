//Get Exhibit JSON
var debug = false;
var userids = false;

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
    redirectionTimer = data.timer || 5000;
    numPlayers = data.numPlay
    backendurl = data.backendurl || backendurl;
    baseurl = data.baseurl || baseurl;
}).done(function (data) {
   console.log("all done");
   console.log(data);
}).fail( function () {
    console.log("shitty error!");
});

function runGame () {
    // Once we have Amelia's ID band, we'll need to add an exception in for her
    // Call runAmelia

    if (numPlayers == 1 && userids == true) {
        baseurl += "userid=" + players[0] + "&";
    } else if ( numPlayers == 1 && debug == false) {
        baseurl += "rfid=" + players[0] + "&";
    } else if ( numPlayers > 1 && userids == true) {
        for (play in players){
            baseurl += "userid" + play + "=" + players[play] + "&";
        }
    } else {
        for (play in players){
            baseurl += "rfid" + play + "=" + players[play] + "&";
        }
    }
        
    window.location = baseurl;
}

function runAmelia () {
    window.location = "http://localhost:5000/amelia";
}

function badPlayer() {
    toastr.error('This user is unauthorized to use this companion. Please consider sharing more with DesignCraft for a better experience.', 'User Not Allowed', {positionClass: "toast-top-full-width"});
}

function addCard(name) {
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
        success: function(resp) {
            console.log(resp);
            name = resp.data[0].name || "User";
            addCard(name);
            players.push(data.rfid);
            if (name == "Amelia Bloom"){
                startTimer = setTimeout( runAmelia, redirectionTimer);
            } else {
                startTimer = setTimeout( runGame, redirectionTimer);
            }
            return true;
        },
        error: function(resp) {
            if (resp.statusCode == 403) {
                badPlayer();
                return;
            }
            tryCount++;
            if (tryCount >= retryLimit){
                toastr.error("Something went wrong on DesignCraft's servers. Please try signing in again.", {positionClass: "toast-top-full-width"});
                return;
            }
            else { //Try again with exponential backoff.
                setTimeout(function(){ 
                    return make_AJAX_call(url, data, tryCount, retryLimit);
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
            toastr.error('You are trying to sign in too many users to this Companion. Wait your turn!', {positionClass: "toast-top-full-width"});
            return;
        }

        clearTimeout(startTimer);
        console.log(data.user_id);
        userid = data.user_id;
        if (debug == true && userids == false){
           addCard("Test Dude");
           setTimeout(runGame, redirectionTimer); 
        } else if (debug == true && userids == true) {
            //Need to hard code a userid for testing
            good_url = backendurl + "userid=" + userid;
            permission = make_AJAX_call(good_url, {"userid": userid}, 0, 3);
        } else {
            good_url = backendurl + "rfid=" + userid;
            permission = make_AJAX_call(good_url, {"rfid": userid}, 0, 3);
        }
    });

});
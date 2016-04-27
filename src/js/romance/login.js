//Get Exhibit JSON
var debug = false;
var userids = false;

var numPlayers;
var redirectionTimer;
var backendurl = 'quantifiedselfbackend.local';
var startTimer;
var baseurl = "http://romance.local:7070?";

$.getJSON("static/data/exhibit.json", function (data) {
    console.log("got the exhibit!");
    console.log(data);
    $('#extitle').text(data.title);
    $('#exdetails').text(data.description);
    $('#explay').text(data.players);
    redirectionTimer = data.timer || 5000;
    minPlayers = data.min_players || 2;
    maxPlayers = data.max_players || 2;
    backendurl = data.backendurl || backendurl;
    baseurl = data.baseurl || baseurl;
}).done(function (data) {
   console.log("all done");
   console.log(data);
}).fail( function () {
    console.log("shitty error!");
});

function runGame () {
        
    window.location = baseurl;
}

function badPlayer() {
    toastr.error('This user is unauthorized to use this companion. Please consider sharing more with DesignCraft for a better experience.', 'User Not Allowed', {positionClass: "toast-top-full-width"});
}

function addCard(name, rfid) {
  elem = "<div id='card-" + rfid.slice(0, -1) + "' class='card flex-auto'>\
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

function addWaitingCard() {

  var waiting_text = "Another Lover?";

  elem = "<div id='card-waiting' class='card flex-auto'>\
          <header class='card-head'>\
          <h3>" + waiting_text + "</h3>\
          </header>\
          <div class='conf flex flex-center'>\
          <img src='/static/img/Yellow-Tree-logo.png'\
          class='flex-auto' style='width: 5%'>\
          <p class='flex-auto'>Waiting</p>\
          </div>\
          </div>";
  $('#login').append(elem);
}

function removeWaitingCard() {
  $('#card-waiting').remove();
}

function removeCard(rfid) {
  $('#card-' + rfid.slice(0, -1)).remove();
}

function make_AJAX_call(url, data, tryCount, retryLimit){
    $.ajax({
        type: 'GET',
        url: url,
        success: function(resp) {
            console.log(resp);
            name = resp.data[0].name|| "User";
            removeWaitingCard();
            addCard(name, data.rfid);
            players.push(data.rfid);
            if (players.length == 2) {
                startTimer = setTimeout( runGame, redirectionTimer);
            } else if (players.length < 2) {
                addWaitingCard();
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

function removeUser(playerIndex, data) {
  $.ajax({
    type: 'GET',
    url: backendurl + 'rfid=' + data.user_id,
    success: function (response) {
      var name = response.data[0].name || "User";
      removeCard(data.user_id);
      players.splice(playerIndex, 1);
      if (players.length < minPlayers) {
        clearTimeout(startTimer);
      } else {
        startTimer = setTimeout(runGame, redirectionTimer);       
      }
      if (players.length == 0) {
        removeWaitingCard();
      }
    },
    error: function (err) {
      toastr.error("Something went wrong on DesignCraft's servers. You can no longer log out.", {positionClass: "toast-top-full-width"})
      console.error(err);
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


var socket = io.connect('http://romance.local:3000');
var players = [];

$(document).ready(function () {
    //After DOM mounts
    params = getURLParams();
    if (params['error']){
       toastr.error("Something went wrong on DesignCraft's servers. Please try again.", {positionClass: "toast-top-full-width"});
    }
    
    socket.on('rfid', function (data) {
        if ((index = players.indexOf(data.user_id)) != -1) {
          removeUser(index, data);
          //toastr.error('You are already logged in to this DesignCraft Companion', {positionClass: "toast-top-full-width"});
          return;
        }
        if (players.length == maxPlayers) {
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
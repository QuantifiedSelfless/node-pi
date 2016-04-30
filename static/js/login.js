//Get Exhibit JSON
var debug = false;
var userids = false;

var maxPlayers;
var minPlayers;
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
  minPlayers = data.min_players || 1;
  maxPlayers = data.max_players || 1;
  backendurl = data.backendurl || backendurl;
  baseurl = data.baseurl || baseurl;
  if (maxPlayers == -1) {
    runGame();
  }
}).done(function (data) {
  console.log("all done");
  console.log(data);
}).fail( function () {
  console.log("shitty error!");
});

function runGame () {
  var playerCount = players.length;
  if (playerCount == 1 && userids == true) {
    baseurl += "userid=" + players[0] + "&";
  } else if ( playerCount == 1 && debug == false) {
    baseurl += "rfid=" + players[0] + "&";
  } else if ( playerCount > 1 && userids == true) {
    for (play in players){
      baseurl += "userid" + play + "=" + players[play] + "&";
    }
  } else {
    for (play in players) {
      baseurl += "rfid" + play + "=" + players[play] + "&";
    }
  }

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

  var waiting_text = "Another Player?";
  if (players.length < maxPlayers && players.length >= minPlayers) {
    waiting_text = "Waiting " + (redirectionTimer/1000) + "seconds";
  }
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

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

function toggleHacker() {
    var haxor=$("#haxor");
    haxor.toggle(400, function(){
        if (haxor.css('display') == 'none') {
            clearInterval(haxortimer);
        } else {
            var terminal=$("#terminal");
            terminal.text('')
            haxortimer = setInterval(function() {
                var numChars = Math.round(Math.random() * 10) + 5;
                terminal.append(randomString(numChars) + " ");
                terminal.scrollTop(terminal.prop("scrollHeight"));
            }, 25);
        }
    })
}

function toggleEmail() {
    var haxor=$("#haxor");
    haxor.toggle(400, function(){
        if (haxor.css('display') == 'none') {
            clearInterval(haxortimer);
        } else {
            var terminal=$("#terminal");
            var emailIndex = 0;
            terminal.text('');
            haxortimer = setInterval(function() {
                if (emailIndex < emailText.length) {
                    var text = emailText.substring(emailIndex, emailIndex+5);
                    
                    terminal.append(text.replace(":", "<br/>"));
                    emailIndex += 5;
                } else {
                    clearInterval(haxortimer);
                    setTimeout(toggleEmail, 15000);
                }
            }, 100);
        }
    })
}

var haxortimer;
function make_AJAX_call(url, data, tryCount, retryLimit){
  $.ajax({
    type: 'GET',
    url: url,
    cache: false,
    timeout: 10000,
    success: function(resp) {
      if (resp.data[0].name == "email") {
        toggleEmail();
        badPlayer();
        return;
      }
      if (resp.data[0].name == "hacker") {
        toggleHacker();
        badPlayer();
        return;
      }
      if (!resp.data[0].permission) {
        badPlayer();
        return;
      }
      removeWaitingCard();
      name = resp.data[0].name|| "User";
      addCard(name, data.rfid);
      players.push(data.rfid);
      if (maxPlayers > 1){
        index = players.indexOf(data.rfid);
        setTimeout( function () {
          players.splice(index, 1);
          removeCard(data.rfid);
        }, 30000);
        if (players.length >= 1) {
          removeWaitingCard();
        }
      }
      if (players.length >= minPlayers) {
        startTimer = setTimeout(runGame, redirectionTimer);
      } 
      if (maxPlayers > 1 && players.length < maxPlayers){
        addWaitingCard();
      }
    },
    error: function(resp) {
      console.log(resp)
      if (resp.statusCode == 403) {
        badPlayer();
        return;
      }
      tryCount++;
      if (tryCount >= retryLimit){
        toastr.error("Something went wrong on DesignCraft's servers. Please try signing in again.", {positionClass: "toast-top-full-width"});
        if (players.length >= minPlayers) {
          startTimer = setTimeout(runGame, redirectionTimer);
        }
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
      if (minPlayers > 1 && players.length < maxPlayers) {
        removeWaitingCard();
        addWaitingCard();
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


var socket = io.connect('http://localhost:3000');
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
    if (debug == true && userids == false) {
      addCard("Test Dude", "000000");
      setTimeout(runGame, uedirectionTimer); 
    } else if (debug == true && userids == true) {
      //Need to hard code a userid for testing
      good_url = backendurl + "userid=" + userid;
      make_AJAX_call(good_url, {"userid": userid}, 0, 3);
    } else {
      good_url = backendurl + "rfid=" + userid;
      make_AJAX_call(good_url, {"rfid": userid}, 0, 3);
    }
  });

});

var emailText = "To our Gracious Shareholders,:I'm excited to say we've had another record-breaking year for our profits (and your dividends). As of this year, DesignCraft has placed companions in over one billion homes across the globe. We ARE the number one consumer technology company in the world.:With this update, I want to deliver exciting news. Our CIPbot project has been a great success. Amelia has been running for five years straight now and has increased productivity across our company. We anticipate being able to launch CIPbot as a DesignCraft product line within the next two years.:Currently, there are a small set of errors showing up on our CIPbot during the past couple of months. These are not major errors as Amelia is still working correctly; however, she has shown anti-social tendencies. I am writing you to assure you that I am making efforts to intervene at our next User Appreciation Night to understand the extent of these problems. If they are minor, then we are in the clear and can begin product development. If they are major, we will shut down the project and do a second round of tests over the coming year.:Either way, we should all be proud of what we accomplished. The Companion line is the most vital home technology suite the world has ever seen, and we see only pathways forward from here.:With great excitement for the coming year,:Donald DeClaire"

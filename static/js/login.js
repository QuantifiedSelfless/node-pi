var buttons;
var needData;
var user_info = {"name": "Mike Skirpan"};

$.getJSON("static/data/exhibit.json", function (data) {
    $('#extitle').text(data.title);
    $('#exdetails').text(data.description);
    $('#explay').text(data.players);
    buttons = data.buttons;
    needData = data.data;
})

setTimeout(function () {
    addCard(user_info);}, 6000);

function addCard(userinfo) {
    name = userinfo.name;
    elem = "<div class='card flex-auto'>\
                <header class='card-head'>\
                  <h3>" + name + "</h3>\
                </header>\
                <div class='conf flex flex-center'>\
                  <img src='/static/img/Yellow-Tree-Logo.png'\
                  class='flex-auto' style='width: 5%'>\
                  <p class='flex-auto'>Connected</p>\
                </div>\
            </div>";
    $('#login').append(elem);

}
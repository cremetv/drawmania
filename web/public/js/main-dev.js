"use strict";

/*! @license
* Drawmania
* Discord Bot Web Interface
* © 2019 Marcel Hauser (https://ice-creme.de)
*/
//@prepros-append pages/index.js


// Console Badge =)
$(function () {
  var t = navigator.userAgent.toLowerCase();
  if (/(chrome|firefox|safari)/.test(t.toLowerCase())) {
    var e = ["padding: 20px 5px 16px", "background-color: #36393E", "color: #f2641c"].join(";");
    var i = ["padding: 20px 5px 16px", "background-color: #f2641c", "color: #ffffff"].join(";"),
        n = ["background-color: transparent"].join(";");
    console.log("\n\n %c Crafted with ♥︎ by Ice Creme %c https://ice-creme.de/ %c \n\n\n", e, i, n);
  } else {
    window.console && console.log("Crafted with love by Ice Creme - https://ice-creme.de/");
  }
});

var socket = io();

// on select server get channels
$('#serverId').on('change', function (e) {
  var serverId = $('#serverId').val();
  console.log(serverId);

  var post_data = {
    'serverId': serverId.toString()
  };
  $.ajax({
    crossDomain: true,
    method: 'POST',
    url: '/getServer',
    async: true,
    data: post_data,
    error: function error(e) {
      console.error(e);
    }
  }).done(function (data) {
    // console.log(data);
    $('#channelId option').remove();
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].id);
      $('#channelId').append("<option value=\"" + data[i].id + "\">" + data[i].name + "</option>");
    }
  });
});

// send message
$('.send-btn').on('click', function (e) {
  e.preventDefault();

  socket.emit('chat message', { message: $('#input').val(), serverId: $('#serverId').val(), channelId: $('#channelId').val() });
  // channelId
  $('#m').val('');
  return false;
});

// testing
socket.on('some event', function () {
  console.log('asd');
});

socket.on('discord message', function (msg) {
  console.log('message sent in discord!!');
  console.log("message: " + msg);
  $('#chat').append();
});
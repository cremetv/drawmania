"use strict";

/*! @license
* Drawmania
* Discord Bot Web Interface
* © 2019 Marcel Hauser (https://ice-creme.de)
*/
//@prepros-append pages/index.js


// scroll messages
var chat = $('#chat');
var scrollMessages = function scrollMessages() {
  var scrollHeight = chat[0].scrollHeight;
  TweenLite.to(chat, 2, {
    scrollTo: scrollHeight,
    ease: Power2.easeOut
  });
};

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

// emoji box
var emojiOpen = false;
$('.emoji-btn').on('click', toggleEmojiBox);
$('.emoji-list li').on('click', function () {
  // add emoji to input
  toggleEmojiBox();
});

function toggleEmojiBox() {
  if (emojiOpen) {
    $('.emoji-box').removeClass('open');
    emojiOpen = false;
  } else {
    $('.emoji-box').addClass('open');
    emojiOpen = true;
  }
}

var getChannels = function getChannels(serverId) {
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
      $('#channelId').append("<option value=\"" + data[i].id + "\">" + data[i].name + "</option>");
    }
  });
};

// add active to first server in menu
$('.server-list .server').first().parent('li').addClass('active');

// on select server get channels
$('#serverId').on('change', function (e) {
  var serverId = $('#serverId').val();
  getChannels(serverId);
});

$('.server').on('click', function (e) {
  e.preventDefault();

  $('.server').parent('li').removeClass('active');
  $(this).parent('li').addClass('active');

  var serverId = $(this).attr('data-server');
  $('#serverId').val(serverId);
  $('.server-name').html($(this).attr('data-servername'));
  getChannels(serverId);
});

// send message
$('.send-btn').on('click', function (e) {
  e.preventDefault();
  sendMessage();
});

$('#input').on('keyup', function (e) {
  var key = e.which;

  if (key === 13) {
    sendMessage();
  }
});

function sendMessage() {
  if ($('#input').val() == '') return;
  socket.emit('chat message', { message: $('#input').val(), serverId: $('#serverId').val(), channelId: $('#channelId').val() });
  var message = "\n  <div class=\"message\">\n    <div class=\"message__details\">sent to --> <span class=\"message__channel\">" + $('#serverId option:selected').text() + " : " + $('#channelId option:selected').text() + "</span></div>\n    <div class=\"message__text\">\n      " + $('#input').val() + "\n    </div>\n  </div>\n  ";
  $('#chat').append(message);
  // channelId
  $('#input').val('');
  scrollMessages();
  return false;
}

socket.on('status update', function (data) {
  if (data.status === 'offline') {
    $('.logo').removeClass('online').addClass('offline');
  } else if (data.status === 'online') {
    $('.logo').removeClass('offline').addClass('online');
  }
});

// testing
socket.on('some event', function () {
  // console.log('asd');
});

socket.on('discord message', function (data) {
  var message = "\n  <div class=\"message\">\n    <div class=\"message__details\"><span class=\"message__author\">" + data.author + "<span> @ <span class=\"message__channel--receive\">" + data.server + " : " + data.channel + "</span></div>\n    <div class=\"message__text\">\n      " + data.message + "\n    </div>\n  </div>\n  ";
  $('#chat').append(message);
  scrollMessages();
});
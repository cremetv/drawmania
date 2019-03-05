var socket = io();

// emoji box
var emojiOpen = false;
$('.emoji-btn').on('click', toggleEmojiBox);
$('.emoji-list li').on('click', function() {
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

const getChannels = (serverId) => {
  let post_data = {
    'serverId': serverId.toString()
  }
  $.ajax({
    crossDomain: true,
    method: 'POST',
    url: '/getServer',
    async: true,
    data: post_data,
    error: (e) => {
      console.error(e);
    }
  }).done((data) => {
    // console.log(data);
    $('#channelId option').remove();
    for (var i = 0; i < data.length; i++) {
      $('#channelId').append(`<option value="${data[i].id}">${data[i].name}</option>`);
    }
  });
}

// add active to first server in menu
$('.server-list .server').first().parent('li').addClass('active');

// on select server get channels
$('#serverId').on('change', function(e) {
  let serverId = $('#serverId').val();
  getChannels(serverId);
});

$('.server').on('click', function(e) {
  e.preventDefault();

  $('.server').parent('li').removeClass('active');
  $(this).parent('li').addClass('active');

  let serverId = $(this).attr('data-server');
  $('#serverId').val(serverId);
  $('.server-name').html($(this).attr('data-servername'));
  getChannels(serverId);
});

// send message
$('.send-btn').on('click', function(e) {
  e.preventDefault();
  sendMessage();
});

$('#input').on('keyup', function(e) {
  var key = e.which;

  if(key === 13) {
    sendMessage();
  }
});

function sendMessage() {
  if ($('#input').val() == '') return;
  socket.emit('chat message', {message: $('#input').val(), serverId: $('#serverId').val(), channelId: $('#channelId').val()});
  let message = `
  <div class="message">
    <div class="message__details">sent to --> <span class="message__channel">${$('#serverId option:selected').text()} : ${$('#channelId option:selected').text()}</span></div>
    <div class="message__text">
      ${$('#input').val()}
    </div>
  </div>
  `;
  $('#chat').append(message);
  // channelId
  $('#input').val('');
  scrollMessages();
  return false;
}

socket.on('status update', (data) => {
  if (data.status === 'offline') {
    $('.logo').removeClass('online').addClass('offline');
  } else if (data.status === 'online') {
    $('.logo').removeClass('offline').addClass('online');
  }
});

// testing
socket.on('some event', () => {
  // console.log('asd');
});

socket.on('discord message', (data) => {
  let message = `
  <div class="message">
    <div class="message__details"><span class="message__author">${data.author}<span> @ <span class="message__channel--receive">${data.server} : ${data.channel}</span></div>
    <div class="message__text">
      ${data.message}
    </div>
  </div>
  `;
  $('#chat').append(message);
  scrollMessages();
});

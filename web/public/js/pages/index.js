var socket = io();

// on select server get channels
$('#serverId').on('change', function(e) {
  let serverId = $('#serverId').val();
  console.log(serverId);

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
      console.log(data[i].id);
      $('#channelId').append(`<option value="${data[i].id}">${data[i].name}</option>`);
    }
  });
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
  return false;
}



// testing
socket.on('some event', () => {
  console.log('asd');
});

socket.on('discord message', (msg) => {
  console.log('message sent in discord!!');
  console.log(`message: ${msg}`);
  $('#chat').append()
});

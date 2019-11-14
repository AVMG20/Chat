var socket = io();
var username = "NaN";
var random = Math.floor(Math.random() * 8);
switch (random) {
	case 1:
		color = "primary";
		break;
	case 2:
		color = "success";
		break;
	case 3:
		color = "info";
		break;
	case 4:
		color = "warning";
		break;
	case 5:
		color = "danger";
		break;
	case 6:
		color = "blue";
		break;
	case 7:
		color = "pink";
		break;
	default:
		"light";
		break;
}

while (username.length < 4) {
	var username = prompt("Gebruikersnaam:\nMinimaal 4 characters ");
}

var newuser = {
	username,
	color
}
socket.emit("new-user", newuser)


// SENDING MESSAGES
$("#send-message-form").on('submit', function () {
	var message = $("#input-message").val();
	$("#input-message").val('');

	// send message
	data = {
		username,
		color,
		message
	}
	// self
	$("#chat").append(`<div class="card-box col-10 mb-0 offset-2 text-right p-2">
	<h4 class="text-${color} rounded p-0 m-0"><b>${username}</b></h4>
	<span>${message}</span>
  </div>`);
	$('#chat-card').scrollTop($('#chat-card')[0].scrollHeight);

	// socket
	socket.emit('send-chat-message', data)
	return false;
});



// listen to connections
socket.on("user-connected", users => {
	$("#list").html('')
	users.forEach(user => {
		$("#list").append(`<div class="col-12 mb-1">
		<span class="border-bottom text-${user.color}"><small><i class="fe-chrome text-success"></i></small> ${user.username}</span>
		</div>`)
	});
});
socket.on("user-disconnected", users => {
	$("#list").html('')
	users.forEach(user => {
		$("#list").append(`<div class="col-12 mb-1">
		<span class="border-bottom text-${user.color}"><small><i class="fe-chrome text-success"></i></small> ${user.username}</span>
		</div>`)
	});
});

// listen to messages
socket.on('message', data => {
	$("#chat").append(`<div class="card-box col-10 mb-0 text-left p-2">
	<h4 class="text-${data.color} rounded p-0 m-0"><b>${data.username}</b></h4>
	<span>${data.message}</span>
  </div>`);
	$('#chat-card').scrollTop($('#chat-card')[0].scrollHeight);
});
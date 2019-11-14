const express = require("express");
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session');
const socketIO = require('socket.io')
const app = express();

// ramons (scuft error) handeling
app.on('error', function (err) {
	console.error('on error handler');
	console.error(err);
});
app.on('clientError', function (err) {
	console.error('on clientError handler');
	console.error(err);
});
process.on('uncaughtException', function (err) {
	console.error('process.on handler');
	console.error(err);
});

// bodyparser
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())

// session
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
}))


// ejs
app.use(expressLayouts)
app.set('view engine', 'ejs')

// publics
app.use(express.static(path.join(__dirname, '/public')));

// routes
app.use("/", require("./routes/routes"));

const port = process.env.PORT || 3000
var server = app.listen(port, () => {
	console.log(`Server started on ${port}`);
});

// socket
let io = socketIO(server)
let users = []
io.on('connection', socket => {

	// user join
	socket.on('new-user', user => {
		let id = socket.id
		let username = user.username
		let color = user.color
		users.push({
			id,
			username,
			color
		})
		io.emit('user-connected', users)
		console.log(`User joined: ${user.username}`);
	});

	// user leave
	socket.on('disconnect', () => {
		var i = 0;
		users.forEach(user => {
			if (user.id == socket.id) {
				users.splice(i, 1)
			} else {
				i++;
			}
		});
		socket.broadcast.emit('user-disconnected', users)
	});

	// messages
	socket.on("send-chat-message", message => {
		socket.broadcast.emit("message", message)
	})

});
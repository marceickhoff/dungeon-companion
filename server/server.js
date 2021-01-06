const Socket = require('./util/Socket');
const Player = require('./models/Player');

Socket.listen().then(io => {
	io.on('connection', function(socket) {
		new Player(socket);
	});
});
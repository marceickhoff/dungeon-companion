const Socket = require('./util/Socket');

Socket.listen().then(io => {
	io.on('connection', function(socket) {
		// TODO
	});
});
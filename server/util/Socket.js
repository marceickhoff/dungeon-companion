const fs = require('fs');
const config = require('../../config.json');

/**
 * Handles websocket connections.
 */
class Socket {

	/**
	 * The socket.io server instance.
	 * @type {Server}
	 */
	static io;

	/**
	 * Starts the socket server.
	 */
	static listen() {
		return new Promise((resolve => {
			let http = Socket.createServer();
			Socket.io = require('socket.io')(http, {
				cors: true
			});
			http.listen(config.port);
			http.on('listening', function() {
				console.log('Server listening on port ' + config.port);
				resolve(Socket.io);
			});
		}));
	}

	/**
	 * Creates and returns a HTTP(S) server instance.
	 *
	 * @return {Server}
	 */
	static createServer() {
		if (config.hasOwnProperty('ssl')) {
			return require('https').createServer({
				key: fs.readFileSync(config.ssl.key),
				cert: fs.readFileSync(config.ssl.cert),
			});
		}
		return require('http').createServer();
	}
}

module.exports = Socket;
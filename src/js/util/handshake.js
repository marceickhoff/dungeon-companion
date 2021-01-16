export default {

	/**
	 * Creates a query string containing the locally stored player data for the Socket.io handshake.
	 */
	query: function() {
		let query = window.location.search ? window.location.search.substring(1) : '';
		['uuid', 'name', 'level', 'bonus', 'mod', 'latestParty'].forEach(property => {
			let value = localStorage.getItem(property);
			if (value !== null && typeof value !== 'undefined') query += '&' + property + '=' + value;
		});
		if (query.substring(0, 1) === '&') query = '?' + query.substring(1);
		return query;
	}
}
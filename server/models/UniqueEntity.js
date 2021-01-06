const uuid = require('uuid');

/**
 * Represents an entity with a UUID.
 * @abstract
 */
class UniqueEntity {

	/**
	 * The UUID of this entity.
	 * @type {String}
	 */
	uuid;

	/**
	 * Creates a new entity and assigns a UUID.
	 */
	constructor() {
		this.uuid = uuid.v4();
	}
}

module.exports = UniqueEntity;
/*this object are not ment to be used directly in server-user
communication, but they are made to be used inside */

import {
	BaseTypes,
	GameObject
} from 'lance-gg';



class KeyArrayParameter extends GameObject {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);

		this.key = '';

		this.propertyList = '';

	}

	setValue (key, list) {
		this.key = key;
		this.propertyList = list;
	}

	syncTo(other) {
		super.syncTo(other);

		this.key = other.key;

		this.propertyList = other.propertyList;
	}

	static get netScheme() {
		return Object.assign(
			{
				key: {type: BaseTypes.TYPES.STRING},
				propertyList: {
					type: BaseTypes.TYPES.LIST,
					itemType: BaseTypes.TYPES.STRING
				}
			},
			super.netScheme
		);
	}
}

class KeyPropertyParameter extends GameObject {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);

		this.key = '';
		// this.type = 'string';
		this.property = '';
	}

	setValue (key, property) {
		this.key = key;
		this.property = property;
	}

	syncTo (other) {
		super.syncTo(other);

		this.key = other.key;
		this.property = other.property;
	}


	static get netScheme() {
		return Object.assign(
			{
				key: {type: BaseTypes.TYPES.STRING},
				property: {type: BaseTypes.TYPES.STRING}
			},
			super.netScheme
		)
	}
}

export {KeyArrayParameter, KeyPropertyParameter};

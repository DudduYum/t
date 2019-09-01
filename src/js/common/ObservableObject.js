// import {DynamicObject} from 'lance/client-module/lance-gg';
// import DynamicObject from 'lance/serialize/DynamicObject';
import {PhysicalObject3D, BaseTypes} from 'lance-gg';


// var DynamicObject = require('lance/server/lance-gg').DynamicObject;

export default class ObservableObject extends PhysicalObject3D {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);
		this.last = '';
	}

	static get netScheme () {
		return Object.assign(
			{
				last: {type: BaseTypes.TYPES.STRING}
			},
			super.netScheme
		);
	}

	onAddToWorld(gameEngine) {
		this.gameEngine = gameEngine;

		this.physicsObj = gameEngine.physicsEngine.addBox(1, 1, 2.9, 2, 0.01);

		this.physicsObj.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		);
	}

	syncTo (other) {
		super.syncTo(other);

		this.last = other.last;
		// this.configurations = other.configurations;
	}
}

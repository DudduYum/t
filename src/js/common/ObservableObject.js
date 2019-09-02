// import {DynamicObject} from 'lance/client-module/lance-gg';
// import DynamicObject from 'lance/serialize/DynamicObject';
import {PhysicalObject3D, BaseTypes} from 'lance-gg';


// var DynamicObject = require('lance/server/lance-gg').DynamicObject;

export default class ObservableObject extends PhysicalObject3D {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);

		this.randomNumber = Math.random();
		// this.configuration = {};
	}

	static get netScheme () {
		return Object.assign(
			{
				randomNumber: {type: BaseTypes.TYPES.INT8}
			},
			super.netScheme
		);
	}

	onAddToWorld(gameEngine) {
		this.gameEngine = gameEngine;
		console.log('tring to add object');
		this.physicsObj = gameEngine.physicsEngine.addBox(1, 1, 2.9, 2, 0.01);


		this.physicsObj.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		);

		this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
		if (this.scene) {
			let el = this.renderEl = document.createElement('a-sphere');
			let p = this.position;
			el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
			el.setAttribute('geometry', `primitive: sphere; radius: ${5}; segmentsWidth: 32; segmentsHeight: 16`);

		}
	}

	syncTo (other) {
		super.syncTo(other);
		this.configuration = Object.assign(
			{},
			other.configuration
		);
		// this.configurations = other.configurations;
	}
}

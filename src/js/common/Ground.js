// import {DynamicObject} from 'lance/client-module/lance-gg';
// import DynamicObject from 'lance/serialize/DynamicObject';
import {PhysicalObject3D, BaseTypes} from 'lance-gg';
global.$ = require('jquery');


// var DynamicObject = require('lance/server/lance-gg').DynamicObject;

export default class Ground extends PhysicalObject3D {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);

		this.sizeX = 10000;
		this.sizeY = 10000;

	}

	static get netScheme () {
		return Object.assign(
			{
				sizeX: {type: BaseTypes.TYPES.FLOAT32},
				sizeY: {type: BaseTypes.TYPES.FLOAT32}
			},
			super.netScheme
		);
	}

	onAddToWorld(gameEngine) {
		this.gameEngine = gameEngine;

		this.physicsObj = gameEngine.physicsEngine.addBox(
			this.sizeX, //x
			this.sizeY, //y
			0.001, // z
			0, // mass
			0.1
		);

		this.physicsObj.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		);

		let q = this.quaternion;
		// console.warn(this.physicsObj.quaternion);
		this.physicsObj.quaternion.set(q.x, q.y ,q.z, q.w);

		let scene = gameEngine.renderer ? gameEngine.renderer.scene : null;

		if (scene) {
			let el = this.renderEl = document.createElement('a-entity');
			scene.appendChild(el);


			el.setAttribute('color', 'green');
			el.setAttribute(
				'geometry',
				{
					primitive: 'plane',
					height: this.sizeX,
					width: this.sizeY
				}
			);
			el.setAttribute('rotation', '60 20 70');
		}
	}

	delateObjectFromScene () {
		if (this.scene) {
			console.log('deleting an object from 3D scene');
		}
	}

	syncTo (other) {
		super.syncTo(other);
	}

	destroy() {
			this.gameEngine.physicsEngine.removeBody(this.physicsObj);
	}
}

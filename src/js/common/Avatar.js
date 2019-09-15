import {PhysicalObject3D, BaseTypes} from 'lance-gg';

export default class Avatar extends PhysicalObject3D {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);
		this.height = 175;
	}

	static get netScheme () {
		return Object.assign(
			{
				height: {type: BaseTypes.TYPES.INT8}
			},
			super.netScheme
		);
	}

	onAddToWorld(gameEngine) {
		this.gameEngine = gameEngine;
		this.physicsObj = gameEngine.physicsEngine.addCylinder(
			this.height/5,
			this.height/5,
			this.height,
			4,
			0
		);

		// console.warn(this.physicsObj);

		this.physicsObj.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		);

		// console.warn('test');
		// console.warn(this);

		this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
		if (this.scene) {

			let el = this.renderEl = document.createElement('a-entity');
			// el.setAttribute(
			// 	'position',
			// 	`${this.physicsObj.position.x} ${this.physicsObj.position.y} ${this.physicsObj.position.z}`
			// );


			el.setAttribute('color', `red`);
			el.setAttribute(
				'geometry',
				{
					primitive: 'cylinder',
					height: 0.180,
					radius: 0.180/6
				}
			);

			el.setAttribute('game-object-id', this.id);
			this.scene.appendChild(el);
		}
	}

	delateObjectFromScene () {
		if (this.scene) {
			console.log('deleting an object from 3D scene');
		}
	}

	syncTo (other) {
		super.syncTo(other);
		// non so se effetivamente serve
		this.height = Object.assign(
			{},
			other.height
		);

		if (this.scene) {
			let list = document.querySelectorAll('a-entity').forEach(
				(el) => {
					el.hasAttribute('position', `${other.position.x} ${other.position.y} ${other.position.z}`);
				}
			);


		}
		// this.configurations = other.configurations;
	}
}

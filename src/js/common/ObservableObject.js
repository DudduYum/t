// import {DynamicObject} from 'lance/client-module/lance-gg';
// import DynamicObject from 'lance/serialize/DynamicObject';
import {
	PhysicalObject3D,
	ThreeVector,
	BaseTypes
} from 'lance-gg';


// var DynamicObject = require('lance/server/lance-gg').DynamicObject;

export default class ObservableObject extends PhysicalObject3D {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);
		this.size = new ThreeVector();
		if (props) {

			if (props.size) {
				this.size.set(
					props.size.x,
					props.size.y,
					props.size.z
				);
			}

			if (props.position) {
				this.position.set(
					props.position.x,
					props.position.y,
					props.position.z
				)
			}
		}
	}

	syncTo (other) {
		super.syncTo(other);

		this.size.x = other.size.x;
		this.size.x = other.size.y;
		this.size.x = other.size.z;
	}


	static get netScheme () {
		return Object.assign(
			{
				size: {type: BaseTypes.TYPES.CLASSINSTANCE}
			},
			super.netScheme
		);
	}

	changeModel (newModel) {

	}

	onAddToWorld(gameEngine) {
		this.gameEngine = gameEngine;

		this.physicsObj = gameEngine.physicsEngine.addBox(
			this.size.x,
			this.size.y,
			this.size.z,
			10,
			9
		);

		this.changeModel('use a method');

		console.warn(this.physicsObj);

		this.physicsObj.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		);

		this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
		if (this.scene) {

			let el = this.renderEl = document.createElement('a-entity');

			el.setAttribute(
				'geometry',
				{
					primitive: 'box'
				}
			);


			// el.setAttribute('scale', `${} ${} ${}`);

			// el.setAttribute('game-object-id', this.id);
			this.scene.appendChild(el);
		}
	}

	delateObjectFromScene () {
		if (this.scene) {
			console.log('deleting an object from 3D scene');
		}
	}

}

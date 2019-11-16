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

		this.title = 'cube';

		this.url = 'models/testingcube.glb';

		this.description = 'It\'s a test cube';

		this.groups = [];

		this.size = new ThreeVector(0, 0, 0);
		this.weight = 0;

		if (props) {
			if (props.weight) {
				this.weight = props.weight;
			}

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
		// console.warn(this.size);
	}

	static get netScheme () {
		return Object.assign(
			{
				size: {type: BaseTypes.TYPES.CLASSINSTANCE},
				weight: {type: BaseTypes.TYPES.FLOAT32},
				title: { type: BaseTypes.TYPES.STRING },
				description: { type: BaseTypes.TYPES.STRING },
				url: { type: BaseTypes.TYPES.STRING },
				groups: {
					type: BaseTypes.TYPES.LIST,
					itemType: BaseTypes.TYPES.STRING
				}
			},
			super.netScheme
		);
	}

	syncTo (other) {
		super.syncTo(other);

		this.size.x = other.size.x;
		this.size.y = other.size.y;
		this.size.z = other.size.z;

		this.weight = other.weight;
	}



	changeModel (newModel) {

	}

	onAddToWorld(gameEngine) {
		this.gameEngine = gameEngine;

		this.physicsObj = gameEngine.physicsEngine.addBox(
			this.size.x,
			this.size.y,
			this.size.z,
			this.weight? this.weight : 0,
			9
		);

		this.changeModel('use a method');

		// console.warn(this.physicsObj);

		this.physicsObj.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		);


    // client side rendering
		this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
		if (this.scene) {

			let el = this.renderEl = document.createElement('a-entity');

			console.log(this);
			// debugger;

			el.setAttribute(
				'gltf-model',
				`url(${this.url})`
			);

			el.setAttribute(
				'configurable-asset',
				''
			);

			el.setAttribute(
				'testcomponent',
				''
			);

			el.setAttribute(
				'gui-interactable',
				''
			);

			el.setAttribute(
				'scale',
				`${this.size.x} ${this.size.y} ${this.size.z}`
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

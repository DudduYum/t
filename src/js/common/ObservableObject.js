// import {DynamicObject} from 'lance/client-module/lance-gg';
// import DynamicObject from 'lance/serialize/DynamicObject';
import {
	PhysicalObject3D,
	ThreeVector,
	BaseTypes
} from 'lance-gg';

import {
	KeyArrayParameter,
	KeyPropertyParameter
} from './configurationParameter.js';


// var DynamicObject = require('lance/server/lance-gg').DynamicObject;

export default class ObservableObject extends PhysicalObject3D {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);

		if (options && options.isOnServerSide) {

			this.modelID = props.modelID;

			this.configuration = props.configuration;
			// this.configuration = [];


			console.log('X');
		} else {
			console.log('O');
			this.modelID = '';

			this.configuration = [];
		}


		this.title = 'cube';

		this.url = 'models/testingcube.glb';

		this.description = 'It\'s a test cube';

		this.groups = [];

		this.configurationKeys = [];
		this.configurationValues = [];

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

	setModel (modelID) {
		this.model
	}

	static get netScheme () {
		return Object.assign(
			{
        // definitive

				size: {type: BaseTypes.TYPES.CLASSINSTANCE},
				url: { type: BaseTypes.TYPES.STRING },
				modelID: { type: BaseTypes.TYPES.STRING },

				configuration: {
					type: BaseTypes.TYPES.LIST,
					itemType: BaseTypes.TYPES.CLASSINSTANCE
				}
				// ,
				// coins: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.UINT8
				// },
        // NOTE: Is there the way to get more of these types or it's not
        // a good idea
				// configurationKeys: {
				// 	type: BaseTypes.TYPES.LIST,
        //   // NOTE: It's important to set also itemType for LIST type
				// 	itemType: BaseTypes.TYPES.STRING
				// },
				// configurationValues: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.STRING
				// },

				// not definitive
				// title: { type: BaseTypes.TYPES.STRING },
				// weight: {type: BaseTypes.TYPES.FLOAT32},
				// description: { type: BaseTypes.TYPES.STRING },

				// groups: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.STRING
				// }
			},
			super.netScheme
		);
	}

	syncTo (other) {
		super.syncTo(other);

		this.size.x = other.size.x;
		this.size.y = other.size.y;
		this.size.z = other.size.z;

		this.url = other.url;
		this.modelID = other.modelID;
		this.configuration = other.configuration;

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


			console.log(this.configuration);
			// debugger;

			// el.setAttribute(
			// 	'gltf-model',
			// 	`url(${this.url})`
			// );
			let conf = this.configuration.reduce(
				(previous, current) => {
					previous[current.key] = current.property;
					return previous;
				},
				{}
			);
			el.setAttribute(
				'configurator',
				`url:models/testingcube.glb;model:testingcube;id:${this.id};configuration:${JSON.stringify(conf)}`
			);

			el.setAttribute(
				'configurator-ui-manager',
				''
			);

			el.setAttribute(
				'gui-interactable',
				''
			);

      // it's ok use scale, but I think configurator should do this
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

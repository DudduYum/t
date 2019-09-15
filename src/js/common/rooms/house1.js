import ObservableObject from '../ObservableObject';
import { BaseTypes, ThreeVector} from 'lance-gg';


export default class House extends ObservableObject{

	constructor(gameEngine, options, props) {
		super(gameEngine, options, props);

		this.size = {};
		this.model = null;

		if (props) {
			if (props.model) {
				this.model = null;
			}

			if (props.size) {
				this.size = new ThreeVector(
					props.size.x,
					props.size.y,
					props.size.z
				);
			}
		}

		if (props && props.model) {
			this.model = props.model;
		}
	}

	static get netScheme () {
		return Object.assign(
			{
				size: {type: 'CLASSINSTANCE'},
				model: {type: 'STRING'}
			},
			super.netScheme
		);
	}

	syncTo (other) {
		super.syncTo(other);
		if (other && this) {
			this.size = other.size;
			this.model = other.model;
		}
	}

	onAddToWorld(gameEngine) {
		this.gameEngine = gameEngine;

		this.physicsObj = gameEngine.physicsEngine.addBox(
			this.size.x,
			this.size.y,
			this.size.z,
			0,
			0.9
		);

		this.physicsObj.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		);


		this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
		if (this.scene) {
			let modelAsset = document.createElement('a-asset-item');

			this.asset = modelAsset;

			modelAsset.setAttribute('id', 'houseModel');
			modelAsset.setAttribute('src', 'models/houses/house1.gltf')

			this.scene.appendChild(modelAsset);

			this.el = document.createElement('a-entity');

			this.el.setAttribute('gltf-model', '#houseModel');
			this.el.setAttribute('scale', '0.1 0.1 0.1')

			this.scene.appendChild(this.el);



			// el.setAttribute('color', `red`);
			// el.setAttribute(
			// 	'geometry',
			// 	{
			// 		primitive: 'box'
			// 	}
			// );
			// el.setAttribute('scale', `${} ${} ${}`);

			// el.setAttribute('game-object-id', this.id);
		}
	}

	delateObjectFromScene () {
		if (this.scene) {
			console.log('deleting an object from 3D scene');
		}
	}
}

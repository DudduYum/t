import {PhysicalObject3D, ThreeVector, Quaternion, BaseTypes} from 'lance-gg';

// import {CustomController} from '../client/controlls/Controlls';

// let CANNON = null;

export default class Avatar extends PhysicalObject3D {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);

		// step user
		this.step = 0.25;
		this.stepfraction = 5;

		// CANNON = this.gameEngine.physicsEngine;
		// state

		this.movement = new ThreeVector(0, 0, 0);

		this.slowfactor = 1.2;

		this.direction = new ThreeVector(0, 0, -1);

		if (props) {
			if (props.height) {
				this.height = props.height;
			} else {
				this.height = 1.6;
			}
		}
	}

	static getCamera () {
		let camera = document.querySelector('#cameraRig');
		// document.querySelectorAll('a-entity').forEach(
		// 	(el, index) => {
		// 		if (el.hasAttribute('camera')) {
		// 			camera = el;
		// 		}
		// 	}
		// );

		return camera;
	}

	static get netScheme () {
		return Object.assign(
			{
				height: {type: BaseTypes.TYPES.FLOAT32},
				movement: {type: BaseTypes.TYPES.CLASSINSTANCE},
				direction: {type: BaseTypes.TYPES.CLASSINSTANCE}
			},
			super.netScheme
		);
	}

	syncTo (other) {
		super.syncTo( other );

		this.direction.set(
			other.direction.x,
			0,
			other.direction.z
		);

		// this.movement.set(
		// 	other.movement.x,
		// 	other.movement.y,
		// 	other.movement.z
		// );

		this.height = other.height;

		let camera = Avatar.getCamera();

		camera.setAttribute(
			'position',
			`${this.position.x} ${this.height} ${this.position.z}`
		);
	}

	assignCamera (camera) {
		camera.setAttribute(
			'position',
			`${this.physicsObj.x} ${this.height} ${this.physicsObj.z}`
		);



		let newOrientation = this.physicsObj.quaternion.vmult(new ThreeVector(0, 0, 0));

		console.log(newOrientation);
		camera.setAttribute(
			'rotation',
			`${newOrientation.x} ${newOrientation.y} ${newOrientation.z}`
		);


	}

	move (movement) {
		let q = new this.gameEngine.CANNON.Quaternion();
		let camera = Avatar.getCamera();
		let mov = new this.gameEngine.CANNON.Vec3(
			movement.x,
			movement.y,
			movement.z
		);

		let cameraRotation = camera.getAttribute('rotation');

		// console.log(cameraRotation);

		q.setFromAxisAngle(
			new this.gameEngine.CANNON.Vec3(0, 1, 0),
    	cameraRotation.y
		);

		// console.log('--------------------------------------------');
		// console.log(mov);
		// console.log(q.vmult(mov));

		// console.log(q);
	}


	onAddToWorld (gameEngine) {
		this.gameEngine = gameEngine;
		this.physicsObj = gameEngine.physicsEngine.addCylinder(
			this.height/5,
			this.height/5,
			this.height,
			4,
			0
		);

		this.physicsObj.quaternion.setFromAxisAngle(
			new ThreeVector(
				0,
				1,
				0
			),
			Math.PI
		);

		this.physicsObj.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		);

		// console.warn('test');
		// console.warn(this);

		// this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
		// if (this.scene) {
    //   // register CustomController componet to aframe
		// 	// CustomController.initFactory(this);
    //
		// 	let el = this.renderEl = document.createElement('a-entity');
    //
		// 	let camera = Avatar.getCamera();
    //
    //
    //
		// 	// camera.setAttribute(
		// 	// 	'position',
		// 	// 	`${this.position.x} ${this.height} ${this.position.z}`
		// 	// );
    //
    //
		// 	el.setAttribute('color', `red`);
		// 	el.setAttribute(
		// 		'geometry',
		// 		{
		// 			primitive: 'cylinder',
		// 			height: 0.180,
		// 			radius: 0.180/6
		// 		}
		// 	);
    //
		// 	el.setAttribute('game-object-id', this.id);
		// 	this.scene.appendChild(el);
		// }
	}

	delateObjectFromScene () {
		if (this.scene) {
			console.log('deleting an object from 3D scene');
		}
	}

}

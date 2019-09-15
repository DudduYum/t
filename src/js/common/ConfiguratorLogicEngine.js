import ObservableObject from './ObservableObject.js';
import Ground from './Ground.js';
import Avatar from './Avatar.js';
import House from './rooms/house1.js';

import {GameEngine, CannonPhysicsEngine, TwoVector, ThreeVector, Quaternion} from 'lance-gg';

var CANNON = null;

export default class ServiceLogic extends GameEngine {
	constructor (opt) {
		super(opt);

		// console.log(this.world);

		this.physicsEngine = new CannonPhysicsEngine(
			{
				gameEngine: this
			}
		);

		CANNON = this.physicsEngine.CANNON;

    // client
		this.on('client__syncReceived', this.clientSyncManger.bind(this));


    // common
		this.on('playerJoined', this.onPlayerJoind.bind(this));
		this.on('playerDisconnected', this.onPlayerDisconect.bind(this));
		this.on('preStep', this.onStep.bind(this));


		this.on('server__init', this.initGame.bind(this));
		this.on('server__processInput', this.inputRecived.bind(this));
	}

	syncTo (other) {
		super.syncTo(other);
	}

	onStep () {
		var observable = this.world.queryObject({ instanceType: ObservableObject });
		// console.warn(observable);
		// console.warn(params);

		if (observable) {

			// console.log(observable.position);
		}
	}

	initGame () {

		this.addObjectToWorld(
			new ObservableObject(
				this,
				{
				},
				{
					position: new ThreeVector(0, 0, 0),
					size: new ThreeVector(3,3,3)
				}
			)
		);
    //
		// this.addObjectToWorld(
		// 	new House(
		// 		this,
		// 		{},
		// 		{
		// 			position: new ThreeVector(0, 0, 0)
		// 		}
		// 	)
		// );

		let groundRotation = new CANNON.Quaternion();
		groundRotation.setFromAxisAngle(
			new CANNON.Vec3(1, 0, 0),
			- Math.PI/2
		);

		console.warn(groundRotation.toAxisAngle());
		// console.warn(groundRotation.toEuler());

		this.addObjectToWorld(
			new Ground(
				this,
				{
				},
				{
					position: new ThreeVector(0, 0, 0),
					velocity: new ThreeVector(0, 0, 0),
					quaternion: groundRotation
				}

			)
		);
	}

	addRandomObject () {
		let scene = this.renderer ? this.renderer.scene : null;

		if (scene) {
			let el = this.renderEl = document.createElement('a-entity');
			// el.setAttribute('color', 'green');
			el.setAttribute(
				'geometry',
				{
					primitive: 'box',
					height: 10,
					width: 4
				}
			);
			let randomX = (Math.random() * 20) - 10;
			let randomY = (Math.random() * 20) - 10;
			let randomZ = (Math.random() * 20) - 10;

			el.setAttribute('position', `${randomX} ${randomY} ${randomZ}`);
			el.setAttribute('rotation', '60 20 70');
			scene.appendChild(el);
			console.warn('now you can add');
		}
	}


	initWorld () {
		// console.warn('world has been initialized');
		super.initWorld(
			{
        worldWrap: true,
        width: 1000,
        height: 1000
      }
		);
	}

	clientSyncManger (options) {
		// console.log(options);
		// console.log(this.world.queryObject({ instanceType: ObservableObject }));
	}

	// step (isReenact, t, dt, physicsOnly) {
	// 	super.step(isReenact, t, dt, physicsOnly);
  //
	// 	// console.warn('step mf');
	// }

	onPlayerJoind(opt) {

		this.addObjectToWorld(
			new Avatar(
				this,
				{},
				{
					position: new ThreeVector(0, 1, 0),
					velocity: new ThreeVector(0, 0.1, 0),
					quaternion: new Quaternion(0.3, 0.4, 0.1, 0.1),
					angularVelocity: new ThreeVector(0, 0.3, 0),
					playerId: opt.playerId
				}
			)
		);

		
	}

	onPlayerDisconect(playerDesc) {
		let obj = this.world.queryObject(
			{
				playerId: playerDesc.playerId
			}
		);

		if (obj) {
			this.world.removeObject(obj.id);

			obj.delateObjectFromScene();
		}
	}

	inputRecived (params) {
		// console.warn(observable);
		// console.warn(params);


		if (params.input.input.command) {
			switch (params.input.input.command) {
				case 'restart':
					var observable = this.world.queryObject({ instanceType: ObservableObject });

					if (observable) {
						observable.physicsObj.position.set(-5, 10, 5);
					}
					break;
				case 'init':
				var h = this.world.queryObject({ instanceType: House });

					if (!h) {
						this.addObjectToWorld(
							new House(
								this,
								{},
								{
									position: new ThreeVector(0, 0, 0),
									size: new ThreeVector(5, 2, 3),
									model: 'house1'
								}
							)
						);
					}
					break;
				default:
					// unregistred
					console.log(params.input.input);
				break;
			}
		}
	}

	start () {
		super.start();

		// console.warn(new Quaternion().setFromEuler(-90, 0, 0, 'XYZ'));
	}

	userLeft (socket) {
		// var observable = this.world.queryObject({ playerId: socket.id });
		// console.log(this.world);
		// console.log(observable);
	}

	registerClasses (serializer) {
		serializer.registerClass(ObservableObject);
		serializer.registerClass(Ground);
		serializer.registerClass(Avatar);
		serializer.registerClass(House);
	}
}

import ConfigurationObject from './ConfigurationObject.js';
import ObservableObject from './ObservableObject.js';
import {
	KeyArrayParameter,
	KeyPropertyParameter
} from './configurationParameter.js';
import Ground from './Ground.js';
import Avatar from './Avatar.js';
import House from './rooms/house1.js';

const constants = require ("../common/commonConstants.js").constants;

// import constants from './commonConstants.js';
// import constants from '../common/commonConstants.js';

import {
	GameEngine,
	CannonPhysicsEngine,
	TwoVector,
	ThreeVector,
	Quaternion
} from 'lance-gg';

var CANNON = null;

export default class ServiceLogic extends GameEngine {
	constructor (opt) {
		super(opt);

		this.physicsEngine = new CannonPhysicsEngine({
			gameEngine: this
		});

		CANNON = this.physicsEngine.CANNON;
		this.CANNON = CANNON;

		// client
		this.on('client__syncReceived', this.clientSyncManger.bind(this));


		// common
		this.on('playerJoined', this.onPlayerJoind.bind(this));
		this.on('playerDisconnected', this.onPlayerDisconect.bind(this));
		this.on('server__preStep', this.onStep.bind(this));


		this.on('server__init', this.initGame.bind(this));
		this.on('server__processInput', this.inputRecived.bind(this));

    // hard coded for now
		this.configurationLogic = {
			'testingcube': {
				'Cube': [
					1,
					4

				]
			}
		};
		// this.scene = this.renderer ? this.renderer.scene : null;
		// if (this.scene) {
		// 	console.log('Hi I am on client side');
		// } else {
		// 	console.log('Nope, server side here');
		// }
	}

	// syncTo(other) {
	// 	super.syncTo(other);
	// }

	onStep() {
		var observable = this.world.queryObject({
			instanceType: ObservableObject
		});
		// console.warn(observable);
		// console.warn(params);


		if (observable) {

			// console.log(observable.position);
		}
	}


	// client side
	clientAdjustAvatarMovement(movements) {
		// console.log(this.playerId);
		// console.log(movements);
		// console.log('porco dd');

		let avatar = this.world.queryObject({
			playerId: this.playerId
		});
		// console.log(avatar);
		if (avatar) {
			avatar.move(movements);
			// console.log(movements);
			// console.log(avatar.physicsObj.quaternion.toAxisAngle());
		}
	}

	/*All object are add in this method*/
	initGame() {

    // TEST OBJECT
    /*this object is used to syncronize all configuration*/
		// this.addObjectToWorld(
		// 	new ConfigurationObject(
		// 		this,
		// 		{},
		// 		{
		// 			// configuration: [new KeyPropertyParameter('Cube', '1')]
		// 		}
		// 	)
		// );
		let gE = this;
		console.log(
			['Cube'].map(
			function (mesh) {
				let meshConfiguration = new KeyPropertyParameter(
					gE,
					{},
					{}
				);
				meshConfiguration.setValue(
					mesh,
					[
						'1'
					]
				);
				return meshConfiguration;
			}
		));


		this.addObjectToWorld(
			new ObservableObject(
				gE,
				{
					isOnServerSide: true
				},
				{
					modelID: '1',
					configuration: ['Cube'].map(
						function (mesh) {
							let meshConfiguration = new KeyPropertyParameter(
								gE,
								{},
								{}
							);
							meshConfiguration.setValue(
								mesh,
								'1'
							);
							return meshConfiguration;
						}
					),
					position: new ThreeVector(0, 0.5, -10),
					size: new ThreeVector(1, 1, 1),
					weight: 0
				}
			)
		);



    // WORLD
		let groundRotation = new CANNON.Quaternion();
		groundRotation.setFromAxisAngle(
			new CANNON.Vec3(1, 0, 0),
			-Math.PI / 2
		);

		this.addObjectToWorld (
			new Ground(
				this,
				{},
				{
					position: new ThreeVector(0, 0, 0),
					velocity: new ThreeVector(0, 0, 0),
					quaternion: groundRotation
				}

			)
		);

		// front
		// this.addObjectToWorld(
		// 	new ObservableObject(
		// 		this,
		// 		{
		// 		},
		// 		{
		// 			position: new ThreeVector(0, 0.5, -10),
		// 			size: new ThreeVector(1,1,1),
		// 			weight: 0
		// 		}
		// 	)
		// );

		// right
		// this.addObjectToWorld(
		// 	new ObservableObject(
		// 		this,
		// 		{
		// 		},
		// 		{
		// 			position: new ThreeVector(10, 0.5, 0),
		// 			size: new ThreeVector(2, 2, 2),
		// 			weight: 0
		// 		}
		// 	)
		// );

		// back
		// this.addObjectToWorld(
		// 	new ObservableObject(
		// 		this,
		// 		{
		// 		},
		// 		{
		// 			position: new ThreeVector(0, 0.5, 10),
		// 			size: new ThreeVector(3, 3, 3),
		// 			weight: 0
		// 		}
		// 	)
		// );

		// left
		// this.addObjectToWorld(
		// 	new ObservableObject(
		// 		this,
		// 		{
		// 		},
		// 		{
		// 			position: new ThreeVector(-10, 0.5, 0),
		// 			size: new ThreeVector(4, 4, 4),
		// 			weight: 0
		// 		}
		// 	)
		// );


		// creating a ground that contain all assets

	}

	initWorld() {
		// console.warn('world has been initialized');
		super.initWorld({
			worldWrap: true,
			width: 1000,
			height: 1000
		});
	}

	clientSyncManger(options) {}

	// step (isReenact, t, dt, physicsOnly) {
	// 	super.step(isReenact, t, dt, physicsOnly);
	//
	// 	// console.warn('step mf');
	// }

	onPlayerJoind(opt) {
		this.addObjectToWorld(
			new Avatar(
				this, {}, {
					position: new ThreeVector(0, 0, 0),
					velocity: new ThreeVector(0, 0.1, 0),
					quaternion: new Quaternion(0.3, 0.4, 0.1, 0.1),
					angularVelocity: new ThreeVector(0, 0.3, 0),
					playerId: opt.playerId,
					height: 1.98
				}
			)
		);
	}

	onPlayerDisconect(playerDesc) {
		let obj = this.world.queryObject({
			playerId: playerDesc.playerId
		});

		if (obj) {
			this.world.removeObject(obj.id);

			obj.delateObjectFromScene();
		}
	}


	// Input recieved handeler
	inputRecived(params) {
		if (params.input.input.command) {
			var avatarObj = this.world.queryObject({
				playerId: params.playerId
			});

			if (params.input.input.params && params.input.input.params.directionX) {
				avatarObj.direction.set(
					params.input.input.params.directionX,
					0,
					params.input.input.params.directionZ
				);
			}
			if (params.input.input.params.test) {
				console.warn(params.input.input.params.test);
			}


			switch (params.input.input.command) {
				case 'restart':
					var observable = this.world.queryObject({
						instanceType: ObservableObject
					});

					if (observable) {
						observable.physicsObj.position.set(-5, 10, 5);
					}
					break;
				case 'init':
					var h = this.world.queryObject({
						instanceType: House
					});

					if (!h) {
						this.addObjectToWorld(
							new House(
								this, {}, {
									position: new ThreeVector(0, 0, 0),
									size: new ThreeVector(5, 2, 3),
									model: 'house1'
								}
							)
						);
					}
					break;
				case constants.userSendNewConfigurationChunk:

					console.log('hi');
					let configurator = this.world.queryObject({
            // NOTE: remember it must be a number, not string
						id: Number.parseInt(params.input.input.params.configuration[0])
					});


					configurator.applyChanges([
						[
							params.input.input.params.configuration[1],
							params.input.input.params.configuration[2]
						]
					]);
					break;

			}
		}
	}

	changeConfigurationById (id) {

	}

	start() {
		super.start();

		// console.warn(new Quaternion().setFromEuler(-90, 0, 0, 'XYZ'));
	}

	userLeft(socket) {
		// var observable = this.world.queryObject({ playerId: socket.id });
		// console.log(this.world);
		// console.log(observable);
	}

	registerClasses(serializer) {
		serializer.registerClass(KeyArrayParameter);
		serializer.registerClass(KeyPropertyParameter);
		serializer.registerClass(ConfigurationObject);
		serializer.registerClass(ObservableObject);
		serializer.registerClass(Ground);
		serializer.registerClass(Avatar);
		serializer.registerClass(House);
	}
}

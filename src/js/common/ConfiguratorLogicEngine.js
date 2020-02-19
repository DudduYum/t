import ConfigurationObject from './ConfigurationObject.js';
import ObservableObject from './ObservableObject.js';
import _ from 'lodash';
import {
	KeyArrayParameter,
	KeyPropertyParameter
} from './configurationParameter.js';
import Ground from './Ground.js';
import Avatar from './Avatar.js';
import House from './rooms/house1.js';

const Promise = require( 'bluebird' );


const constants = require ("../common/commonConstants.js").constants;

// import constants from './commonConstants.js';
// import constants from '../common/commonConstants.js';

global.imageLoaded = () => {
	console.warn('hi I have been loaded');
}

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
			},
			'susan': {
				'Suzanne': [
					2,
					8,
					5
				]
			},
			'house': {
				'floors': [15, 8],
				'fondamenta': [8],
				'muri': [7,8],
				'portaGarage1': [8],
				'porte': [8],
				'ringhiere': [8],
				'ripparo': [15, 9],
				'roof': [8],
				'scalePrimPiano': [8],
				'taparelle': [9],
				'vetri': [17]
			}
		};

		this.floors = ['floors']

		this.locations = {
			[constants.infront]: new ThreeVector(10, 0, 0),
			[constants.back]: new ThreeVector(-10, 0, 0),
			[constants.right]: new ThreeVector(0, 0, 10),
			[constants.left]: new ThreeVector(10, 0,-10),
			[constants.firstFloor]: new ThreeVector(0, 0.5, 0),
			[constants.econdFloor]: new ThreeVector(0, 2, 0),
			[constants.garage]: new ThreeVector(0, 0.5, -3),
			[constants.balcony]: new ThreeVector(1, 2, 0)
		};

		this.scaleFactors = {
			'testingcube': 1,
			'susan': 1,
			'house': 1
		};

		this.modelList = {
			testingcube: 'models/testingcube.glb',
			susan: 'models/susan.glb',
			house: 'models/testingHouse.glb'
		}

		this.materialLibrary = {
			'0': {
				color: '#eee',
				metalness: 0.4
			},
			'1': {
				color: '#000',
				metalness: 0.7,
				emissive: '#00a'
			},
			'2': {
				color: '#3a0',
				metalness: 0.2,
				emissive: '#0ba'
			},
			'3': {
				color: '#50a',
				metalness: 0.2,
				roughness: 0.8,
				emissive: '#0ba'
			},
			'4': {
				color: '#c17',
				metalness: 0.2,
				roughness: 0.8,
				emissive: '#0ba'
			},
			'5': {
				color: '#404',
				metalness: 0.2,
				roughness: 0.8,
				emissive: '#0ba'
			},
			'6': {
				src: 'materials/5/5bc.png',
				repeat: {x: 3600, y: 3600},
				normalMap: 'materials/5/5no.png',
				normalTextureRepeat:  {x: 3600, y: 3600},
				metalness:  0,
				ambientOcclusionMap: 'materials/5/5ao.png',
				ambientOcclusionTextureRepeat:  {x: 3600, y: 3600}
			},
			'7': {
				aoMap: 'materials/7/ao.png',
				map: 'materials/7/bc.png',
				normalMap: 'materials/7/no.png',
				roughness: 0.8
			},
			'8': {
				aoMap: 'materials/8/ao.png',
				map: 'materials/8/bc.png',
				normalMap: 'materials/8/no.png',
				roughness: 0.8
			},
			'9': {
				aoMap: 'materials/9/ao.png',
				map: 'materials/9/bc.png',
				normalMap: 'materials/9/no.png'
				// ,
				// metalnessMap: 'materials/9/me.png'
			},
			'15': {
				aoMap: 'materials/15/ao.png',
				map: 'materials/15/bc.png',
				normalMap: 'materials/15/no.png',
				metalness: 0
			},
			'17': {
				color: '#0000aa'
				// ,
				// alphaMap:'materials/14/al.png'
				// alphaMap: 'materials/14/al.png'
			}
		};



		if (!opt.onServerSide) {
			this.onClientSide = true;
		}


	}

	onStep() {
		// var observable = this.world.queryObject({
		// 	instanceType: ObservableObject
		// });
    //
    //
		// if (observable) {
    //
		// 	// console.log(observable.position);
		// }
	}




	// client side
	clientAdjustAvatarMovement(movements){
		let avatar = this.world.queryObject({
			playerId: this.playerId
		});

		if (avatar) {
			avatar.move(movements);
		}
	}

	getModelUrl (modelId) {
			return this.modelList[modelId];
	}

	getConfigurationLogicForSystem(model) {
		return _.reduce(
			this.configurationLogic[model],
			function (acc, item, key) {
				acc.meshes[key] = item;
				return acc;
			},
			{
				meshes: {}
			}
		)
	}

	getScaleFactorForModelId (modelId) {
		console.log(modelId);
		return this.scaleFactors[modelId];
	}

	getStartConfigurationFor (model) {
		return _.reduce(
			this.configurationLogic[model],
			(acc, item, key) => {
				let conf = new KeyPropertyParameter(
					this,
					{},
					{}
				);
				conf.setValue(
					key,
					`${item[0]}`
				);

				acc.push(conf);

				return acc
			},
			[]
		)
	}

	isFloor (meshName) {
		return _.find(this.floors, item => item == meshName);
	}
	/*All object are add in this method*/
	initGame() {

    // TEST OBJECT
		let gE = this;
		// console.log(this.getStartConfigurationFor('house'));
		// console.log(['floors', 'fondamenta', 'muri', 'portaGarage1', 'porte', 'ringhiere', 'ripparo', 'roof', 'scalePrimPiano', 'taparelle', 'vetri'].map(
		// 	function (mesh) {
		// 		let meshConfiguration = new KeyPropertyParameter(
		// 			gE,
		// 			{},
		// 			{}
		// 		);
		// 		meshConfiguration.setValue(
		// 			mesh,
		// 			'8'
		// 		);
		// 		return meshConfiguration;
		// 	}
		// ));
		// this.addObjectToWorld(
		// 	new ObservableObject(
		// 		gE,
		// 		{
		// 			isOnServerSide: true
		// 		},
		// 		{
		// 			modelID: 'testingcube',
		// 			configuration: ['Cube'].map(
		// 				function (mesh) {
		// 					let meshConfiguration = new KeyPropertyParameter(
		// 						gE,
		// 						{},
		// 						{}
		// 					);
		// 					meshConfiguration.setValue(
		// 						mesh,
		// 						'1'
		// 					);
		// 					return meshConfiguration;
		// 				}
		// 			),
		// 			position: new ThreeVector(0, 0.5, -10),
		// 			size: new ThreeVector(1, 1, 1),
		// 			weight: 0
		// 		}
		// 	)
		// );

		// this.addObjectToWorld(
		// 	new ObservableObject(
		// 		gE,
		// 		{
		// 			isOnServerSide: true
		// 		},
		// 		{
		// 			modelID: 'susan',
		// 			configuration: ['Suzanne'].map(
		// 				function (mesh) {
		// 					let meshConfiguration = new KeyPropertyParameter(
		// 						gE,
		// 						{},
		// 						{}
		// 					);
		// 					meshConfiguration.setValue(
		// 						mesh,
		// 						'8'
		// 					);
		// 					return meshConfiguration;
		// 				}
		// 			),
		// 			position: new ThreeVector(0, 0.5, -10),
		// 			size: new ThreeVector(1, 1, 1),
		// 			weight: 0
		// 		}
		// 	)
		// );

		this.addObjectToWorld(
			new ObservableObject(
				gE,
				{
					isOnServerSide: true
				},
				{
					modelID: 'house',
					configuration: this.getStartConfigurationFor('house'),
					position: new ThreeVector(0, 0, 0),
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
					isOnServerSide: true,
					position: new ThreeVector(0, 20, 0),
					velocity: new ThreeVector(0, 0.1, 0),
					quaternion: new Quaternion(0.3, 0.4, 0.1, 0.1),
					angularVelocity: new ThreeVector(0, 0.3, 0),
					playerId: opt.playerId,
					height: 1.6
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

	getMaterilDefinitionById (id) {
		return this.materialLibrary[id];
	}

	// getMaterialById (id) {
  //
  //
	// 	return new THREE.MeshStandardMaterial(this.getMaterilDefinitionById(id));
	// }

	// Input recieved handeler
	inputRecived(params) {
		if (params.input.input.command) {
			var avatarObj = this.world.queryObject({
				playerId: params.playerId
			});

			// if (params.input.input.params && params.input.input.params.directionX) {
			// 	avatarObj.direction.set(
			// 		params.input.input.params.directionX,
			// 		0,
			// 		params.input.input.params.directionZ
			// 	);
			// }
			// if (params.input.input.params.test) {
			// 	console.warn(params.input.input.params.test);
			// }
			let avatar = '';

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
				case constants.avatarpositionchangeServer:
					let avatar = this.world.queryObject({
						playerId: params.playerId
					});

					avatar.physicsObj.position.x = params.input.input.params.movement.x;
					// avatar.position. = (params.input.input.params.movement.;
					avatar.physicsObj.position.y = params.input.input.params.movement.z;
					// console.log(avatar);

					break;
				case constants.userSendNewConfigurationChunk:

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
				case constants.initUserHeightServer:

					avatarObj.height = Number.parseFloat(params.input.input.params) - 0.04;
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

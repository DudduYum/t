import {ClientEngine, ThreeVector} from 'lance-gg';
import {ServiceRenderer} from './ServiceRenderer.js';
import EventEmitter from 'eventemitter3';

import Avatar from 'gameObjects/Avatar';

var constants = require ("../common/commonConstants.js").constants;

global.emiter = new EventEmitter();



export default class ServiceUserEngine extends ClientEngine {
  /*It may be a good thing to let the user modify the method, to set the
	way how the client will send configuration to the server */
	sendConfiguration (conf) {

		this.sendInput(
			{
				command: constants.userSendNewConfigurationChunk,
				params: {
					configuration: conf
				}
			}
		);
	}

	constructor (gE, inputObj) {
		super(gE, inputObj, ServiceRenderer);

		this.scene = null;

		this.gameEngine.on('objectAdded', this.onObjectAdd.bind(this));

		this.gameEngine.on('preStep', this.onStap.bind(this));

		this.gamePadList = [];
		global.buisnessLogic = this.gameEngine;

    // this method is used to send new configuration to the server
		global.emiter.on(
			constants.onConfigurationChangeEventName,

			this.sendConfiguration.bind(this) // I left it like this becouse, I would
      // like to give the possibility to whoever may came across this class, to
      // modify its functionality by just extendi methods
		);

		// it's my fu*kedup way to parameterisais my callbacks
		global[constants.changeUserPositionFunction] = function (position) {
			emiter.emit(
				constants.avatarpositionchange,
				{
					movement: position
				}
			);
		};

		// I use this method to send the position of the user
		global.emiter.on(
			constants.movementEvent,
			this.moveTheAvatar.bind(this)
		);

    // user get height
		global.emiter.on(
			constants.initUserHeight,
			this.changeHeight.bind(this)
		);

		global.initUserHeight = this.changeHeight.bind(this);

		global.addEventListener(
			'gamepadconnected',
			((scope) => {
				return (e) => {
					scope.registerGamePad(e.gamepad);
				}
			})(this)
		);
		// global.addEventListener(
		// 	'keydown',
		// 	function (e) {
		// 		console.log('test');
		// 		switch (e.key) {
		// 			case 't':‘’
		// 				console.log('t');
		// 				break;
		// 			default:
		//
		// 		}
		// 	}
		// )



		// emiter.on(
		// 	constants.onConfigurationChangeEventName,
		// 	this.sendConfiguration.bind(this)
		// );

		// global.emiter.on(
		// 	constants.avatarpositionchange,
		// 	this.moveTheAvatar.bind(this)
		// )
		if (global) {


		}
		// if (global) {
    //
		// 	// global.addEventListener(
		// 	// 	'gamepadMoveAction',
		// 	// )
    //
    //
		// 	global.addEventListener(
		// 		'keydown',
		// 		((scope) => {
		// 			return (e) => {
		// 				let camera = null;
		// 				document.querySelectorAll('a-entity').forEach(
		// 					(el, index) => {
		// 						if (el.hasAttribute('camera')) {
		// 							camera = el;
		// 						}
		// 					}
		// 				);
    //
		// 				let cameraRoatation = camera.getAttribute('rotation');
    //
    //
    //
		// 				switch (e.key) {
		// 					case 'n':
		// 						this.sendInput(
		// 							{
		// 								command: 'init',
		// 								params: {}
		// 							}
		// 						);
		// 						break;
		// 					case 'r':
		// 						this.sendInput(
		// 							{
		// 								command: 'restart',
		// 								params: {}
		// 							}
		// 						);
		// 						break;
		// 					case 'MediaFastForward':
		// 					// case 'ArrowUp':
		// 					case 'w':
		// 					case 'i':
		// 						this.sendInput(
		// 							{
		// 								command: 'moveForward',
		// 								params: {
		// 									directionX: cameraRoatation.x,
		// 									directionZ: cameraRoatation.y
		// 								}
		// 							}
		// 						);
		// 						break;
		// 					case 'MediaRewind':
		// 					// case 'ArrowDown':
		// 					case 's':
		// 					case 'k':
		// 						this.sendInput(
		// 							{
		// 								command: 'moveBackward',
		// 								params: {
		// 									directionX: cameraRoatation.x,
		// 									directionZ: cameraRoatation.y
		// 								}
		// 							}
		// 						);
		// 						break;
		// 					case 'MediaTrackNext':
		// 					// case 'ArrowRight':
		// 					case 'd':
		// 					case 'l':
		// 						this.sendInput(
		// 							{
		// 								command: 'moveRight',
		// 								params: {
		// 									directionX: cameraRoatation.x,
		// 									directionZ: cameraRoatation.y
		// 								}
		// 							}
		// 						);
		// 						break;
		// 					case 'MediaTrackPrevious':
		// 					// case 'ArrowLeft':
		// 					case 'a':
		// 					case 'j':
		// 						this.sendInput(
		// 							{
		// 								command: 'moveLeft',
		// 								params: {
		// 									directionX: cameraRoatation.x,
		// 									directionZ: cameraRoatation.y
		// 								}
		// 							}
		// 						);
		// 						break;
		// 					case 'Enter':
		// 						this.sendInput(
		// 							{
		// 								command: 'action',
		// 								params: {}
		// 							}
		// 						);
		// 						break;
		// 					default:
		// 						this.sendInput(
		// 							{
		// 								command: 'unregistred',
		// 								key: e.key,
		// 								params: {}
		// 							}
		// 						);
    //
		// 				}
		// 			};
		// 		})(this)
		// 	);
		// }
	}

	sendConfiguration (conf) {
		this.sendInput(
			{
				command: constants.userSendNewConfigurationChunk,

				params: {
					configuration: conf
				}
			}
		);
	}

	changeHeight (value) {
		// debugger
		this.sendInput({
			command:  constants.initUserHeightServer,
			params: value
		});
	}

	moveTheAvatar (movemet) {
		this.sendInput({
			command: constants.avatarpositionchangeServer,
			params: movemet
		});
	}


	onStap(arg) {
		let list = global.navigator.getGamepads();
		this.gamePadList.map(
			(index) => {


				emiter.emit(
					'gamepad_input',
					{
						index: index,
						movement: new ThreeVector(
							list[index].axes[0],
							0,
							list[index].axes[1]
						)
					}
				);

				// this.gameEngine.clientAdjustAvatarMovement(
				// 	new ThreeVector(
				// 		list[index].axes[0],
				// 		0,
				// 		list[index].axes[1]
				// 	)
				// );
			}
		);
	}

	registerGamePad (gamepadObj) {
		if (!this.gamePadList.find( item => item == gamepadObj.index )) {
			this.gamePadList.push(gamepadObj.index);
		}
	}

	removeController (id) {
		// this.ge
	}


	initAvatar (joinT, description, playerId) {
		console.log(joinT);
		console.log(description);
		console.log(playerId);
	}

	getUserInput () {
		let list = global.navigator.getGamepads();

		this.gamePadList.map(
			(index) => {
				this.setGamePadAxis(
					new ThreeVector(
						list[index].axes[0],
						0,
						list[index].axes[1]
					)
				);
			}
		);
	}



	onObjectAdd (objData, options) {
		if (objData instanceof Avatar) {
				document.querySelectorAll('a-entity').forEach(
				(el, index, arr) => {
					if (el.hasAttribute('camera')) {
            // combine together camera and avatar
						objData.assignCamera(el);
						console.log('Camera attributs has been added');
            // adding custom componet for don't remember what
            // listenring to the events caming from controller
						let newEntity = document.createElement('a-entity');



						newEntity.setAttribute(
							'camera-parameters-getter',
							''
						);
						// el.setAttribute(
						// 	'camera-parameters-getter',
						// 	''
						// );

						// el.setAttribute(
						// 	'custom-avatar-movement-controller',
						// 	''
						// );
					}
				}
			);

		}
	}



	// start () {
	// 	super.start();
  //
	// }
}

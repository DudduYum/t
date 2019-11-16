import {AFrameRenderer,ThreeVector} from 'lance-gg';
import 'aframe-event-set-component';
import 'aframe-gui';
// import EventEmitter from 'eventemitter3';

// import {CustomController} from '../client/controlls/Controlls';
import './components/aFrameComponets.js';

// Object.assign(
// 	global,
// 	aframeEventSetComponet
// );

class ServiceRenderer extends AFrameRenderer {
	constructor (gameEngine, clientEngine) {
		super(gameEngine, clientEngine);

		require('./components/aFrameComponets.js');


		global.emiter.on(
			'cameraInit',
			function () {
				console.log('ho sentito qualcosa');
			}
		);


	}


	setGamePadAxis (vec) {

		// console.log(vec);
		// if (this.gamePadState.axis.x != vec.x ||
	// 	// 	this.gamePadState.axis.y != vec.y ||
	// 	// 	this.gamePadState.axis.z != vec.z)
	// 	// {
	// 		let camera = null;
	// 		this.scene.children.forEach(
	// 			(el) => {
	// 				if (el.hasAttribute('camera')) {
	// 					camera = el;
	// 					// console.log('cane');
	// 				}
	// 			}
	// 		);
  //
	// 		this.gamePadState.axis.set(
	// 			vec.x,
	// 			vec.y,
	// 			vec.z
	// 		);
  //
	// 		camera.dispatchEvent(
	// 			new CustomEvent(
	// 				'gamepadMoveAction',
	// 				{
	// 					detail: {
	// 						movements: this.gamePadState.axis
	// 					}
	// 				}
	// 			)
	// 		);
  //
  //
	// 		// document.dispatchEvent(
	// 		// 	new Event(
	// 		// 		'gamepadMoveAction',
	// 		// 		{
	// 		// 			movementVector: this.gamePadState.axis
	// 		// 		}
	// 		// 	)
	// 		// );
	// 		// this.emmiter(
	// 		// 	'gamepadMoveAction',
	// 		// 	{
	// 		// 		movementVector: this.gamePadState.axis
	// 		// 	}
	// 		// );
	// 	// }
  //
	}

	init() {
		return super.init().then(
			() => {
					let scene = document.querySelector('a-scene');
					let camera = null;
					let assetsDiv = document.querySelector('a-assets');

					let spaceAsset = document.createElement('a-asset-item');

					spaceAsset.setAttribute('src', 'models/houses/house1.gltf'); // teoretically I may add an event listener with event emitter for this elment
					spaceAsset.setAttribute('id', 'space');
					assetsDiv.appendChild(spaceAsset);

					emiter.on(
						'loaded',
						function (e) {
							console.log('just test');
						},
						spaceAsset
					);

					// let space = document.createElement('a-gltf-model');
					// space.setAttribute('src', '#space');

					// window.setTimeout(
					// 	(function (s) {
					// 		return function () {
					// 			let space = document.createElement('a-gltf-model');
					// 			space.setAttribute('src', '#space');
					// 			s.appendChild(space)
					// 		}
					// 	})(scene),
					// 	4000
					// )


					let space = document.createElement('a-gltf-model');
					space.setAttribute('gltf-model', 'models/houses/house1.gltf');
					scene.appendChild(space)

					// if (space.components['gltf-model'].model) {
					// } else {
					// 		space.addEventListener(
					// 			'model-loaded',
					// 			(function (s) {
					// 					return function () {
					// 						s.appendChild(space)
					// 					}
					// 			})(scene)
					// 		)
					// }



					scene.appendChild(space)

					assetsDiv.appendChild(space);

					camera = scene.querySelector('#cameraRig');
					// scene.children.forEach(
					// 	(el, index, array) => {
					// 		if (el.hasAttribute('camera')) {
					// 			camera = el;
					// 		}
					// 	}
					// );

					camera.setAttribute('direction', '');
					camera.setAttribute('bluetooth-controller-listener', '');

					// camera.setAttribute('joypad-controller', {controllerID: '1'});

					// let box = document.createElement('a-box');
					// box.setAttribute('position', '0.8 -0.8 -2');
					// camera.appendChild(box);


					// let cursore = document.createElement('a-cursor');

					// camera.appendChild(cursore);


					this.isReady = true;
			}
		);
	}

	// runClientStep(t, dt) {
		// super.runClientStep();
		// let list = global.navigator.getGamepads();
    //
		// this.clientEngine.gamePadList.map(
		// 	(index) => {
		// 		this.setGamePadAxis(
		// 			new ThreeVector(
		// 				list[index].axes[0],
		// 				0,
		// 				list[index].axes[1]
		// 			)
		// 		);
		// 	}
		// );
	// }
}




export {ServiceRenderer};

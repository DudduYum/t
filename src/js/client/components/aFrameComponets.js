// import EventEmitter from 'eventemitter3';
import './a-configurator';
import './a-navigator';

import * as CANNON from 'cannon';
// let emiter = new EventEmitter();
// console.log(new EventEmitter());

global.onhoveraction = function () {
	console.log('hover');
}

global.onclickaction = function () {
	console.log('click click');
}

AFRAME.registerComponent(
	'direction',
	{
		schema: {
			userOrientation: {
				type: 'vec4'
			}
		},
		init: function () {
			console.log(`orientation component has been initialized on ${this.id}`);
			emiter.emit('cameraInit', 3);
		},
		tick: (function () {
				var pos = new THREE.Vector3();
				var quat = new THREE.Quaternion();
				return function () {

					this.el.object3D.getWorldPosition(pos);
					this.el.object3D.getWorldQuaternion(quat);

					// debugger;
					this.data.userOrientation.x = quat.x;
					this.data.userOrientation.y = quat.y;
					this.data.userOrientation.z = quat.z;
					this.data.userOrientation.w = quat.w;
				};
		})()
	}
);

AFRAME.registerComponent(
	'testcomponent',
	{
		init: function () {
			console.log('test components');
			debugger;
			console.log(this);
		}
	}
);


AFRAME.registerComponent(
	'bluetooth-controller-listener',
	{
		schema: {
			controllerID: {
				type: 'int'
			}
		},
		init: function () {
			console.log(`orientation component has been initialized on ${this.id}`);
			// global.emiter.on('cameraInit', function () {console.log('test');});


			let listener = ((scope) => {
				let correctedVector = new THREE.Vector3();
				let controllerVector = new THREE.Vector3();
				let controllerSpaceViewVectro = new THREE.Vector3(0, 0, -1);
				let controllerUpVector = new THREE.Vector3(0, 1, 0);

				let controllerQuaternion = new THREE.Quaternion();
				let cameraWQuaternion = new THREE.Quaternion();
				return function (gamePadEvents) {
					if (scope.hasAttribute('direction')) {
						// convert from right hand system to left hand one
						// console.log(gamePadEvents.movement);

						correctedVector.set(
							gamePadEvents.movement.x,
							gamePadEvents.movement.y,
							gamePadEvents.movement.z
						);

						controllerVector.set(
							correctedVector.x,
							correctedVector.y,
							correctedVector.z
						);

						Object.keys(controllerVector).map(
							(k) => {
								controllerVector[k] = Math.abs(controllerVector[k]) < 0.004 ? 0 : gamePadEvents.movement[k];
							}
						);

						controllerVector.normalize();


						// console.log(controllerVector);
            // obsolate
						// let controllerRotation = controllerSpaceViewVectro.angleTo(
						// 	controllerVector
						// );



						controllerQuaternion.setFromUnitVectors(
							controllerVector,
							controllerSpaceViewVectro
						);

						cameraWQuaternion.set(
							scope.getAttribute('direction').userOrientation.x,
							scope.getAttribute('direction').userOrientation.y,
							scope.getAttribute('direction').userOrientation.z,
							scope.getAttribute('direction').userOrientation.w
						);



						let testQuaternion = new THREE.Quaternion();
						testQuaternion.multiplyQuaternions(
							cameraWQuaternion,
							controllerQuaternion
						);

						// let testVector = new THREE.Vector3(0, 0, -1);

						console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
						// console.log(new THREE.Vector3(0, 0, -1).applyQuaternion(cameraWQuaternion));
						// console.log('---------------------------------');
						// console.log(new THREE.Vector3(0, 0, -1).applyQuaternion(controllerQuaternion));
						// console.log('---------------------------------');
						console.log(new THREE.Vector3(0, 0, -1).applyQuaternion(testQuaternion));
						console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


						// let test1 = new CANNON.Quaternion(controllerQuaternion.x, controllerQuaternion.y, controllerQuaternion.z, controllerQuaternion.w);
						// console.log(test1.toAxisAngle()[0]);
						// console.log(test1.toAxisAngle()[1]);

							// console.log(controllerQuaternion);

						// if (!Number.isNaN(controllerRotation)) {


							// setFromAxisAngle(
							// 	controllerUpVector,
							// 	controllerRotation
							// );


							// let test = new CANNON.Quaternion(cameraWQuaternion.x, cameraWQuaternion.y, cameraWQuaternion.z, cameraWQuaternion.w);

							// console.log(cameraWQuaternion);

							// console.log(test.toAxisAngle());

							// debugger;
						// }




					}
				}

			})(this.el)

			// listener('like event');

			global.emiter.on(
				'gamepad_input',
				listener
			);

		},
		tick: function () {

		}
	}
);




// AFRAME.registerComponent(
// 	'joypad-controller',
// 	{
// 		schema: {
// 			controllerID: {
// 				type: 'string',
// 				default: 'none'
// 			}
// 		},
// 		init: function (parm) {
// 			console.log('componet has been created');
// 			console.log(this);
// 		},
// 		tick: function (parm) {
// 			// console.log(parm);
// 			// console.log(this.data);
// 			// console.log(this.el.object3D.rotation);
// 			// console.log(this.el.object3D.position);
// 		}
// 	}
// );

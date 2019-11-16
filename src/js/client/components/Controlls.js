// import {CannonPhysicsEngine, ThreeVector, Quaternion} from 'lance-gg';
import * as CANNON from 'cannon';
// let CANNON = null;
// console.log(CANNON);
class CustomController {
	constructor () {
		this.type = 'custom-controller';
	}

	static initFactory (options = {}) {
		// CANNON is awsome!
		// CANNON = avatar.gameEngine.physicsEngine.CANNON;
		// let lastMovement = new CANNON.Vec3(0,0,0);


		// avatar.physicsObj.velocity.set
		// AFRAME.registerComponent(
		// 	'custom-avatar-movement-controller',
		// 	{
		// 		init: function () {
		// 			var el = this.el;
    //
		// 			let cameraOrientation = el.getAttribute('camera-parameters-getter')
		// 			console.log();
    //
		// 			el.addEventListener(
		// 				'gamepadMoveAction',
		// 				(e) => {
		// 					let movement = e.detail.movements;
    //
		// 					let cameraPosition = el.getAttribute('position');
		// 					let cameraRotation = el.getAttribute('rotation');
    //
		// 					let qCameraYRotation = new CANNON.Quaternion();
		// 					console.log(cameraOrientation);
		// 					qCameraYRotation.setFromAxisAngle(
		// 						new CANNON.Vec3(0, 1, 0),
		// 						cameraRotation.y
		// 					);
    //
		// 					let mov = new CANNON.Vec3(
		// 						movement.x,
		// 						movement.y,
		// 						movement.z
		// 					);
    //
		// 					console.log(mov);
    //
		// 					mov = qCameraYRotation.vmult(mov);
    //
		// 					mov.mult(2);
		// 					console.log(mov);
		// 					let pos = new CANNON.Vec3(
		// 						cameraPosition.x,
		// 						cameraPosition.y,
		// 						cameraPosition.z
		// 					);
    //
		// 					pos = pos.vadd(mov);
    //
		// 					console.log(pos);
		// 					el.setAttribute(
		// 						'position',
		// 						`${pos.x} ${pos.y} ${pos.z}`
		// 					);
    //
		// 				// 	let z = new CANNON.Vec3(0, 0 , -1); // movement forward direction
		// 				// 	console.log(el.getAttribute('rotation'));
		// 				// 	let v = new CANNON.Vec3( // view vector
		// 				// 		el.rotation.x,
		// 				// 		0,
		// 				// 		el.rotation.z
		// 				// 	);
    //         //
		// 				// 	console.log('@@@@@@@@@@@@');
		// 				// 	console.log(v);
    //         //
		// 				// 	v.normalize();
		// 				// 	console.log(v);
    //         //
		// 				// 	let q = new CANNON.Quaternion();
    //         //
		// 				// 	console.log('@@@@@@@@@@@@');
		// 				// 	q.setFromVectors(z, v);
    //         //
		// 				// 	let mov = new CANNON.Vec3(
		// 				// 		movement.x,
		// 				// 		0,
		// 				// 		movement.z
		// 				// 	);
    //         //
		// 				// 	console.log('t');
		// 				// 	console.log(mov);
		// 				// 	console.log(q.vmult(mov));
		// 				// 	mov = q.vmult(mov);
		// 				// 	// mov = mov.mult(1);
		// 				// 	console.log(mov.mult(2));
		// 				// 	console.log(mov);
		// 				// 	console.log('------------------------------');
    //         //
    //         //
		// 				// 	console.log(q.toAxisAngle());
    //         //
		// 				// 	let p = new CANNON.Vec3(
		// 				// 		avatat.position.x,
		// 				// 		avatat.position.y,
		// 				// 		avatat.position.z
		// 				// 	);
    //         //
		// 				// 	console.log(p);
		// 				// 	p = p.vadd(mov);
		// 				// 	console.log(p);
    //         //
		// 				// 	avatat.physicsObj.position.set(
		// 				// 		p.x,
		// 				// 		p.y,
		// 				// 		p.z
		// 				// 	);
		// 				}
		// 			);
		// 		},
		// 		play: (
		// 			() => {
		// 				console.log('somebody called to me');
		// 			}
		// 		),
		// 	}
		// );


	}
}


export {CustomController};

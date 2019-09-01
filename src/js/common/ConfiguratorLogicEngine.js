import ObservableObject from './ObservableObject.js';
import {GameEngine, CannonPhysicsEngine, TwoVector, ThreeVector, Quaternion} from 'lance-gg';



export default class ServiceLogic extends GameEngine {
	constructor (opt) {
		super(opt);

		// console.log(this.world);

		this.physicsEngine = new CannonPhysicsEngine(
			{
				gameEngine: this,
				dt: 500
			}
		);

    // client
		this.on('client__syncReceived', this.clientSyncManger.bind(this));

    // common
		this.on('objectAdded', this.onObjectAdd.bind(this));

		this.on('server__processInput', this.inputRecived.bind(this));
		this.on('playerJoined', this.onPlayerJoind.bind(this));
	}

	syncTo (other) {
		super.syncTo(other);
	}


	initWorld() {
		super.initWorld(
			{
        worldWrap: true,
        width: 3000,
        height: 3000
      }
		);
		console.warn('world has been initialized');
	}

	clientInputRecived (options) {
		console.log('cliente recived data');
	}

	clientSyncManger (options) {
		console.log(options);
		// console.log(this.world.queryObject({ instanceType: ObservableObject }));
	}


	onObjectAdd (object) {
		console.log(object);
		console.log('object was realy added');
		console.log(this.world);
	}
	// step (isReenact, t, dt, physicsOnly) {
	// 	super.step(isReenact, t, dt, physicsOnly);
  //
	// 	// console.warn('step mf');
	// }

	onPlayerJoind(joinTime) {
		this.addObjectToWorld(
			new ObservableObject(
				this,
				{},
				{
					position: new ThreeVector(0, 0, 0),
					velocity: new ThreeVector(0, 0.1, 0),
					quaternion: new Quaternion(0.3, 0.4, 0.1, 0.1),
					angularVelocity: new ThreeVector(0, 0.3, 0)
				}
			)
		);
	}

	inputRecived (input) {
		var observable = this.world.queryObject({ instanceType: ObservableObject });
		// console.log(this.world);
		// console.log(observable);

		if (observable) {
			// observable.configurations[input.input.input.index] = input.input.input.value;
			observable.last = input.input.input.value;
		}

		console.log(input);
	}

	userJoined (socket) {
		this.addObjectToWorld(
			new ObservableObject(
				this,
				{},
				{
					position: new ThreeVector(0, 0, 0),
					velocity: new ThreeVector(0, 0.1, 0),
					quaternion: new Quaternion(0.3, 0.4, 0.1, 0.1),
					angularVelocity: new ThreeVector(0, 0.3, 0)
				}
			)
		);
	}

	userLeft (socket) {
		// var observable = this.world.queryObject({ playerId: socket.id });
		// console.log(this.world);
		// console.log(observable);
	}

	registerClasses (serializer) {
		serializer.registerClass(ObservableObject);
		// console.log(serializer);
	}
}

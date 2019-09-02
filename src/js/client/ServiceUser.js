import {ClientEngine} from 'lance-gg';
import {ServiceRenderer} from './ServiceRenderer.js';

export default class ServiceUserEngine extends ClientEngine {
	constructor (gE, inputObj) {
		super(gE, inputObj, ServiceRenderer);
		this.scene = null;

		// gE.on('preStep', () => {console.log('prco dio');});
	}

	// init() {
	// 	return super.init().then(
	// 		() => {
	// 			this.isReady = true;
	// 		}
	// 	);
	// }

	start () {
		super.start();

	}
}

// var Renderer = require('lance/client/lance-gg').Renderer;
// import Renderer from 'lance/render/Renderer';
import {AFrameRenderer} from 'lance-gg';

class ServiceRenderer extends AFrameRenderer {
	constructor (gameEngine, clientEngine) {
		super(gameEngine, clientEngine);

		console.log('yo man, whats uup?');
	}
}

export {ServiceRenderer};

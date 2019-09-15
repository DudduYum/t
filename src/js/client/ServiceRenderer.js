// var Renderer = require('lance/client/lance-gg').Renderer;
// import Renderer from 'lance/render/Renderer';
import {AFrameRenderer} from 'lance-gg';

class ServiceRenderer extends AFrameRenderer {
	constructor (gameEngine, clientEngine) {
		super(gameEngine, clientEngine);

		console.log('yo man, whats uup?');
	}

	init() {
		return super.init().then(
			()=> {
					console.warn(document.querySelector('body'));
					console.warn(document.querySelector('a-scene'));
					// document.querySelector('a-assets').addEventListener('loaded',
					// ()=>{
					// 	console.log('assets loaded');
					// 	document.body.classList.remove('loading');
          //
					// 	this.gameEngine.emit('_SLRENDERER_ready');
					this.isReady = true;
					// }
				// );
			}
		);
	}
}


export {ServiceRenderer};

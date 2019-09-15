import {ClientEngine} from 'lance-gg';
import {ServiceRenderer} from './ServiceRenderer.js';


import Avatar from 'gameObjects/Avatar';

export default class ServiceUserEngine extends ClientEngine {
	constructor (gE, inputObj) {
		super(gE, inputObj, ServiceRenderer);
		this.scene = null;
		this.gameEngine.on('objectAdded', this.onObjectAdd.bind(this));


		if (global) {
			global.addEventListener(
				'gamepadconnected',
				function (e) {
					this.sendInput(
						{
							command: 'newController'
						}
					);
				}
			);
			global.addEventListener(
				'keydown',
				((scope) => {
					return (e) => {
						let camera = null;
						document.querySelectorAll('a-entity').forEach(
							(el, index) => {
								if (el.hasAttribute('camera')) {
									camera = el;
								}
							}
						);

						switch (e.key) {
							case 'i':
								this.sendInput(
									{
										command: 'init'
									}
								);
								break;
							case 'r':
								this.sendInput(
									{
										command: 'restart'
									}
								);
								break;
							default:
							this.sendInput(
								{
									command: 'unregistred',
									key: e.key
								}
							);

						}
					};
				})(this)
			);
		}
		// gE.on('preStep', () => {console.log('prco dio');});
	}

	// init() {
	// 	return super.init().then(
	// 		() => {
	// 			this.isReady = true;
	// 		}
	// 	);
	// }


	onObjectAdd (objData, options) {
		console.warn(objData);
		switch ((instanceif objData)) {
			case Avatar:
				console.warn('yes');
				break;
			default:
				console.warn('no');

		}
	}

	start () {
		super.start();

	}
}

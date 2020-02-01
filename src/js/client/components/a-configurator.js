import './a-configurator-system';
import _ from 'lodash';
import AFrameCustomProperty from '../../utils/aframeCustomProperty.js';
// import {constants} from '../../common/commonConstants.js';


const CONFIGURATOR_ID_ATRIBUTE_NAME = 'configuratorId';

AFRAME.registerComponent(
	'configurator',
	{
		schema: {
			id: {type: 'int'},
			modelIsLoaded: {type: 'boolean'},
			model: {type: 'string'},
			url: {type: 'string', default: 'path non specificato'},
			loaded: {type: 'boolean', default: 'false'},
			configuration: AFrameCustomProperty.getObjectProperty('{}')
		},

		onModelLoad: function (obj) {
			const scope = this;
			obj.name = this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME);

			this.el.setObject3D(
				// 'mesh',
				this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME),
				// 'test',
				obj.scene.children.reduce(
					(rootObj, singleMesh) => {

						rootObj.add(singleMesh);
						// singleMesh.material = this.system.getConfigurationForIdAndMesh(this.data.id , singleMesh.name);

						scope.data.modelIsLoaded = true;
						// scope.el.setAttribute('configurator', true);

            // I don't know if this is the correct way but
            // it works, so for now I will not dubt it
						// debugger;
						return rootObj;
					},
					new THREE.Object3D()
				)
			);
			this.update();

		},

		tick: function () {
			if (this.system.isUpdateIsNeeded(this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME))) {
        // I realy don't know if it's legal, but it fucking works
				this.update();
			}
		},

		init: function () {


      // a-frame gltf-model init method, since I don't know if there is a way
      // to extend existent
			this.system.registerConfigurableObject(
				this.data.id,
				{},
				this.data.model
			);

			var dracoLoader = this.system.getDRACOLoader();

			this.gltfModelLoader = new THREE.GLTFLoader();

      // without this trick
			let onModelLoadBinded = this.onModelLoad.bind(this);

			this.mesh = this.gltfModelLoader.load(
				// this.data.url,
				this.system.getModelPath(this.data.id),
				onModelLoadBinded
			);

			this.el.setAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME, this.data.id);

      // note not sure why I add this to
			this.el.addEventListener(
				'click',
				(function (scope) {
					return function (evt) {
						console.log(evt);
						console.log(this.children);
						console.log(scope);

						this.children.forEach(
							(item) => {
								if (item.hasAttribute('rk-type')) {
									item.setAttribute('opacity', '0');
									console.log('hi');
								}
							}
						);

						// let document.createElement('a-entity');
					}
				})(this)

			)
			this.data.modelIsLoaded = false;
			// debugger
			document.addEventListener(
			// this.el.addEventListener(
				global.onConfigurationChangeEventName,
				function (e) {
					console.log('hi i like trains');
				}
			);
		},

		update: function (oldData) {
			if (
				this.system.isUpdateNeeded(
					this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME)
				) &&
				this.data.modelIsLoaded
			) {


				let self = this;
				this.el.getObject3D(this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME)).children
				.map(
					(child) => {
						child.material = this.system.getMaterialById(
							self.data.configuration[child.name]
						);
					}
				);
			}
		}
	}

	// NOTE: I must register an event handler to consume the evet and trigger
  // update
)

global.testfunction = function (argv) {
	console.warn('hi');
	console.log(argv);
}

AFRAME.registerComponent(
	'configurator-ui-manager',
	{
		schema: {
			uistate: {type: 'boolean', default: false}
		},

		addButtonsForConfigurablePart: function (buttonsDescription) {
			if (!this.ui) {
				throw new Error('Ui object wasn\'t defined');
			}
			Object.keys(buttonsDescription).map(
				(meshName) => {
					let offset = 0.4;
					buttonsDescription[meshName].map(
						(btnDefinition) => {

							let buttonActiveColor = this.configuratorSystem.data.buttonActiveColor;
							let	buttonBorderColor = this.configuratorSystem.data.buttonBorderColor;

							let button = document.createElement('a-gui-button');

							button.setAttribute('active-color', buttonActiveColor);
							button.setAttribute('border-color', buttonBorderColor);
							button.setAttribute('font-family', 'Serif');
							button.setAttribute('margin', `0 0 ${offset} 0`);
							button.setAttribute('value', `${offset}`);
							button.setAttribute('onclick', `changeConfigurationHandler(["${this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME)}", "${meshName}", "${btnDefinition}"])`);
							button.setAttribute('onhover', 'testfunction');

							offset += 0.1;

							this.ui.appendChild(button);
						}

					);
				}
			);

		},

		init: function () {
			this.configuratorSystem = document.querySelector('a-scene').systems['configurator'];

			let configurationPanelColor = this.configuratorSystem.data.configurationPanelColor;
			let buttonActiveColor = this.configuratorSystem.data.buttonActiveColor;
			let	buttonBorderColor = this.configuratorSystem.data.buttonBorderColor;

			this.ui = document.createElement('a-gui-flex-container');

			this.ui.setAttribute( 'rk-type', 'modelUI' );

			this.ui.setAttribute( "flex-direction","column" );
			this.ui.setAttribute( "justify-content","column" );
			this.ui.setAttribute( "align-items","normal" );
			this.ui.setAttribute( "is-top-container","true" );

			this.ui.setAttribute( "panel-color", configurationPanelColor );

			this.ui.setAttribute( "component-padding","0.1" );
			this.ui.setAttribute( "opacity","0.8" );
			this.ui.setAttribute( "width","4.5" );
			this.ui.setAttribute( "height","3.0" );
			this.ui.setAttribute( "position","5 1.5 -4" );
			this.ui.setAttribute( "rotation","0 0 0" );

      // children button
			// this.button = document.createElement('a-gui-button');

			_.map(
				this.configuratorSystem.getConfigurationLogicFor(this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME)), //configurationLogic
				// (item) => {
				// 	console.log(item);
				// }
				this.addButtonsForConfigurablePart.bind(this)
			);


			// this.addButtonsForConfigurablePart();

			// this.button.setAttribute('active-color', buttonActiveColor);
			// this.button.setAttribute('border-color', buttonBorderColor);
			// this.button.setAttribute('font-family', 'Serif');
			// // this.button.setAttribute('onclick', chengeMaterial);
      //
			// this.ui.appendChild(this.button);


			this.el.appendChild(this.ui);

			// scope.ui.setAttribute( "opacity","0" );

			// this.el.setAttribute(
			// 	'gui-flex-container',
      //
			// );
			// debugger;
		},

		update: function () {

		}
	}
)

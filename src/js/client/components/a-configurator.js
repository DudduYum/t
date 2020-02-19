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
			// let root = new THREE.Object3D();

			global.test = obj;
			// debugger

			// root.scale.x = buisnessLogic.getScaleFactorForModelId(scope.modelID);
			// root.scale.y = buisnessLogic.getScaleFactorForModelId(scope.modelID);
			// root.scale.z = buisnessLogic.getScaleFactorForModelId(scope.modelID);

			obj.name = this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME);

			this.el.setObject3D(
				this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME),


				obj.scene
				// obj.scene.children.reduce(
				// 	(rootObj, singleMesh) => {
        //
				// 		// if (singleMesh.geometry) {
        //     //
				// 		// 	rootObj.add(
				// 		// 		new THREE.Mesh(
				// 		// 			new THREE.Geometry().fromBufferGeometry(singleMesh.geometry),
				// 		// 			new THREE.MeshBasicMaterial()
				// 		// 		)
				// 		// 	);
				// 		// } else {
        //     //
				// 		// }
        //
				// 		debugger
				// 		rootObj.add(singleMesh);
        //
				//
        //
				// 		// scope.el.setAttribute('configurator', true);
        //
        //     // I don't know if this is the correct way but
        //     // it works, so for now I will not dubt it
				// 		// debugger;
				// 		return rootObj;
				// 	},
				// 	// root
				// 	new THREE.Object3D()
				// )
			);
			// console.log(this.data);
			// console.log(buisnessLogic.getScaleFactorForModelId(this.data.model));

			Promise.all(this.el.getObject3D(this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME)).children).then(
				(arr) => {
      		scope.data.modelIsLoaded = true;
				}
			)


			this.el.getObject3D(this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME)).scale.set(
				buisnessLogic.getScaleFactorForModelId(this.data.model),
				buisnessLogic.getScaleFactorForModelId(this.data.model),
				buisnessLogic.getScaleFactorForModelId(this.data.model)
			)
			// obj.scale.x = obj.scale.x *buisnessLogic.getScaleFactorForModelId(scope.modelID);
			// obj.scale.y = obj.scale.y *buisnessLogic.getScaleFactorForModelId(scope.modelID);
			// obj.scale.z = obj.scale.z *buisnessLogic.getScaleFactorForModelId(scope.modelID);

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
				// this.system.getModelPath(this.data.id),
				this.data.url,
				onModelLoadBinded
			);

			this.el.setAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME, this.data.id);

      // note not sure why I add this to
			this.el.addEventListener(
				'click',
				(function (scope) {
					return function (evt) {

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

				// debugger;
				let self = this;
				this.el.getObject3D(this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME)).children
				.map(
					(child) => {
						// debugger
						child.material = this.system.getMaterialById(
							self.data.configuration[child.name]
						);

						// if (child.geometry) {
						// 	console.log(`child ${child.name} is ok`);
						// } else {
						// 	console.log(`child ${child.name} is bad`);
						// }


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
			uistate: { type: 'boolean', default: false},
			uiposition: { type: 'vec3', default: '0 0 20'},
			nextFreeSpote: { type: 'vec3', default: '0 0 20'}
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

			this.ui.setAttribute( "component-padding", "0.1" );
			this.ui.setAttribute( "opacity", "0.8" );
			this.ui.setAttribute( "width", "4.5" );
			this.ui.setAttribute( "height", "3.0" );
			this.ui.setAttribute( "position", "0 0 15" );
			this.ui.setAttribute( "rotation", "0 0 0" );

      // children button
			// this.button = document.createElement('a-gui-button');
			_.map(
				this.configuratorSystem.getConfigurationLogicFor(this.el.getAttribute(CONFIGURATOR_ID_ATRIBUTE_NAME)), //configurationLogic
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

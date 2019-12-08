import './a-configurator-system';
import _ from 'lodash';

const CONFIGURATOR_ID_ATTRIBUTE_NAME = 'configuratorId';

AFRAME.registerComponent(
	'configurator',
	{
		schema: {
			id: {type: 'int'},
			model: {type: 'string'},
			url: {type: 'string', default: 'path non specificato'},
			loaded: {type: 'boolean', default: 'false'}
			// configuration: {type: 'object'}
		},

		onModelLoad: function (obj) {
			this.el.setObject3D(
				'mesh',
				obj.scene.children.reduce(
					(rootObj, singleMesh) => {

						rootObj.add(singleMesh);
						singleMesh.material = this.system.getConfigurationForIdAndMesh(this.data.id , singleMesh.name);
						// singleMesh.material = this.system.getSelectedMaterialForModelMesh('testingcube' , singleMesh.name);

						// debugger;
						return rootObj;
					},
					new THREE.Object3D()
				)
			);


			// this.el.setAttribute('testcomponent', '')

		},
		init: function () {
      // a-frame gltf-model init method, since I don't know if there is a way
      // to extend existent
			this.system.registerConfigurableObject(
				this.data.id,
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

			this.el.setAttribute(CONFIGURATOR_ID_ATTRIBUTE_NAME, this.data.id);

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
									console.log(item);
								}
							}
						);

						// let document.createElement('a-entity');
					}
				})(this)

			)
			// debugger;
		},
		update: function () {}
	}
)


AFRAME.registerComponent(
	'configurator-ui-manager',
	{
		schema: {
			uistate: {type: 'boolean', default: false}
		},

		addButtonsForConfigurablePart: function (buttonsDescription) {
			console.log(this);
			if (!this.ui) {
				throw new Error('Ui object wasn\'t defined');
			}
			Object.keys(buttonsDescription).map(
				(meshName) => {
					let offset = 0.4;
					buttonsDescription[meshName].map(
						(btnDefinition) => {
							console.log(btnDefinition);
							debugger;

							let buttonActiveColor = this.configuratorSystem.data.buttonActiveColor;
							let	buttonBorderColor = this.configuratorSystem.data.buttonBorderColor;

							let button = document.createElement('a-gui-button');

							button.setAttribute('active-color', buttonActiveColor);
							button.setAttribute('border-color', buttonBorderColor);
							button.setAttribute('font-family', 'Serif');
							button.setAttribute('margin', `0 0 ${offset} 0`);
							button.setAttribute('value', `${offset}`);

							offset += 0.01;

							this.ui.appendChild(button);
						}

					);
				}
			);

		},

		init: function () {
			this.configuratorSystem = document.querySelector('a-scene').systems['configurator'];
			// console.log(this.el.getAttribute(CONFIGURATOR_ID_ATTRIBUTE_NAME));
			let currentConfiguration = this.configuratorSystem.getConfigurationById(this.el.getAttribute(CONFIGURATOR_ID_ATTRIBUTE_NAME));
			let configurationLogic = this.configuratorSystem.getConfigurationLogicFor(this.el.getAttribute(CONFIGURATOR_ID_ATTRIBUTE_NAME));


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
				this.configuratorSystem.getConfigurationLogicFor(this.el.getAttribute(CONFIGURATOR_ID_ATTRIBUTE_NAME)),
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

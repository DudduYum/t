import AFrameCustomProperty from '../../utils/aframeCustomProperty.js';
import _ from 'lodash';
import {constants} from '../../common/commonConstants.js';
let Promise = require('bluebird');
// deprecated
// const onConfigurationChangeEventName = 'currentUserChangeConfiguration';
global.onConfigurationChangeEventName = constants.onConfigurationChangeEventName;
// global.onConfigurationChangeEventName = onConfigurationChangeEventName;

AFRAME.registerSystem(
	'configurator',
	{
		schema: {
	    dracoDecoderPath: {default: ''},

      // colors & layouts
			configurationPanelColor: {type: 'string'},
			buttonBorderColor: {type: 'string'},
			buttonActiveColor: {type: 'string'},

      // client side propertys
			updateRequest: AFrameCustomProperty.getObjectProperty(),


      // both side properties
      // array that contains all materials
			materialLibrary: {type: 'array'},

      // dictinary that contains <model name> => <path to model>
			modelList: AFrameCustomProperty.getObjectProperty(),

			configurationLogic: AFrameCustomProperty.getObjectProperty(),
			configuration: AFrameCustomProperty.getObjectProperty(),
			configurableObjects: AFrameCustomProperty.getObjectProperty(),
			materials: AFrameCustomProperty.getObjectProperty()
			// configuration: {
			// 	default: '{}',
			// 	parse: function (value) {
			// 		return JSON.parse(value);
			// 	},
			// 	stringify: function (value) {
			// 		return JSON.stringify(value);
			// 	}
			// },
	  },

		init: function() {
			var path = this.data.dracoDecoderPath;
			this.dracoLoader = new THREE.DRACOLoader();
			this.dracoLoader.setPath(path);

			this.textureLoader = new THREE.TextureLoader();

			// register the event listetener for configuration update
			global.emiter.on(
				'configurationObjectUpdate',
				function(arg) {
					// NOTE: now you must update the current system state
					// with the new parameters caming from the server
				}
			);



			this.data.configurationPanelColor = '#cccfff';
			this.data.buttonBorderColor = '#42fc10';
			this.data.buttonActiveColor = '#cccfff';


			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({
				color: '#333'
			}));
			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({
				color: 'green'
			}));
			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({
				color: 'red'
			}));
			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({
				color: 'blue'
			}));
			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({
				color: '#531'
			}));

			this.data.modelList.testingcube = 'models/testingcube.glb';


			// this object take trace of which configurable
			// object use which model
			this.data.configurableObjects.testingcube = {};

			this.data.updateRequest.testingcube = {};

			this.data.configurationLogic.testingcube = {};
			this.data.configurationLogic.testingcube.meshes = {};
			this.data.configurationLogic.testingcube.meshes.Cube = [1, 3];

			this.data.configurationLogic.susan = {};
			this.data.configurationLogic.susan.meshes = {};
			this.data.configurationLogic.susan.meshes.Suzanne = [8, 2];

			this.data.configurationLogic.house = buisnessLogic.getConfigurationLogicForSystem('house');


			// global[constants.changeConfigurationHandlerEventName] = this.changeConfiguration.bind(this);
			// debugger
			global.changeConfigurationHandler = this.changeConfiguration.bind(this);
		},

		loadMaterial: function (materialDefinition, materialID) {
			const scope = this;
			let lilP = _.reduce(
				materialDefinition,
				function (acc, value, key) {
					if (key == 'map' || key == 'normalMap' || key == 'aoMap') { // NOTE: compleate the list
						acc.push(
							Promise.join(
								Promise.resolve(key),
								new Promise(
									(res, rej) => {
										scope.textureLoader.load(
											value,
											function(tx) {
												tx.wrapS = THREE.RepeatWrapping;
												tx.wrapT = THREE.RepeatWrapping;
												tx.repeat.set(1, 1);
												res(tx);
											}
										)
									}
								),
								function (k, v) {
									return {[k]:v};
								}
							)
						);
					} else {
						acc.push(
							Promise.join(
								Promise.resolve(key),
								Promise.resolve(value),
								function (k, v) {
									return {[k]:v};
								}
							)
						);
					}
					return acc;
				},
				[]
			);

			Promise.all(lilP)
			.then(
				(res) => {

					this.data.materials[materialID] = new THREE.MeshStandardMaterial(
						res.reduce(
							(acc, item) => {
								// debugger
								return Object.assign(acc, item);
							},
							{}
						)
					);



					this.data.materials[materialID].side = THREE.DoubleSide;
				}
			)
			// .all();

			materialDefinition
		},


		// API
		// this method return material by material id,
		// all configurators know their configuration, the thing they don't know
		// are what corresponde to that material idnx, so they knowlage lakes
		// material definition
		getMaterialById: function (materialID) {
			// return this.data.materialLibrary[Math.round(Math.random() * this.data.materialLibrary.length)];
			// _.forEach(
			// 	global.buisnessLogic.getMaterialById(materialID),
			// 	function (value, key, collection) {
			// 		if (key == 'map') {
			// 			collection[key] = new THREE.Textru
			// 		}
			// 	}
			// );
			let currentMaterial;
			if (this.data.materials[materialID]) {
				// console.log('here');
				currentMaterial = this.data.materials[materialID];
			} else {
				this.loadMaterial(
					global.buisnessLogic.getMaterilDefinitionById(materialID),
					materialID
				);
				currentMaterial = new THREE.MeshStandardMaterial({color: '#423'})
			}

			return currentMaterial;
			// return global.buisnessLogic.getMaterialById(materialID);
			// return this.data.materialLibrary[materialID];
		},
			// return this.data.materialLibrary[Math.round(Math.random() * this.data.materialLibrary.length)];


		getDefaultMaterial: function () {
      // NOTE: this is usefull, but right now it's not correct,
      // it must return material not it index

			return 0;
		},

    // API
		/*needed to register a configurable object in to a system
		this way you just need an object id
		to configure the object apearence and there will be
		less information to exchage toword othe user*/
		registerConfigurableObject: function (id, configuration, model) {

      // register an id as a model
			this.data.configurableObjects[id] = model;


      // initialize the configuration
			const scope = this;

			// the first initialization, right now
      // it's static, each object is initialized
      // in exactly same way. Later on I will
      // think about some better way to initialize
			this.data.configuration [id] = _.reduce(
				this.data.configurationLogic[model].meshes,
				function (conf, optList, mesh) {
					conf[mesh] = _.head( optList );

					if (!conf[mesh]) {
						conf[mesh] = scope.getDefaultMaterial();
					}

					return conf;
				},
				{}
			);
			this.data.configuration [id] = ['meshes'].reduce(
				(acc, meshes) => {

					return {
						'meshes': acc
					};
				},
				configuration
			);
			this.data.configuration [id] = configuration;
			// request configuration update
      // it's not the best way to pass staff
			this.data.updateRequest[id] = true;
		},

    // API
    /*when you create an gameobject you just tell it which model
		it should load to the scene not where to find the model,
		this method is used to get the path to the model, this way
		the models may be stored wherever the dev want without
		brake anything
		You just need the id of an object to get its model path,
		becouse the system already knows which model was assingned
		to the object*/
		getModelPath: function (id) {
			return this.data.modelList[this.data.configurableObjects[id]]
		},

    // API
		isUpdateNeeded: function (id) {
			return this.data.updateRequest[id];
		},

		getUpdateRequirements: function (id) {
			const update = this.data.updateRequest[id];

			this.data.updateRequest[id] = false;

			return update;

		},

    // API
		/*this method gives you info about how to configure the
		model*/
		getConfigurationById: function (id) {
			return this.data.configuration[id];
		},


		/*the same as the method above but more specific*/
		getConfigurationForIdAndMesh: function (id, mesh) {

			return this.data.materialLibrary[
				this.data.configuration[id][mesh]
			];

		},

    /*this function is called on every update configuration, there
		is no way right now to connect to configurators and force them to apply
		new changes, so for this task the system just lanch an event with
		default name, each configurator is listening for the event and decide
		if it must do something with it.*/
		changeConfiguration: function (argv) {

			// this.data.updateRequest[argv[0]] = true;
			global.emiter.emit(
				constants.onConfigurationChangeEventName,
				// NOTE: this event will be consumed by clientClass
				argv
			);


		},

    /*UPDATING MANAGMENT*/
		isUpdateIsNeeded: function (id) {
			return this.data.updateRequest[id];
		},

		registerAccomplishedUpdate: function (id) {
			this.data.updateRequest[id] = false;
		},

		getConfigurationLogicFor: function (configurableObjectID) {
			return this.data.configurationLogic[
				this.data.configurableObjects[configurableObjectID]
			];
		},



		getMaterialsForConfigurableObject: function (model, meshname) {
			return this.data.materialLibrary[this.data.configurableObjects[model].meshes[meshname]];
		},

		getSelectedMaterialForModelMesh: function (model, meshname) {
			return this.data.materialLibrary[this.data.configuration[model].meshes[meshname]];
		},

		getMaterialListForModelMesh: function (model, meshname) {
			return this.data.materialLibrary[this.data.configuration[model].meshes[meshname]];
		},

	  update: function () {
	    var path;
	    if (this.dracoLoader) { return; }
	    path = this.data.dracoDecoderPath;
	    this.dracoLoader = new THREE.DRACOLoader();
	    this.dracoLoader.setPath(path);
	  },

	  getDRACOLoader: function () {
	    return this.dracoLoader;
	  },

		configureObject: function (configurableObjectID, configurationUpdate) {
			this.data.configuration
		}
	}
);

import AFrameCustomProperty from '../../utils/aframeCustomProperty.js';

AFRAME.registerSystem(
	'configurator',
	{
		schema: {
	    dracoDecoderPath: {default: ''},

      // colors & layouts
			configurationPanelColor: {type: 'string'},
			buttonBorderColor: {type: 'string'},
			buttonActiveColor: {type: 'string'},

      // array that contains all materials
			materialLibrary: {type: 'array'},

      // dictinary that contains <model name> => <path to model>
			modelList: AFrameCustomProperty.getObjectProperty(),

			// configuration: {
			// 	default: '{}',
			// 	parse: function (value) {
			// 		return JSON.parse(value);
			// 	},
			// 	stringify: function (value) {
			// 		return JSON.stringify(value);
			// 	}
			// },
			configuration: AFrameCustomProperty.getObjectProperty(),
			configurableObjects: AFrameCustomProperty.getObjectProperty(),
			configurationLogic: AFrameCustomProperty.getObjectProperty()
	  },

		/*needed to register a configurable object in to e system
		this way you just need an object id mesh name, and material
		index to configure the object apearence and there will be
		less information to exage toword othe user*/
		registerConfigurableObject: function (id, model) {
			this.data.configurableObjects[id] = model;
		},

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


		/*this method gives you info about how to configure the
		model*/
		getConfigurationById: function (id) {
			return this.data.configuration[this.data.configurableObjects[id]]
		},


		/*the same as the method above but more specific*/
		getConfigurationForIdAndMesh: function (id, mesh) {

			return this.data.materialLibrary[
				this.data.configurationLogic[
					this.data.configurableObjects[id]
				].meshes[mesh][0]
				];
		},


		getConfigurationLogicFor: function (configurableObjectID) {
			return this.data.configurationLogic[
				this.data.configurableObjects[configurableObjectID]
			];
		},

	  init: function () {
	    var path = this.data.dracoDecoderPath;
	    this.dracoLoader = new THREE.DRACOLoader();
	    this.dracoLoader.setPath(path);

			this.data.configurationPanelColor = '#cccfff';
			this.data.buttonBorderColor = '#42fc10';
			this.data.buttonActiveColor = '#cccfff';

			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({color:'green'}));
			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({color:'red'}));
			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({color:'blue'}));
			this.data.materialLibrary.push(new THREE.MeshBasicMaterial({color:'#531'}));

			this.data.modelList.testingcube = 'models/testingcube.glb';

			this.data.configuration.testingcube = {};
			this.data.configuration.testingcube.meshes = {};
			this.data.configuration.testingcube.meshes.Cube = 3;

      // this object take trace of which configurable
      // object use which model
			this.data.configurableObjects.testingcube = {};

			this.data.configurationLogic.testingcube = {};
			this.data.configurationLogic.testingcube.meshes = {};
			this.data.configurationLogic.testingcube.meshes.Cube = [0, 3];
	  },

		getMaterialsForConfigurableObject: function (model, meshname) {
			return this.data.materialLibrary[this.data.configurableObjects[model].meshes[meshname]];
		},

		getSelectedMaterialForModelMesh: function (model, meshname) {
			return this.data.materialLibrary[this.data.configuration[model].meshes[meshname]];
		},

		getMaterialListForModelMesh: function (model, meshname) {
			debugger;
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

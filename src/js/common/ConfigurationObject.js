import {
	BaseTypes,
	GameObject
} from 'lance-gg';

import {
	KeyArrayParameter,
	KeyPropertyParameter
} from './configurationParameter.js';


export default class ConfigurationObject extends GameObject {
	constructor (gameEngine, options, props) {
		super(gameEngine, options, props);




	}


	// init () {
	// 	this.
	// }
	setConfiguration (id, mesh, material) {
    // not yet
		// this.configurationKeys[id][mesh] = [material];
	}

	registerConfigurableObject (id, model) {

	}

	syncTo(other) {
		super.syncTo(other);

		// emiter.emit(
		// 	'configurationObjectUpdate', // must be moved to constant declaration file
		// 	{
		// 		update: Object.fromEntries(
		// 			other.configurationLogicKeys,
		// 			other.configurationLogicValues
		// 		)
		// 	}
		// );

		// this.configurationLogic = other.configurationLogic;

		// this.modelListKeys = other.modelListKeys;
		// this.modelListValues = other.modelListValues;
    //
		// this.configurationLogicKeys = other.configurationLogicKeys;
		// this.configurationLogicValues = other.configurationLogicValues;
    //
		// this.configurationKeys = other.configurationKeys;
		// this.configurationValues = other.configurationValues;
    //
		// this.configurableObjectsKeys = other.configurableObjectsKeys;
		// this.configurableObjectsValues = other.configurableObjectsValues;
	}

	static get netScheme() {
		return Object.assign(
			{
				// configurationLogic: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.CLASSINSTANCE
				// }

				// ,
        //
				// modelListKeys: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.INT16
				// },
				// modelListValues: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.INT16
				// },
        //
				// configurationLogicKeys: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.INT16
				// },
				// configurationLogicValues: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.INT16
				// },
        //
				// configurationKeys: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.INT16
				// },
				// configurationValues: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.INT16
				// },
        //
				// configurableObjectsKeys: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.INT16
				// },
				// configurableObjectsValues: {
				// 	type: BaseTypes.TYPES.LIST,
				// 	itemType: BaseTypes.TYPES.INT16
				// },
			},
			super.netScheme
		);
	}
}

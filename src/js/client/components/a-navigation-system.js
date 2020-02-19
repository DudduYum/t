import AFrameCustomProperty from '../../utils/aframeCustomProperty.js';
import _ from 'lodash';
import {constants} from '../../common/commonConstants.js';
let Promise = require('bluebird');
// deprecated
// const onConfigurationChangeEventName = 'currentUserChangeConfiguration';
global.onConfigurationChangeEventName = constants.onConfigurationChangeEventName;
// global.onConfigurationChangeEventName = onConfigurationChangeEventName;

AFRAME.registerSystem(
	'navigation',
	{
		schema: {
			needToReadMovements: {type: 'boolean', default: 'false'}
	  },

		init: function() {



		},

		setReadFlag: function () {
			
			this.data.needToReadMovements = true;
		},

		getReadFlag: function () {
			let res = this.data.needToReadMovements;

			this.data.needToReadMovements = false;

			return res;
		},

	  update: function () {

	  }

	}
);

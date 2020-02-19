import './a-navigation-system';
import _ from 'lodash';
import AFrameCustomProperty from '../../utils/aframeCustomProperty.js';

import {constants} from '../../common/commonConstants.js';

AFRAME.registerComponent(
	'navigator',
	{
		schema: {
			'isRayCasting': {type: 'boolean', default: false}
		},

		addButtonsForConfigurablePart: function (position, offset) {
			if (!this.ui) {
				throw new Error('Ui object wasn\'t defined');
			}

			let buttonActiveColor = this.configuratorSystem.data.buttonActiveColor;
			let	buttonBorderColor = this.configuratorSystem.data.buttonBorderColor;

			let button = document.createElement('a-gui-button');

			button.setAttribute('active-color', buttonActiveColor);
			button.setAttribute('border-color', buttonBorderColor);
			button.setAttribute('font-family', 'Serif');
			button.setAttribute('margin', `0 0 ${offset} 0`);
			button.setAttribute('value', `${offset}`);
			button.setAttribute('onclick', `${constants.changeUserPositionFunction}("${position}")`);
			button.setAttribute('onhover', 'testfunction');

		},

		init: function () {

			this.el.addEventListener(
				'raycaster-intersected',
				this.movementHandler.bind(this)
				// function (ev) {
				// 	console.log('It\s me dio');
				// 	console.log(ev.detail.getIntersection());
				// }
			);
			constants.fireRayCast
			debugger
			global.emiter.on(
				constants.fireRayCast,
				this.requestRayCast.bind(this)
			);
		},

		requestRayCast () {
			console.log('hi it\'s me tesi');
		},

		movementHandler: function (ev) {

			console.log('It\s me dio');
			console.log(ev.detail.getIntersection());
			// this.
		},

		update: function () {
		}
	}
)


AFRAME.registerComponent(
	'collider-check',
	{
		dependencies: ['raycaster'],
		schema: {
			position: {type: 'vec3'}
		},

		addButtonsForConfigurablePart: function (position, offset) {
			if (!this.ui) {
				throw new Error('Ui object wasn\'t defined');
			}

			let buttonActiveColor = this.configuratorSystem.data.buttonActiveColor;
			let	buttonBorderColor = this.configuratorSystem.data.buttonBorderColor;

			let button = document.createElement('a-gui-button');

			button.setAttribute('active-color', buttonActiveColor);
			button.setAttribute('border-color', buttonBorderColor);
			button.setAttribute('font-family', 'Serif');
			button.setAttribute('margin', `0 0 ${offset} 0`);
			button.setAttribute('value', `${offset}`);
			button.setAttribute('onclick', `${constants.changeUserPositionFunction}("${position}")`);
			button.setAttribute('onhover', 'testfunction');

		},

		init: function () {
			// this.enabled = false;
			this.el.setAttribute(
				'raycaster',
				{
					objects:'.clickable',
					enabled:false
				}
				// 'objects:.clickable;enabled:true'
			)
			this.el.addEventListener(
				'raycaster-intersection',
				function (ev) {
					// console.log('Hi may be I made it');
					// console.log(ev);
					// debugger
				}
			);
			this.el.addEventListener(
				'raycaster-intersected',
				function (ev) {
					// console.log('Hi may be I made it');
					console.log(ev);
					debugger
				}
			);
		},

		registerTheRayCaster: function () {

		},
		tick: function () {
			// debugger
	    if (!this.raycaster) { return; }  // Not intersecting.

	    let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
	    if (!intersection) { return; }
	    console.log(intersection.point);
	  },

		update: function () {
		}
	}
)


AFRAME.registerComponent(
	'raycaster-listener',
	{
		init: function () {
			this.sys = document.querySelector('a-scene').systems['navigation'];

	    // Use events to figure out what raycaster is listening so we don't have to
	    // hardcode the raycaster.
	    this.el.addEventListener('raycaster-intersected', evt => {
	      this.raycaster = evt.detail.el;
	    });
	    this.el.addEventListener('raycaster-intersected-cleared', evt => {
	      this.raycaster = null;
	    });
	  },

	  tick: function () {
	    if (!this.raycaster || !this.sys.getReadFlag()) { return; }  // Not intersecting.

	    let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
	    if (!intersection) { return; }
	    // console.log(intersection.point);
			global.emiter.emit(
				constants.movementEvent,
				{
      		movement: intersection.point
				}
			);
	  }
	}
)

AFRAME.registerComponent(
	'cursor-listener',
	{
	  init: function () {
			this.sys = document.querySelector('a-scene').systems['navigation'];
	    this.el.addEventListener(
				'click',
				this.emitTheEvent.bind(this)
			);
	  },
		emitTheEvent: function () {
			this.sys.setReadFlag();
		}
	}
);

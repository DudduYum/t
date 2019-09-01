import ConfiguratorLogicEngine from 'js/common/ConfiguratorLogicEngine';
import ServiceUserEngine from 'js/client/ServiceUser';
import ObservableObject from '../js/common/ObservableObject.js';
import * as aframe from 'aframe';


global = Object.assign(
	global,
	aframe
);

console.warn(aframe);


let $ = require('jquery');

var serviceLogic = new ConfiguratorLogicEngine(
	{
		traceLevel: 4
		// delayInputCount: 2
	}
);

var serviceEngine = new ServiceUserEngine(
	serviceLogic,
	{
		verbose: true,
		scheduler: 'render-schedule',
		syncOptions: {
			sync: 'interpolate'
		},
		autoConnect: true
	}
);

global.serviceEngine = serviceEngine;


$('body').keypress((e) => {
	// console.log(e.originalEvent.key);
	serviceEngine.sendInput(
		{
			index: Math.round(Math.random() * 3),
			value: e.originalEvent.key
		},
		{}
	);
})


document.addEventListener('DOMContentLoaded', function(e) { serviceEngine.start(); });

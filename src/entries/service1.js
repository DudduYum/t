import { Lib } from 'lance-gg';
import * as aframe from 'aframe';
import ConfiguratorLogicEngine from 'js/common/ConfiguratorLogicEngine';
import ServiceUserEngine from 'js/client/ServiceUser';
import ObservableObject from '../js/common/ObservableObject.js';


global = Object.assign(
	global,
	aframe
);



let $ = require('jquery');

const options = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 3,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: 'extrapolate',
        localObjBending: 0.6,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    },
    autoConnect: true
};

var serviceLogic = new ConfiguratorLogicEngine( options );

var serviceEngine = new ServiceUserEngine(
	serviceLogic,
	options
);

global.serviceEngine = serviceEngine;


$('body').keypress((e) => {
	serviceEngine.sendInput(
		{
			index: Math.round(Math.random() * 3),
			value: e.originalEvent.key
		},
		{}
	);
});



document.addEventListener('DOMContentLoaded', function(e) { serviceEngine.start(); });

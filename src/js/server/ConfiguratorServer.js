// import {ServerEngine} from 'lance/server/lance-gg';
// var ServerEngine = require('lance/server/lance-gg').ServerEngine;
// import ServerEngine from 'lance/ServerEngine';
import {ServerEngine} from 'lance/server-module/lance-gg';

export default class ServiceServer extends ServerEngine {
	constructor (io, gameEngine, ioptions) {
		super(io, gameEngine, ioptions);

		console.log('server has been initialized');
	}

	start () {
		super.start();

		console.log('start a server');
	}

	createRoom (rN, conf) {
		super.createRoom(rN);

		console.log('room has been created!');
	}
}

// Game Server
import {Lib} from 'lance-gg';
import ServiceServer from 'src/js/server/ConfiguratorServer';
import ServiceLogic from 'src/js/common/ConfiguratorLogicEngine';


const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
// const buildDir = 'dist';
const buildDir = 'dist';

const PORT = process.env.PORT || 3000;
const serviceName = 'app';
const INDEX = path.join(__dirname, `../${buildDir}/${serviceName}.html`);
const LOGIC = path.join(__dirname, `../${buildDir}/${serviceName}.js`);
const ASSETS = path.join(__dirname, `../${buildDir}/assets`);

// // define routes and socket
const server = express();

// console.log(path.join(__dirname, buildDir));

server.use(
	'/',
	express.static(
		path.join(
			__dirname,
			buildDir
		)
	)
);

server.use(
	express.static(
		ASSETS
	)
);

server.get(
	'/',
	function (req, res) {
		res.sendFile(INDEX);
	}
);

server.get(
	`/${serviceName}.js`,
	function (req, res) {
		res.sendFile(LOGIC);
	}
);

let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Instances
var confyLogic = new ServiceLogic({ traceLevel: Lib.Trace.TRACE_NONE });
global.hand = confyLogic;

var confyServer = new ServiceServer(
	io,
	confyLogic,
	{
		debug: {},
    updateRate: 6,
    timeoutInterval: 0 // no timeout
	}
);

// console.log('test 11111');
confyLogic.on(
	'server__playerJoined',
	() => {
		console.log('yes');
	}
);

// start the game
confyServer.start();

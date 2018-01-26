"use strict";

import * as Glue from "glue";
import * as Hapi from "hapi";
import {config} from "./config";
import {Route} from "./route";

let plugin: any = [
    {
        plugin: {
            register: "good",
            options: {
                includes: {
                    request: ['payload', 'headers'],
                    response: []
                },
                ops: {
                    interval: 50000
                },
                wreck: true,
                reporters: {
                    logReporter: [{
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{
                            "response": "*"
                        }]
                    }, {
                        module: 'good-squeeze',
                        name: 'SafeJson'
                    }, {
                        module: 'rotating-file-stream',
                        args: [
                            'audit.log',
                            {
                                size: '50M',
                                path: config.APP_LOG_PATH
                            }
                        ]
                    }],
                    opsReporter: [{
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{
                            ops: '*'
                        }]
                    }, {
                        module: 'good-squeeze',
                        name: 'SafeJson'
                    }, {
                        module: 'rotating-file-stream',
                        args: [
                            'operational.log',
                            {
                                size: '50M',
                                path: config.APP_LOG_PATH
                            }
                        ]
                    }],
                    errorReporter: [{
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{
                            "log": "*"
                        }]
                    }, {
                        module: 'good-squeeze',
                        name: 'SafeJson',
                        args: [{
                            error: '*'
                        }]
                    }, {
                        module: 'rotating-file-stream',
                        args: [
                            'error.log',
                            {
                                size: '50M',
                                interval: "1d",
                                path: config.APP_LOG_PATH
                            }
                        ]
                    }]
                }
            }
        }
    }
];

plugin = plugin.concat(Route);

const manifest = { 
    server: {
        "load": {
            "sampleInterval": 1000
        }
    },
    connections: [{
        host: "0.0.0.0",
        port: config.PORT,
        "load": config.LOAD_CONFIG
    }],
    registrations: plugin
};

const composeOptions: Object = {
    relativeTo: __dirname
};

Glue.compose(manifest, composeOptions, (err, server) => {
    server.start((serverStartError) => {
        console.info('Application running at: ' + server.info.uri);
        if (serverStartError) {
            //Add Logging
            console.error('Server running at: ' , serverStartError);
        }
    });
});
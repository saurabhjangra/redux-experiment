/*
* @Author: Deepak Kumar Mishra
* @Date:   2017-01-04
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2017-01-04 11:33:26 am
*/
// This plugin is used to enabled api documentation with tag specified in routes
import hapiMultiMongo from 'hapi-multi-mongo';
import config from '../config';

var dbOpts = {
    "connection": [
        "mongodb://localhost:27017/example", {
            uri: "mongodb://localhost:27017/viator",
            name: "viator"
        }, {
            uri: "mongodb://localhost:27017/example",
            name: "example"
        }
    ],
    "options": {
        "db": {
            "native_parser": false,
            fsync: false
        },
        promiseLibrary: require('bluebird')
    }
};

export default {
    plugin : {
        register: hapiMultiMongo,
        options: dbOpts

    },
    next : function (server, error) {
        if (error) {
            return server.log(['error'], 'Fail to install plugin: mongodb-connection...');
        }
        return server.log(['info'], 'Installed plugin: mongodb-connection.');
    }
};

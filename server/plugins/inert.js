/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/
// This plugin is prerequist of hapi-swagger
import Inert from 'inert';

export default {
	plugin: {
		register: Inert
	},
	next: function (server, error) {
		if (error) {
			return server.log(['error'], 'Fail to install plugin: inert...');
		}
		return server.log(['info'], 'Installed plugin: inert.');
	}
};

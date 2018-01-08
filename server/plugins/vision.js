/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/
// This plugin is prerequist of hapi-swagger
import Vision from 'vision';

export default {
	plugin: {
		register: Vision
	},
	next: function (server, error) {
		if (error) {
			return server.log(['error'], 'Fail to install plugin: vision...');
		}
		return server.log(['info'], 'Installed plugin: vision.');
	}
};

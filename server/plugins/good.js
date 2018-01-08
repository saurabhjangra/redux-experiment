/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/

// This plugin is used to enable logging for request, response, log, error
import Good from 'good';
import config from '../config';

export default {
	plugin: {
		register: Good,
		options: config.logger
	},
	next: function (server, error) {
		if (error) {
			return server.log(['error'], 'Fail to install plugin: good...');
		}
		return server.log(['info'], 'Installed plugin: good.');
	}
};

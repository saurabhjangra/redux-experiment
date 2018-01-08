/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/
// This plugin is used to enabled role based acl
import HapiAuthorization from 'hapi-authorization';
import config from '../config';

export default {
	plugin: {
		register: HapiAuthorization,
		options: config.acl
	},
	next: function (server, error) {
		if (error) {
			return server.log(['error'], 'Fail to install plugin: hapi-authorization...');
		}
		return server.log(['info'], 'Installed plugin: hapi-authorization.');
	}
};

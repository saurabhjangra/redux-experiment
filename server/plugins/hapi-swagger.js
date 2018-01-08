/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/
// This plugin is used to enabled api documentation with tag specified in routes
import HapiSwagger from 'hapi-swagger';
import pack from '../../package';

export default {
	plugin: {
		register: HapiSwagger,
		options: {
			info: {
				title: 'Dpauls-Json-Api',
				version: pack.version,
				contact: {
					'name': 'Deepak Mishra',
					'email': 'deepak.kumar@dpaulsonline.com'
				},
			}
		}
	},
	next: function (server, error) {
		if (error) {
			return server.log(['error'], 'Fail to install plugin: hapi-swagger...');
		}
		return server.log(['info'], 'Installed plugin: hapi-swagger.');
	}
};

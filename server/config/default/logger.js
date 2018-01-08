/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/
import GoodWinstonReporter from 'good-winston-reporter';
import Winston from 'winston';
export default {
	// This parameter is used to report the operation status for every opsInterval mini-seconds
	// opsInterval: 1000,
	reporters: [{
		reporter: GoodWinstonReporter,
		events: {
			log: '*',
			request: '*',
			response: '*',
			error: '*'
		},
		config: {
			logger: Winston
		}
	}]
};

/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2017-06-21 02:04:46
*/

import defaultConfig from './default';
import prodConfig from './env_prod';
import devConfig from './env_dev';
import stgConfig from './env_stg';
import preprodConfig from './env_preprod';

let config = {};

/* eslint-disable no-process-env */

switch (process.env.NODE_ENV || 'development') {
	case 'staging':
		config = { ...defaultConfig, ...stgConfig };
		break;

	case 'preproduction':
		config = { ...defaultConfig, ...preprodConfig };
		break;

	case 'production':
		config = { ...defaultConfig, ...prodConfig };
		break;

	case 'development':
	default:
		config = { ...defaultConfig, ...devConfig };
		break;
}
/* eslint-enable no-process-env */
export default config;

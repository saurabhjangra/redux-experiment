/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2017-06-21 02:03:46
*/
// This config will be used if process.env.NODE_ENV is set to 'development'
import defaultConfig from './default';

defaultConfig.server.port = 8066;

export default {
    defaultConfig
};

/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/
// The catbox-redis is used to cache the result of server.methods or server.cache into redis database 
import CatboxRedis from 'catbox-redis';
import 'dotenv/config';
export default {
	// host name
	host: process.env.SERVER_HOST || 'localhost',
	// port number
	port: process.env.SERVER_PORT || 8080,
	// here is the option initalizing hapi server
	options: {
		cache: [
			{
				name: 'redis',
				engine: CatboxRedis,
				host: process.env.REDIS_HOST || '127.0.0.1',
				port: process.env.REDIS_PORT || 6379,
				partition: 'cache'
			}
		]
	}
};

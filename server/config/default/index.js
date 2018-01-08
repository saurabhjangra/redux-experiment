/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/
import server from './server';
import acl from './acl';
import auth from './auth';
import database from './database';
import logger from './logger';
import methods from './methods';
import routes from './routes';
import email from './email';

export default {
	server: server,
	acl: acl,
	auth: auth,
	database: database,
	logger: logger,
	methods: methods,
	routes: routes,	
	email: email
};

/*
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2017-06-28 10:45:46
*/
// The models to be included, the format exported from modules should be

import models from '../../models';
import 'dotenv/config';
export default {
	// Mongo DB Connection Strings

	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 27017,
	database: process.env.DB_DATABASE || 'example',
	//username: 'admin',
	//password: 'shivalik',
	// the options passed to mongoose when connect
	options: {useMongoClient: true},
	// array of mongoose models
	models: [models]
};

/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/

import aguid from 'aguid';
import Boom from 'boom';
import Joi from 'joi';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';
import User from '../models/user/user';
import config from '../config';

const bcryptAsync = Promise.promisifyAll(bcrypt);

const Errors = {
	emailIncorrect: 'The email address is incorrect.',
	passwordIncorrect: 'The password is incorrect.'
};

export { Errors as errors };

const Validators = {
	authorization: Joi.string().description('The access token obtained when login.').required()
};

export { Validators as validators };

export default {
	login: {
		auth: false,
		tags: ['auth', 'api'],
		description: 'Login to the webpage to get the access token, the access token is cached in server side for later verification.',
		validate: {
			payload: {
				password: Joi.string().required(),
				email: Joi.string().required()
			}
		},
		handler: {
			async: async function (request, reply) {
				// get the user from the request payload
				const user = await User.findOne({ email: request.payload.email }, { updatedAt: 0 }).exec();
				// if user not found, return an unauthorized status code
				if (!user) {
					throw Boom.unauthorized(Errors.emailIncorrect);
				} else {
					// check if password is valid by using bcrypt compare
					const valid = await bcryptAsync.compareAsync(request.payload.password, user.password);

					// check if request ip address is same as user database ip

					// if it is valid, construct a cookie options since we use cookie to store the access token
					if (valid) {
						user.password = '';
						// sign the token
						const sessionId = aguid();
						const session = await request.server.methodsAsync.session(sessionId, { id: sessionId, userId: user.id, role: user.role });
						const token = await request.server.methodsAsync.sign(session);
						return reply(user)/* .header('authorization', token).state('access_token', token, config.auth.cookieOptions); */
						// DO NOT SET COOKIE TO PREVENT XSRF ATTACK
						// .state(cookieKey, token, request.cookieOptions);
					}
					throw Boom.unauthorized(Errors.passwordIncorrect);
				}
			}
		}
	},
	logout: {
		auth: 'jwt',
		tags: ['auth', 'api'],
		validate: {
			headers: Joi.object({
				authorization: Validators.authorization
			}).unknown()
		},
		description: 'Logout to clean the session from server cache and expire the access token.',
		handler: {
			async: async function (request, reply) {
				await request.server.methodsAsync.session.cache.dropAsync(request.auth.credentials.id);
				return reply();
			}
		}
	}
};

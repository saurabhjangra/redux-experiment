/* 
* @Author: Saurabh Jangra
* @Date:   2017-09-06 
* @Last Modified by:   Saurabh Jangra
* @Last Modified time: 2017-09-06 04:40:21
*/

import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
import Boom from 'boom';
import config from '../config';
import Contactus from '../models/contactus';

import { validators as AuthValidators } from './auth';

Joi.objectId = JoiObjectId(Joi);

const Errors = {
    userNotFound: 'Unable to find the user.',
    userListNotFound: 'Unable to retrieve user list.',
    unableToUpdateOtherUser: 'Do not have permission to perform this action',
    emailDuplicated: 'The email address %s is already used by others.'
};

export { Errors as errors };

const Validators = {
    name: Joi.string().min(2).max(40).description('The Guest name'),
    email: Joi.string().email().description('The guest email address'),
    mobile: Joi.string().min(10).max(20).description('The guest contact number'),
    message: Joi.string().description('The guest message'),
};

export { Validators as validators };

export default {
    addContact: {
        auth: false,
        tags: ['contact', 'api'],
        description: 'Get Contact Information of Guest',
        validate: {
            payload: {
                name: Validators.name.required(),
                email: Validators.email.required(),
                mobile: Validators.mobile.required(),
                message: Validators.message.required()
            },
        },
        handler: {
            async: async function (request, reply) {
                const contact = new Contactus(request.payload);
                const result = await contact.save();
                reply(result);
            }
        }
    },
}

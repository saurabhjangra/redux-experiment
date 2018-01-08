/* 
* @Author: Saurabh Jangra
* @Date:   2017-09-06 
* @Last Modified by:   Saurabh Jangra
* @Last Modified time: 2017-09-06 04:40:21
*/


import util from 'util';
import _ from 'lodash';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
import Boom from 'boom';
import bcrypt from 'bcrypt';
import mongojs from 'mongojs';
import config from '../config';
import Enquiry from '../models/enquiry';

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
    addEnquiry: {
        auth: false,
        tags: ['enquiry', 'api'],
        description: 'Get Enquiry Information By Guest',
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
                const enquiry = new Enquiry(request.payload);
                const result = await enquiry.save();
                reply(result);
            }
        }
    },
}

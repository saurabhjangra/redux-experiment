/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/

import util from 'util';
import _ from 'lodash';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
import Boom from 'boom';
import bcrypt from 'bcrypt';
import mongojs from 'mongojs';
import config from '../config';
import expediacity from '../models/hotel/expediacity';
import AirportList from '../models/flight/airportlist';

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
    city: Joi.string().description('The Airport name'),
    username: Joi.string().alphanum().min(8).max(20).description('The user name'),
    password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).description('The user password'),
    email: Joi.string().email().description('The user email address'),
    role: Joi.string().default('USER').description('The role of user'),
    predicate: Joi.string().default('{}').description('The predicate used to search, same format as predicated used in Mongoose.find'),
    sort: Joi.string().default('{}').description('The predicate used to sort, same format as predicated used in Mongoose.sort'),
    page: Joi.number().integer().min(1).default(1).description('The page number to query'),
    pageSize: Joi.number().integer().min(1).max(20).default(20).description('The number of records in a page')
};

export { Validators as validators };

export default {
    getAirport: {
        auth: false,
        tags: ['hotel', 'api'],
        description: 'All Airport List',
        validate: {
            query: {
                city: Validators.city
            },
        },
        handler: {
            async: async function (request, reply) {
                const result = await AirportList.find({}).sort({ IsTop: -1 }).exec();
                reply(result);
            }
        }
    },

    getHotelCity: {
        auth: false,
        tags: ['hotel', 'api'],
        description: 'Get Hotel City For Autocomplete.',
        validate: {
            params: {
                city: Validators.city.required()
            },
        },
        handler: {
            async: async function (request, reply) {

                const result = await expediacity.aggregate([
                    { $match: { ParentRegionNameLong: { $regex: new RegExp(`^${request.params.city}`, "i") } } },
                    { $group: { _id: '$ParentRegionNameLong' } },
                    { $limit: 10 }
                ]);

                reply(_.map(result, city => city._id));
            }
        }
    },
    getHotelSearch: {
        auth: false,
        tags: ['hotel', 'api'],
        description: 'Get a list of Hotel',
        validate: {
            query: {
                page: Validators.page.optional(),
                pageSize: Validators.pageSize.optional(),
                predicate: Validators.predicate.optional(),
                sort: Validators.sort.optional()
            }
        },
        handler: {
            async: async function (request, reply) {

                reply('Working');
            }
        }
    }
}

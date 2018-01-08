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
import ReviewsAndInfo from '../models/reviewsandinfo';
import DpaulsReviews from '../models/dpaulsReview';
import mongoose from 'mongoose';
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
    id: Joi.objectId().description('enter guest name'),
    name: Joi.string().min(2).max(40).description('enter guest name'),
    email: Joi.string().email().description('The guest email address'),
    mobile: Joi.string().regex(/^(0|[1-9][0-9]{9})$/).description('The guest Mobile number'),
    city: Joi.string().description('The guest city name'),
    reviewTitle: Joi.string().description('The review title'),
    reviewText: Joi.string().description('enter review text message'),
    rating: Joi.number().integer().description('give the rating of review'),
    likes: Joi.number().integer().description('give  like number'),
    reviewsSeen: Joi.number().integer().description('The number of records in a page'),
    comment: Joi.array().description('The number of records in a page'),
    predicate: Joi.object().default('{}').description('The predicate used to search result'),
    sort: Joi.object().default('{}').description('The sort used to sorting the result Ex:{"_id":"ObjectId("59bf8a098c15aa0714f7e8e2")"}'),
    greeting: Joi.string(),
    author: Joi.object().keys({
        name: Joi.string(),
        city: Joi.string(),
        email: Joi.string(),
        image: Joi.string(),
        mobile: Joi.string(),
    }),
    commentAuthor: Joi.object().keys({
        name: Joi.string(),
        image: Joi.string(),
        email: Joi.string(),
    })

};

export { Validators as validators };

export default {
    getAllReviews: {
        auth: false,
        tags: ['ReviewsAndInfo', 'api'],
        description: 'Get All List of Reviews',
        validate: {
            query: {
                predicate: Validators.predicate,
                sort: Validators.sort
            }
        },
        handler: {
            async: async function (request, reply) {
                let result = await ReviewsAndInfo.find(request.query.predicate).sort(request.query.sort).exec()
                reply(result.reverse());
            }
        }
    },
    addNewReview: {
        auth: false,
        tags: ['ReviewsAndInfo', 'api'],
        description: 'Get All List of Reviews',
        validate: {
            payload: {
                reviewTitle: Validators.reviewTitle,
                reviewBody: Validators.reviewText,
                rating: Validators.rating,
                likes: Validators.likes,
                likedCound: Validators.reviewsSeen,
                reviewsSeen: Validators.reviewsSeen,
                author: Validators.author
            }
        },
        handler: {
            async: async function (request, reply) {
                const review = new ReviewsAndInfo(request.payload);
                const result = await review.save();
                reply(result);
            }
        }
    },
    AddNewComment: {
        auth: false,
        tags: ['ReviewsAndInfo', 'api'],
        description: 'get the new comment of guest',
        validate: {
            payload: {
                _id: Validators.id,
                body: Validators.reviewText,
                greeting: Validators.greeting,
                author: Validators.commentAuthor
            }
        },
        handler: {
            async: async function (request, reply) {
                let userData = {
                    id: new mongoose.Types.ObjectId,
                    body: request.payload.body,
                    date: new Date(),
                    greeting: request.payload.greeting,
                    author: request.payload.author
                }
                const result = ReviewsAndInfo.update(
                    { _id: mongoose.Types.ObjectId(request.payload._id) },
                    { $push: { "comment": userData } }
                )
                reply(result);
            }
        }
    },
    AddReviewSeen: {
        auth: false,
        tags: ['ReviewsAndInfo', 'api'],
        description: 'increase reviews views',
        validate: {
            payload: {
                _id: Validators.id,
                count: Validators.reviewsSeen,
            }
        },
        handler: {
            async: async function (request, reply) {
                let result = await ReviewsAndInfo.update({ _id: mongoose.Types.ObjectId(request.payload._id) },
                    { $set: { "reviewsSeen": request.payload.count } });
                reply(result);

            }
        }
    },
    likeReview: {
        auth: false,
        tags: ['ReviewsAndInfo', 'api'],
        description: 'like a review when user login',
        validate: {
            payload: {
                _id: Validators.id,
                email: Validators.email,
                type: Validators.name
            }
        },
        handler: {
            async: async function (request, reply) {
                let result = ''
                let likeData = {
                    email: request.payload.email,
                }
                if (request.payload.type == 'like') {
                    result = ReviewsAndInfo.update(
                        { _id: mongoose.Types.ObjectId(request.payload._id) },
                        { $push: { "likes": likeData } }
                    )
                }
                else {
                    result = ReviewsAndInfo.update(
                        { _id: mongoose.Types.ObjectId(request.payload._id) },
                        { $pull: { "likes": { email: likeData.email } } }
                    )
                }
                reply(result);
            }
        }
    }
}

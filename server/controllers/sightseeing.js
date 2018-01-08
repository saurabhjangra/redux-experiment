/*
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2017-01-03 03:00:46
*/

import util from 'util';
import _ from 'lodash';
import BaseJoi from 'joi'
import Extension from 'joi-date-extensions';
const Joi = BaseJoi.extend(Extension);
import JoiObjectId from 'joi-objectid';
import Boom from 'boom';
import bcrypt from 'bcrypt';
import { Client } from 'node-rest-client';
import Wreck from 'wreck';
import ViatorApi from '../api/sightseeing/viator';

//Importing Models
import productDetail from '../models/sightseeing/productDetail';
import Destinations from '../models/viator/destinations';
import Product from '../models/viator/allproduct';
import Products from '../models/sightseeing/products';
import Reviews from '../models/sightseeing/reviews';
import Categories from '../models/sightseeing/categories';
import Attractions from '../models/sightseeing/attractions';
import Viatorhelper from '../api/sightseeing/viator/helper';
import sightseeingHelper from '../api/sightseeing/sightseeingHelper';


import config from '../config';
//import Viator from '../models/viator';

import { validators as AuthValidators } from './auth';

Joi.objectId = JoiObjectId(Joi);

const Errors = {
    serviceNotFound: 'Unable to make request.',
    ProductNotFound: 'Sorry Product Not Found.'

};

export { Errors as errors };

const Validators = {
    AutocompleteKey: Joi.string().min(1).description('The String where you want Get Autocomplete Data .'),
    destinationId: Joi.number().min(1).description('The DestionId where you want search list .'),
    destinationName: Joi.string().max(40).min(3).description('The Destination Name where you want search list .'),
    ProductCode: Joi.string().min(1).default('5010SYDNEY').description('Product Code Ex: "5010SYDNEY" .'),
    predicate: Joi.string().default('{}').description('The predicate used to search, same format as predicated used in Mongoose.find'),
    sort: Joi.string().default('{}').description('The predicate used to sort, same format as predicated used in Mongoose.sort'),
    page: Joi.number().integer().min(1).default(1).description('The page number to query'),
    pageSize: Joi.number().integer().min(1).max(20).default(20).description('The number of records in a page'),
    limit: Joi.number().integer().min(1).max(200).default(9).description('The number of records in a search Result.'),
    skip: Joi.number().integer().default(0).description('Skip number of records in a search Result.'),
    bookingDate: Joi.description('Booking Date Example- 2017-11-08'),
    currencyCode: Joi.string().default('USD'),
    ageBands: Joi.array().items(
        Joi.object({
            bandId: Joi.number().integer().min(1).default(1).required(),
            count: Joi.number().integer().min(0).default(0).required()
        }).required()

    ).unique('bandId'),
    PromoCode: Joi.string().default(''),
    Booker: Joi.object().length(6).keys({
        email: Joi.string().email().default('deepak.kumar@dpaulstravel.com').description('The user Booker email address').required(),
        homePhone: Joi.number().integer().optional(),
        firstname: Joi.string().min(2).default('Deepak').required(),
        surname: Joi.string().min(2).default('Mishra').required(),
        title: Joi.string().required().valid('Mr', 'Mrs', 'Ms', 'Other'),
        cellPhoneCountryCode: Joi.number().integer().default(+91).optional(),
        cellPhone: Joi.number().integer().min(1).min(10).default(8860145856).required(),

    }).required(),
    BookingItems: Joi.array().items(
        Joi.object({
            "travelDate": Joi.date().format('YYYY-MM-DD').description('Traveling Date').required(),
            "productCode": Joi.string().min(2).required(),
            "tourGradeCode": Joi.string().min(2).required().description('Sightseeing Option/Tour/Grade Code'),
            "specialRequirements": Joi.string().default('').optional(),
            travellers: Joi.array().items(
                Joi.object({
                    "bandId": Joi.number().integer().min(1).default(1).required(),
                    "firstname": Joi.string().min(2).required(),
                    "surname": Joi.string().min(2).required(),
                    "title": Joi.string().required().valid('Mr', 'Mrs', 'Ms', 'Other'),
                    "leadTraveller": Joi.boolean().optional()
                }).required()

            ),
        }).required())


};

export { Validators as validators };

export default {
    //Get Data for Autocomplete
    Autocomplete: {
        auth: false,
        tags: ['Sightseeing', 'api'],
        description: 'Get Autocomplete for Product.',
        validate: {
            params: { key: Validators.AutocompleteKey.required() },
        },
        handler: {
            async: async function (request, reply) {

                const allresult = await Promise.all([
                    //Get Data From Destination
                    /*  Destinations.aggregate([
                         { $match: { destinationName: { $regex: new RegExp(`${request.params.key}`, "i") } } },
                         {
                             $lookup: { from: "destinations", localField: "parentId", foreignField: "destinationId", as: "country" }
                         }, //{ $unwind: "$country" },
                         { $project: { _id: 0, id: "$destinationId", name: "$destinationName", country: "$country.destinationName" } },
                         { $limit: 8 },]).exec(),
                     //Get Data From Product
                     Products.aggregate([
                         { $match: { 'data.title': { $regex: new RegExp(`${request.params.key}`, "i") } } },
                         { "$unwind": "$data" },
                         { $project: { _id: 0, id: "$data.code", name: "$data.title", destination: "$destination" } },
                         { $sort: { name: -1 } }, { $limit: 5 }
                     ]).exec() */
                    Destinations.aggregate([
                        { $match: { destinationName: { $regex: new RegExp(`${request.params.key}`, "i") } } },
                        {
                            $lookup: { from: "destinations", localField: "parentId", foreignField: "destinationId", as: "country" }
                        }, //{ $unwind: "$country" },
                        { $project: { _id: 0, id: "$destinationId", name: "$destinationName", country: "$country.destinationName" } },
                        { $limit: 8 },]).exec(),
                    //Get Data From Product
                    Product.aggregate([
                        { $match: { 'title': { $regex: new RegExp(`${request.params.key}`, "i") } } },
                        { $project: { _id: 0, id: "$code", name: "$title", destination: "$primaryDestinationName" } },
                        { $sort: { name: -1 } }, { $limit: 5 }
                    ]).exec(),
                ]);
                //Combine Result                
                const result = [...allresult[0], ...allresult[1]];
                if (!result) {
                    throw Boom.notFound(util.format(Errors.ProductNotFound, request.params.productcode));
                }
                reply(result);
            }
        }
    },
    //Sightseeing Search
    GetSearchResultByDestionId: {
        auth: 'jwt',
        tags: [
            'Sightseeing', 'api'
        ],
        description: 'Get list of sightseeing by DestionId.',
        validate: {
            params: { destinationId: Validators.destinationId.required() },
            query: { page: Validators.page.optional(), pageSize: Validators.pageSize.optional() },
            headers: Joi.object({ authorization: AuthValidators.authorization }).unknown()
        },
        handler: {
            async: async function (request, reply) {
                debugger;

                // const result = await ViatorApi.updateDest();

                const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
                const db = mongos
                    .viator
                    .db('viator');
                const collection = db.collection('products');

                collection.findOne({
                    "destinationId": request.params.destinationId
                }, {
                        _id: 0
                    }, function (err, result) {
                        debugger;
                        if (err)
                            return reply(Boom.internal('Internal MongoDB error', err));

                        if (!result) {
                            debugger
                            throw Boom.notFound(util.format(Errors.serviceNotFound, request.params.userId));
                        }
                        reply(result);

                    });
            }
        }
    },
    //Sightseing Search By Destion Name
    GetSearchResultByDestionName: {
        auth: false,
        tags: [
            'Sightseeing', 'api'
        ],
        description: 'Get list of sightseeing by DestionId.',
        validate: {
            params: { destinationname: Validators.destinationName.required() },
            query: {
                limit: Validators.limit.optional(),
                skip: Validators.skip.optional()
            },
        },
        handler: {
            async: async function (request, reply) {

                const limit = request.query.limit, skip = request.query.skip;

                //Hit Viator Api and Update Data..
                const Api = sightseeingHelper.UpdateDestinationByName(`^${request.params.destinationname}$`);

                const dbresult = await Products.GetSearchByDestinationName(`^${request.params.destinationname}$`, limit, skip);

                if (dbresult[0] !== undefined) {
                    if (dbresult[0].result.length > 0) {
                        //loop for markup
                        dbresult[0].result.forEach((a, b) => {

                        });
                        reply(dbresult[0]);
                    }
                }

                else {

                    const Apiresult = await Api;
                    // if (!Combineresult) {
                    //     throw Boom.notFound(Errors.ProductNotFound);
                    // }


                    reply(Apiresult);

                }

            }
        }
    },
    //Get Sightseeing  Categories
    GetCategoriesByDestionName: {
        auth: false,
        tags: [
            'Sightseeing', 'api'
        ],
        description: 'Get list of sightseeing by DestionId.',
        validate: {
            params: { destinationname: Validators.destinationName.required() }
        },
        handler: {
            async: async function (request, reply) {
                debugger;
                const CategoriesResult = await Categories.getCategoriesByDestinationName(request.params.destinationname);
                if (!CategoriesResult) {
                    throw Boom.notFound(Errors.ProductNotFound);
                }
                reply(CategoriesResult);

            }

        }
    },
    //Sightseeing Detail
    GetDetailByProductId: {
        auth: false,
        tags: ['Sightseeing', 'api'],
        description: 'Get Product by Product Code.',
        validate: {
            params: { productCode: Validators.ProductCode.required() },
            //headers: Joi.object({ authorization: AuthValidators.authorization }).unknown()
        },
        handler: {
            async: async function (request, reply) {
                //Hit Viator Api
                // const Api = Viatorhelper.ApiGetProductDetailByCode(request.params.productCode)
                // .then((data) => {
                //     return new Promise((resolve, reject) =>
                //         //Upsert Response into database
                //         productDetail.update(
                //             { code: { $regex: new RegExp(`^${request.params.productCode}`, "i") } },
                //             { $set: { ...data.data } },
                //             { new: true, upsert: true }).exec((err, result) => { resolve(result); }));

                // });


                const Api = sightseeingHelper.UpdateProduct(request.params.productCode);
                debugger;

                //Get Data From Database
                const Dbresult = await productDetail.findOne({ code: { $regex: new RegExp(`^${request.params.productCode}`, "i") } }).exec();

                //if Found then Reply
                if (Dbresult) { reply(Dbresult.toObject()); }

                else {
                    //If not fount then wait till api respose
                    const Apiresult = await Api;
                    const NewResult = await productDetail.findOne({ code: { $regex: new RegExp(`^${request.params.productCode}`, "i") } }).exec();
                    if (!NewResult) {
                        throw Boom.notFound(util.format(Errors.ProductNotFound, request.params.productcode));
                    }
                    reply(NewResult.toObject());
                }

            }
        }
    },
    //Get Sightseeing Reviews by Product Code..
    GetProductReviewsByCode: {
        auth: false,
        tags: ['Sightseeing', 'api'],
        description: 'Get Product Reviews By Product Code.',
        validate: {
            params: { productCode: Validators.ProductCode.required() },
            query: {
                page: Validators.page.optional(),
                pageSize: Validators.limit.optional(),
                sort: Validators.sort.optional()
            }
        },
        handler: {
            async: async function (request, reply) {
                const sort = JSON.parse(request.query.sort);
                const page = request.query.page;
                const pageSize = request.query.pageSize;

                const reviews = await Reviews.find({ productCode: { $regex: new RegExp(`^${request.params.productCode}`, "i") } })
                    .sort(sort).skip((page - 1) * pageSize).limit(pageSize).exec();

                if (!reviews) {
                    throw Boom.notFound('Reviews Not Found');
                }
                //debugger;
                reply(reviews);
            }

        }

    },
    GetProductAvailabilityDates: {
        auth: false,
        tags: ['Sightseeing', 'api'],
        description: 'Get All available dates for a product excluding weekdays it doesnt do and blockouts.',
        validate: {
            params: { productCode: Validators.ProductCode.required() }
        },
        handler: {
            async: async function (request, reply) {
                const ApiResponse = await Viatorhelper.ApiGetProductAvailabilityDates(request.params.productCode);
                reply(ApiResponse.data);
            }
        }

    },
    //Get Tour Options for a specific day
    GetProductOptions: {
        auth: false,
        tags: ['Sightseeing', 'api'],
        description: 'Get All available Tour Options for a specific day',
        validate: {
            payload: {
                productCode: Validators.ProductCode.required(),
                bookingDate: Validators.bookingDate,
                currencyCode: Validators.currencyCode.optional(),
                ageBands: Validators.ageBands.required()
            }
        },
        handler: {
            async: async function (request, reply) {
                const ApiResponse = await Viatorhelper.ApiGetProductOptions(request.payload);
                reply(ApiResponse.data);
            }
        }

    },
    //Book Sightseeing Option 
    BookSightseeing: {
        auth: false,
        tags: ['Sightseeing', 'api'],
        description: 'Make a Booking',
        validate: {
            payload: {
                promoCode: Validators.PromoCode.required(),
                booker: Validators.Booker.required(),
                items: Validators.BookingItems.required()
            }
        },
        handler: {
            async: async function (request, reply) {
                debugger;
                const ApiResponse = await Viatorhelper.ApiBookSightseeingOptions(request.payload);
                debugger;
                reply(ApiResponse.data);
            }
        }

    },
    GetSightseeingAttractions: {
        auth: false,
        tags: ['Sightseeing', 'api'],
        description: 'Get Destination Attraction By Destination Id',
        validate: {
            query: {
                id: Validators.destinationId.required()
            }
        },
        handler: {
            async: async function (request, reply) {
                const Did = request.query.id;
                const attraction = await Attractions.find({ destinationId: Did }).exec();

                if (!attraction) {
                    throw Boom.notFound('Attraction Not Found');
                }
                //debugger;
                reply(attraction);
            }

        }
    }

};

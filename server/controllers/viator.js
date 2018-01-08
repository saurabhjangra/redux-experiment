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
import { Client } from 'node-rest-client';
import Wreck from 'wreck';
import ViatorApi from '../api/sightseeing/viator';
import helper from '../api/sightseeing/viator/helper';

import config from '../config';
import destination from '../models/viatorDestination';

import viatorallproduct from '../models/sightseeing/viatorallproduct';
import viatorProduct from '../models/sightseeing/products';
import productDetail from '../models/sightseeing/productDetail';

import { validators as AuthValidators } from './auth';

Joi.objectId = JoiObjectId(Joi);

const Errors = {
    serviceNotFound: 'Unable to make request.'
};

export { Errors as errors };

const Validators = {
    city: Joi.string().min(1).description('The city')
};

export { Validators as validators };

export default {

    UpdateDestionations: {
        auth: false,
        tags: [
            'viator', 'api'
        ],
        description: 'Update Viator Destinations.',
        // validate: {     // payload: {     city: Validators.city.required() },
        // headers: Joi         .object({authorization: AuthValidators.authorization})
        // .unknown() },
        handler: {
            async: async function (request, reply) {
                debugger;
                var result = await destination.find();
                debugger;

                // const result = await ViatorApi.updateDest();

                if (!result) {
                    debugger
                    throw Boom.notFound(util.format(Errors.serviceNotFound, request.params.userId));
                }
                debugger;
                reply(result);
            }
        }
    },

    UpdateProduct: {
        auth: false,
        tags: [
            'viator', 'api'
        ],
        description: 'Update Viator Product by Destionations ID',
        validate: {
            // payload: {     city: Validators.city.required() }, headers: Joi
            // .object({authorization: AuthValidators.authorization})     .unknown()
        },
        handler: {
            async: async function (request, reply) {

                const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
                const db = mongos.viator.db('viator');
                const collection = db.collection('destinations');

                //const result = await collection.find();

                collection.find({}, { _id: 0, destinationId: 1, destinationName: 1 }, async function (err, result) {
                    if (err)
                        return reply(Boom.internal('Internal MongoDB error', err));

                    const alldestination = await result.toArray()

                    if (alldestination) {
                        //start loop
                        for (let destination of alldestination) {
                            let currentData = new Array();
                            const result = await helper.ApiGetProductById('1-1000', destination.destinationId); //ViatorApi.updateProduct(request, destination);

                            if (result) {
                                currentData = result.data;
                                const totalProduct = result.totalCount;
                                let currentDatalength = currentData.length;

                                //ftech more product
                                let to = 1000,
                                    next = 2000;

                                while (currentDatalength < totalProduct) {
                                    to++;
                                    const nextTopx = `${to}-${next}`;
                                    console.log("loop start NextTop: " + nextTopx);
                                    const nextdata = await helper.ApiGetProductById(nextTopx, destination.destinationId);
                                    if (nextdata.data) {
                                        currentDatalength = currentDatalength + nextdata.data.length;
                                        currentData.push.apply(currentData, nextdata.data);
                                        // apply.bind([...currentData,...nextdata.data]);
                                        // currentData.concat(nextdata.data)
                                    }
                                    to = next;
                                    next = next + 1000;
                                    if (currentDatalength == totalProduct)
                                        break;
                                    console.log("loop end NextTopx: " + next);

                                }

                                //Inserting into mongo db

                                const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
                                const db = mongos
                                    .viator
                                    .db('newviator');
                                const collection = db.collection('products');

                                viatorProduct.update({ destinationId: destination.destinationId }, {
                                    destination: destination.destinationName,
                                    destinationId: destination.destinationId,
                                    data: currentData
                                }, { upsert: true }, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log(`Destination Id ${destination.destinationId}`)
                                });

                            }

                        }
                        reply("Data updated..");
                    }

                    // reply(r);
                });

                // if (!result) {     debugger     throw
                // Boom.notFound(util.format(Errors.serviceNotFound, request.params.userId)); }
                // debugger; reply(result);
            }
        }
    },

    UpdateCategoriesByDestinationId: {
        auth: 'jwt',
        tags: [
            'viator', 'api'
        ],
        description: 'Update Viator Categories by Destionations ID',
        plugins: {
            hapiAuthorization: {
                role: 'ADMIN'
            }
        },
        validate: {
            headers: Joi
                .object({ authorization: AuthValidators.authorization })
                .unknown()
        },
        handler: {
            async: async function (request, reply) {
                const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
                const db = mongos
                    .viator
                    .db('viator');

                const collection = db.collection('destinations');

                collection.find({}, {
                    _id: 0,
                    destinationName: 1,
                    destinationId: 1
                }, async function (err, result) {
                    if (err)
                        return reply(Boom.internal('Internal MongoDB error', err));

                    const alldestination = await result.toArray();
                    debugger;
                    if (alldestination) {
                        //start loop

                        for (let destination of alldestination) {
                            const result = await helper.ApiGetcategoriesByDestionId(destination.destinationId);
                            const catcollection = db.collection('categories');

                            //Inserting Into Categories Collection
                            catcollection.update({
                                destinationId: destination.destinationId
                            }, {
                                    destination: destination.destinationName,
                                    destinationId: destination.destinationId,
                                    data: result.data
                                }, {
                                    upsert: true
                                }, function (err, result) {
                                    if (err) {
                                        reject(error);
                                    }
                                });
                        }

                        debugger;
                        reply("Data updated..");

                    }

                });
            }

        }
    },

    UpdateAttractionDestinationId: {
        //  auth: 'jwt',
        auth: false,
        tags: [
            'viator', 'api'
        ],
        description: 'Update Viator attraction by Destionations ID',
        // plugins: { 	hapiAuthorization: {role: 'ADMIN'} },  validate: {      headers:
        // Joi     .object({authorization: AuthValidators.authorization})
        // .unknown() },
        handler: {
            async: async function (request, reply) {
                debugger;
                const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
                const db = mongos.viator.db('viator');

                const collection = db.collection('destinations');

                collection.find({}, { _id: 0, destinationName: 1, destinationId: 1 }, async function (err, result) {
                    if (err)
                        return reply(Boom.internal('Internal MongoDB error', err));

                    const alldestination = await result.toArray();
                    if (alldestination) {
                        //start loop

                        for (let destination of alldestination) {
                            const result = await helper.ApiGetAttractionById(destination.destinationId);
                            const attractioncollection = db.collection('attraction');

                            //Inserting Into Categories Collection
                            attractioncollection.update({ destinationId: destination.destinationId }, {
                                destination: destination.destinationName,
                                destinationId: destination.destinationId,
                                data: result.data
                            }, { upsert: true }, function (err, result) {
                                if (err) {
                                    reject(error);
                                }
                            });
                        }

                        debugger;
                        reply("Data updated..");

                    }

                });
            }
        }

    },

    UpdateDetailByProductCode: {
        auth: false,
        tags: [
            'viator', 'api'
        ],
        description: 'Update Viator Deatail by Product code ',
        handler: {
            async: async function (request, reply) {

                //var result = await viatorProduct.find({ "destinationId": 77 }).exec();                
                //     reply(_.map(result, viatorProduct => viatorProduct.toObject()));

                const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
                const db = mongos.viator.db('viator');
                const prodcollection = db.collection('productdetail');

                debugger
                let page = 1;
                let pageSize = 100;
                // let totalProduct = await viatorallproduct.find({}, { _id: 0, code: 1 }).count().exec();


                // while (page < totalProduct) {
                debugger
                // let dbProduct = await viatorallproduct.find({}, { _id: 0, code: 1 }).skip((page - 1) * pageSize).limit(pageSize).exec();
                let dbProduct = await viatorallproduct.find({}, { _id: 0, code: 1 }).exec();
                const allproduct = _.map(dbProduct, viatorallproduct => viatorallproduct.toObject());
                if (allproduct.length > 0) {

                    for (let prod of allproduct) {

                        const existingProduct = await prodcollection.findOne({ code: prod.code });
                        debugger;
                        if (!existingProduct) {

                            const apiResult = await helper.ApiGetProductDetailByCode(prod.code);

                            //Upsert Into productdetail Collection
                            if (apiResult.data) {

                                let issuccess = await prodcollection.update({ code: apiResult.data.code }, apiResult.data, { upsert: true });
                                console.log('Data Insert with Code : ' + prod.code);
                            }
                        }

                    }
                    page = page + pageSize;
                    console.log('Current Page : ' + page);
                    console.log('For loop End');



                }

                //}//while loop end here
                console.log('While Loop end');




            }
        }

    },

    UpdateReviewByCode: {
        auth: false,
        tags: ['viator', 'api'],
        description: 'Update Viator Reviews by Product code ',
        handler: {
            async: async function (request, reply) {
                debugger;
                const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
                const db = mongos.viator.db('viator');
                const allcollection = db.collection('allproduct_copy');

                // let dbProduct = await viatorallproduct.find({}, { _id: 0, code: 1 }).exec();
                allcollection.find({ reviewCount: { $exists: true, $ne: 0 } }, { _id: 0, code: 1 },
                    async function (error, data) {
                        let allproduct = await data.toArray();

                        if (allproduct.length > 0) {
                            for (let prod of allproduct) {
                                const Reviewscollection = db.collection('reviews');
                                const existingProduct = await Reviewscollection.findOne({ productCode: prod.code });

                                let message = (existingProduct) ? `${prod.code} Found` : `${prod.code} Not Found`;
                                console.log(message);
                                if (!existingProduct) {

                                    const apiResult = await helper.ApiGetProductReviewsByCode(prod.code);
                                    console.log("\n Api Sucess " + apiResult.success + "\n");
                                    //console.log("\n Api Result " + apiResult.data.length+"\n");                                    

                                    //Upsert Into productdetail Collection
                                    if (apiResult.success === true) {
                                        debugger;
                                        if (apiResult.data !== null && apiResult.data.length !== 0) {
                                            console.log("\n Api Result " + apiResult.data.length + "\n");
                                            //if (apiResult.data.length > 0) {
                                            debugger;
                                            let a = await Reviewscollection.insertMany(apiResult.data, { multi: true });
                                            // for (let review of apiResult.data) {
                                            //     debugger;
                                            //     console.log('Review Id : ' + apiResult.data.reviewId + '\n');
                                            //     // let issuccess = await Reviewscollection.update({ reviewId: apiResult.data.reviewId },
                                            //     //     review, { upsert: true });

                                            //     try {
                                            //         Reviewscollection.insertMany(apiResult.data, { multi: true });

                                            //     } catch (error) {
                                            //         console.log('Insert Error : ' + error + '\n');
                                            //     }

                                            //     console.log('Data Insert with Code : ' + prod.code);
                                            // }
                                            console.log("data inserted..");
                                        }
                                    }
                                }
                            }
                        }

                    });
                debugger;
                // const allproduct = _.map(dbProduct, viatorallproduct => viatorallproduct.toObject());

            }

        }
    }

};

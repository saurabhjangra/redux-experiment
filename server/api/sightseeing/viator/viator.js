import {Client} from 'node-rest-client';
import helper from './helper';
import config from '../../../config';

class viator {
    static async updateDest() {
        return new Promise((resolve, reject) => {
            try {

                var client = new Client();
                var req = client.get(config.api.vaitorUrlWithApiKey, function (data, response) {
                    // parsed response body as js object
                    debugger
                    helper.InsertDestinationIntoMangoDB(data);
                    // console.log(data);
                    resolve(data);
                    // raw response console.log(response);
                });

                req.on('requestTimeout', function (req) {
                    console.log('request has expired');
                    req.abort();
                });

                req.on('responseTimeout', function (res) {
                    console.log('response has expired');

                });

                // it's usefull to handle request errors to avoid, for example, socket hang up
                // errors on request timeouts
                req.on('error', function (err) {
                    console.log('request error', err);
                    return reject(err);
                });

            } catch (err) {
                reject(err);

            }

        });
    };

    static async updateProduct(request, destination) {

        return new Promise((resolve, reject) => {
            try {

                debugger
                let topX = "1-200" || "";
                helper
                    .ApiGetProductById(topX, destination.destinationId)
                    .then(function (apidata) {
                        debugger;
                        let currentData = new Array();
                        if (apidata.data) {

                            const totalProduct = apidata.totalCount;
                            let currentDatalength = apidata.data.length;

                            let to = 200;
                            let next = 400;
                            while (currentDatalength <= totalProduct) {
                                to++;
                                const nextTopx = `${to}-${next}`;
                                debugger;
                                const dat = viator
                                    .LoadMore(nextTopx, destination.destinationId)
                                    .then(function (dat) {
                                        debugger;
                                    })

                                debugger

                            }

                            const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
                            const db = mongos
                                .viator
                                .db('viator');
                            const collection = db.collection('products');

                            collection.insert({
                                destination: destination.destinationName,
                                destinationId: destination.destinationId,
                                data: data.data
                            }, function (err, result) {
                                debugger;
                                if (err) {
                                    reject(error);
                                }

                            });
                        }
                    });

            } catch (error) {
                reject(error);
            }
        });

    };

    static async LoadMore(nextTopx, destinationId) {
        return new
        Promise((resolve, reject) => {
            helper
                .ApiGetProductById(nextTopx, destinationId)
                .then(function (data) {
                    debugger;
                    currentDatalength = currentDatalength + data.data.length;

                    to = next;
                    next = next + 200;
                });
        });

    };

    
}

export default viator;

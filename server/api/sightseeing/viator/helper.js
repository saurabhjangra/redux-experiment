import { MongoClient } from 'mongodb';
import { Client } from 'node-rest-client';
import 'dotenv/config';

const VIATOR_API_URL = process.env.VIATOR_API_URL, VIATOR_API_KEY = process.env.VIATOR_API_KEY;

class helper {
    static async InsertDestinationIntoMangoDB(jsonData) {
        return new Promise((resolve, reject) => {
            debugger
            MongoClient.connect('mongodb://127.0.0.1:27017/viator', function (err, db) {
                debugger;
                if (err)
                    throw err;
                console.log("Connected to Database");
                var document = {
                    name: "David",
                    title: "About MongoDB"
                };

                // insert record
                db
                    .collection('test')
                    .insert(document, function (err, records) {
                        if (err)
                            throw err;
                        console.log("Record added as " + records[0]._id);
                    });
            });

        });

    };

    static async InsertProductIntoMangoDB(request, jsonData, InsertProductIntoMangoDB) {
        const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
        const db = mongos
            .viator
            .db('viator');
        const collection = db.collection('destination');
        return new Promise((resolve, reject) => { });
    };

    static async ApiGetProductById(topX, destinationId) {

        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                var args = {
                    data: {
                        startDate: "",
                        endDate: "",
                        topX: topX,
                        destId: destinationId,
                        currencyCode: "USD",
                        catId: 0,
                        subCatId: 0,
                        dealsOnly: false
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    responseConfig: {
                        timeout: 0 //response timeout
                    }
                };

                var req = client.post(`${VIATOR_API_URL}/service/search/products?apiKey=${VIATOR_API_KEY}`,
                    args, function (data, response) {
                        // parsed response body as js object console.log(data.toString('utf8'))
                        if (data.data) { resolve(data); }

                        else { reject(data); }

                    });
            } catch (err) { reject(err); }
        });
    };

    static async ApiGetcategoriesByDestionId(destinationId) {
        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                var args = {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    responseConfig: {
                        timeout: 0 //response timeout
                    }
                };
                //var req = client.get(`http://prelive.viatorapi.viator.com/service/taxonomy/categories?destId=${destinationId}&apiKey=1460994291146531`,
                let req = client.get(`${VIATOR_API_URL}/service/taxonomy/categories?destId=${destinationId}&apiKey=${VIATOR_API_KEY}`,
                    args, function (data, response) {
                        // console.log(data.toString('utf8'));
                        // parsed response body as js object console.log(data.toString('utf8'))
                        if (data.data) {
                            resolve(data);
                        }
                        else {
                            reject(data);
                        }

                    });
            } catch (err) {
                reject(err);
            }
        });

    };

    static async ApiGetAttractionById(destinationId) {
        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                var args = {
                    data: {
                        destId: destinationId,
                        topX: "",
                        sortOrder: "SEO_ALPHABETICAL"
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    responseConfig: {
                        timeout: 0 //response timeout
                    }
                };
                //var req = client.post('http://prelive.viatorapi.viator.com/service/taxonomy/attractions?apiKey=14609942' +
                let req = client.post(`${VIATOR_API_URL}/service/taxonomy/attractions?apiKey=${VIATOR_API_KEY}`,
                    args, function (data, response) {
                        // parsed response body as js object console.log(data.toString('utf8'))
                        console.log(`City = ${destinationId}`);
                        if (data.data) {
                            resolve(data);
                        }
                        else {
                            reject(data);
                        }

                    });
            } catch (err) {
                reject(err);
            }
        });
    };

    static async ApiGetProductDetailByCode(productcode) {
        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                var args = {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    responseConfig: {
                        timeout: 0 //response timeout
                    }
                };
                let req = client.get(`${VIATOR_API_URL}/service/product?code=${productcode}&currencyCode=USD&excludeTourGradeAvailability=false&showUnavailable=true&apiKey=${VIATOR_API_KEY}`,
                    args, function (data, response) {
                        // parsed response body as js object console.log(data.toString('utf8'))
                        resolve(data);

                    });
            } catch (err) {
                reject(err);
            }
        });
    }

    static async ApiGetProductReviewsByCode(topX, productcode) {
        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                var args = { headers: { "Content-Type": "application/json" }, responseConfig: { timeout: 0 } };

                let req = client.get(`${VIATOR_API_URL}/service/product/reviews?code=${productcode}&topX=${topX}&sortOrder=REVIEW_RATING_D&showUnavailable=true&apiKey=${VIATOR_API_KEY}`,
                    args, function (data, response) { resolve(data); });
            } catch (err) {
                reject(err);
            }
        });

    }

    static async ApiGetProductAvailabilityDates(productcode) {
        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                var args = { headers: { "Content-Type": "application/json" }, responseConfig: { timeout: 0 } };

                let req = client.get(`${VIATOR_API_URL}/service/booking/availability/dates?productCode=${productcode}&apiKey=${VIATOR_API_KEY}`,
                    args, function (data, response) { resolve(data); });
            } catch (err) {
                reject(err);
            }
        });

    }
    //Get Tour grades Options for a specific day
    static async ApiGetProductOptions(payload) {
        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                var args = {
                    data: {
                        productCode: payload.productCode,
                        bookingDate: payload.bookingDate,
                        currencyCode: payload.currencyCode,
                        ageBands: payload.ageBands
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    responseConfig: {
                        timeout: 0 //response timeout
                    }
                };

                var req = client.post(`${VIATOR_API_URL}/service/booking/availability/tourgrades?apiKey=${VIATOR_API_KEY}`,
                    args, function (data, response) {
                        // parsed response body as js object console.log(data.toString('utf8'))
                        if (data.data) { resolve(data); }

                        else { reject(data); }

                    });
            } catch (err) { reject(err); }
        });

    }
    //Book Sightseeing
    static async ApiBookSightseeingOptions(payload) {
        debugger;
        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                var args = {
                    data: {
                        "sessionId": "", "ipAddress": "", "aid": null, "newsletterSignUp": false,
                        "demo": true, "promoCode": payload.promoCode,
                        "currencyCode": "USD", "otherDetail": null,
                        "partnerDetail": { "distributorRef": "distroRef" },
                        "booker": payload.booker,
                        "items": [
                            {
                                "partnerItemDetail": { "distributorItemRef": "distroItemRef" },
                                "hotelId": null,
                                "pickupPoint": null,
                                "travelDate": payload.travelDate,
                                "productCode": payload.productCode,
                                "tourGradeCode": payload.tourGradeCode,
                                "languageOptionCode": "en/SERVICE_GUIDE",
                                "specialRequirements": payload.specialRequirements,
                                "travellers": payload.travellers
                            }

                        ]
                    },
                    headers: { "Content-Type": "application/json" },
                    responseConfig: { timeout: 0 }
                };

                var req = client.post(`${VIATOR_API_URL}/service/booking/availability/tourgrades?apiKey=${VIATOR_API_KEY}`,
                    args, function (data, response) {
                        // parsed response body as js object console.log(data.toString('utf8'))
                        if (data.data) { resolve(data); }

                        else { reject(data); }

                    });
            } catch (err) { reject(err); }
        });

    }

}

export default helper;
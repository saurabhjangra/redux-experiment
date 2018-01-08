import Viatorhelper from './viator/helper';
import Destinations from '../../models/viator/destinations';
import Product from '../../models/sightseeing/products';
import productDetail from '../../models/sightseeing/productDetail';
import Reviews from '../../models/sightseeing/reviews';

class sightseeingHelper {

    static async UpdateDestinationByName(destinationName) {
        return new Promise((resolve, reject) => {
            Destinations.findOne({ destinationName: { $regex: new RegExp(destinationName, "i") } },
                { _id: 0, }, async (err, destination) => {

                    let lastUpdateDate;
                    //if(destination.destinationId){}else{}
                    const lastUpdateTime = await Product.find({ destinationId: destination.destinationId }, { _id: 0, updatedAt: 1 }).exec();


                    if (lastUpdateTime.length) {
                        lastUpdateDate = (lastUpdateTime[0].updatedAt) ? new Date(lastUpdateTime[0].updatedAt) : new Date(1970, 0, 1);
                        lastUpdateDate.setDate(lastUpdateDate.getDate() + 10);
                    }
                    //fake date
                    else {
                        lastUpdateDate = new Date(1970, 0, 1);
                        lastUpdateDate.setDate(lastUpdateDate.getDate() + 10);
                    }

                    var today = new Date();
                    if ((new Date(today.getFullYear(), today.getMonth(), today.getDate())) > lastUpdateDate) {
                        //yes Data is Older then 15 Day

                        let currentData = new Array();

                        //Get Location Relationship
                        const dbDestination = new Promise(async (resolve, reject) => {
                            const desdata = {};
                            Destinations.find({ "destinationId": destination.destinationId }, (err, data) => {
                                desdata['destination'] = data[0].destinationName;
                                //desdata.push({ searchDestination: { type: data[0].destinationType, name: data[0].destinationName } });
                                Destinations.find({ "destinationId": data[0].parentId }, (err1, data1) => {
                                    if (data1[0]) {
                                        desdata[data1[0].destinationType.toLowerCase()] = data1[0].destinationName;

                                        //  desdata.push({ [data1[0].destinationType]: data1[0].destinationName, id: data1[0].destinationId });
                                        Destinations.find({ "destinationId": data1[0].parentId }, (err2, data2) => {
                                            if (data2[0]) {
                                                desdata[data2[0].destinationType.toLowerCase()] = data2[0].destinationName;
                                                //desdata.push({ [data2[0].destinationType]: data2[0].destinationName, id: data2[0].destinationId });
                                            }
                                            resolve(desdata);

                                        });
                                    }
                                    resolve(desdata);

                                });

                            });
                        });

                        const allresult = await Promise.all([
                            Viatorhelper.ApiGetProductById('1-1000', destination.destinationId),
                            dbDestination
                        ]);
                        const Apiresult = allresult[0];
                        const searchDest = { ...allresult[1] };

                        //fetch more data
                        if (Apiresult) {
                            currentData = Apiresult.data;
                            const totalProduct = Apiresult.totalCount;
                            let currentDatalength = currentData.length;

                            //ftech more product
                            let to = 1000, next = 2000;

                            while (currentDatalength < totalProduct) {
                                to++;
                                const nextTopx = `${to}-${next}`;
                                console.log("loop start NextTop: " + nextTopx);

                                const nextdata = await Viatorhelper.ApiGetProductById(nextTopx, destination.destinationId);
                                if (nextdata.data) {
                                    currentDatalength = currentDatalength + nextdata.data.length;
                                    currentData.push.apply(currentData, nextdata.data);
                                }
                                to = next;
                                next = next + 1000;
                                if (currentDatalength == totalProduct)
                                    break;
                                console.log("loop end NextTopx: " + next);

                            }

                            //Upserting Data into mongo db     

                            allresult[1]['destination'] = destination.destinationName;
                            allresult[1]['destinationId'] = destination.destinationId;
                            allresult[1]['totalCount'] = totalProduct;
                            allresult[1]['data'] = currentData;

                            //Upsert Into Database
                            Product.update(
                                { destinationId: destination.destinationId },
                                ...[allresult[1]],
                                { new: true, upsert: true }).exec(async (err, result) => {
                                    const dbresult = await Product.GetSearchByDestinationName(destination.destinationName, 9, 0);
                                    //loop for Markup
                                    dbresult[0].result.forEach((dataValue, key) => {

                                    });
                                    resolve(dbresult[0]);
                                }
                                )

                        }

                    }//End of Date Check
                    else { resolve }
                });
        })
    }

    static async UpdateProductReviews(productCode) {
        return new Promise((resolve, reject) => {
            //  const ApiReviews = Viatorhelper.ApiGetProductReviewsByCode(productCode);

        });
    }

    //Update Detail
    static async UpdateProduct(productCode) {
        return new Promise(async (resolve, reject) => {

            let lastUpdateDate;
            //Get Last Updated Date
            const lastUpdateTime = await productDetail.findOne({ code: { $regex: new RegExp(productCode, "i") } }, { _id: 0, updatedAt: 1 }).exec();
            if (lastUpdateTime !== null) {
                lastUpdateDate = (lastUpdateTime.updatedAt) ? new Date(lastUpdateTime.updatedAt) : new Date(1970, 0, 1);
                lastUpdateDate.setDate(lastUpdateDate.getDate() + 5);
            }
            //fake date
            else {
                lastUpdateDate = new Date(1970, 0, 1);
                lastUpdateDate.setDate(lastUpdateDate.getDate() + 5);
            }

            // Check if Last Updated Date Is Greater Then Today
            var today = new Date();
            if ((new Date(today.getFullYear(), today.getMonth(), today.getDate())) > lastUpdateDate) {
                //Update Reviews For This Product
                Viatorhelper.ApiGetProductReviewsByCode('1-100', productCode).then(async (apiReview) => {
                    if (apiReview.data.length > 0) {
                        let currentData = new Array();
                        currentData.push.apply(currentData, apiReview.data);

                        const totalReview = apiReview.totalCount;
                        let currentReviewlength = currentData.length;

                        //ftech more product
                        let to = 100, next = 200;

                        while (currentReviewlength < totalReview) {
                            to++;
                            const NextReview = await Viatorhelper.ApiGetProductReviewsByCode(`${to}-${next}`, productCode);
                            if (NextReview.data) {
                                currentReviewlength = currentReviewlength + NextReview.data.length;
                                currentData.push.apply(currentData, NextReview.data);
                            }
                            to = next;
                            next = next + 100;
                            if (currentReviewlength == totalReview) { break; }
                        }

                        for (let review of currentData) {
                            const UpsertReview = await Reviews.findOneAndUpdate({ reviewId: review.reviewId }, { ...review }, { upsert: true, new: true }).exec();
                        }

                    }


                });

                //Update Product
                const apiresult = await Viatorhelper.ApiGetProductDetailByCode(productCode);

                const NewDetailData = await productDetail.update(
                    { code: { $regex: new RegExp(productCode, "i") } },
                    { $set: { ...apiresult.data } },
                    { new: true, upsert: true }).exec();//.exec((err, result) => { resolve(result); });

                resolve(NewDetailData);
            }
            else { resolve }
        });
    }

}
export default sightseeingHelper;
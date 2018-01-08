import Mongoose from 'mongoose';
import Promise from 'bluebird';
import 'dotenv/config';
//require('dotenv').config();

Mongoose.Promise = Promise;

const conn = Mongoose.createConnection(process.env.VIATOR_DB_URL);

const schema = new Mongoose.Schema({
    destination: { type: String, required: true, lowercase: true, trim: true },
    destinationId: { type: Number, required: true },
    totalCount: { type: Number, required: true },
    region: { type: String, lowercase: true, trim: true },
    country: { type: String, lowercase: true, trim: true },
    data: { type: Array, default: [] },

}, { timestamps: true, versionKey: false });

schema.virtual('ID').get(function () { return this.code; });

let Products = conn.model('Products', schema, 'products');

// Products.GetSearchByDestinationName = (destinationname, limit, skip) => {

//     return Products.aggregate(

//         [{ $match: { "destination": { $regex: new RegExp(`^${destinationname}`, "i") } } },
//         { "$unwind": "$data" }, {
//             $project:
//             {
//                 _id: 0,
//                 // shortDescription: { $substrBytes: ["$data.shortDescription", 0, 150] },
//                 shortDescription: "$data.shortDescription",
//                 duration: "$data.duration",
//                 shortTitle: "$data.shortTitle",
//                 thumbnailHiResURL: "$data.thumbnailHiResURL",
//                 reviewCount: "$data.reviewCount",
//                 rating: "$data.rating",
//                 code: "$data.code"
//             }

//         }, { $limit: limit + skip }, { "$skip": skip }
//         ]
//     ).exec();
// }

Products.GetSearchByDestinationName = (destinationname, limit, skip) => {

    return Products.aggregate(
        [{ $match: { "destination": { $regex: new RegExp(`^${destinationname}`, "i") } } },
        { "$unwind": "$data" }, { $limit: limit + skip }, { "$skip": skip },
        {
            "$group": {
                "_id": "$_id", "totalCount": { "$first": '$totalCount' },
                "destination": { "$first": { $toLower: '$destination' } }, "destinationId": { "$first": '$destinationId' },
                "country": { "$first": '$country' }, "region": { "$first": '$region' },

                "result": {
                    "$addToSet":
                    {
                        shortDescription: "$data.shortDescription",
                        duration: "$data.duration",
                        price: "$data.price",
                        catIds: "$data.catIds",
                        subCatIds: "$data.subCatIds",
                        shortTitle: "$data.shortTitle",
                        thumbnailHiResURL: "$data.thumbnailHiResURL",
                        reviewCount: "$data.reviewCount",
                        rating: "$data.rating",
                        code: "$data.code",
                        sortOrder: '$data.sortOrder'
                    }
                }
            }
        }
        ]
    ).exec();
}

Products.GetTotalCount = (destinationname) => {
    return Products.aggregate(
        [{ $match: { "destination": { $regex: new RegExp(destinationname, "i") } } },
        { $project: { _id: 0, TotalCount: { $size: "$data" } } }]).exec()
}

export default Products;
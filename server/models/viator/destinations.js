import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection(process.env.VIATOR_DB_URL);

const schema = new Mongoose.Schema({
    sortOrder: {
        type: Number,
    },
    selectable: {
        type: Boolean,

    },
    defaultCurrencyCode: {
        type: String
    },
    lookupId: {
        type: String,
    },
    parentId: {
        type: Number,
    },
    timeZone: {
        type: String,

    },
    iataCode: {
        type: String,
    },
    destinationType: {
        type: String

    },
    destinationName: {
        type: String,
    },
    destinationId: {
        type: Number,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },

}, {
        timestamps: true,
        versionKey: false
    });

let Destinations = conn.model('Destinations', schema, 'destinations');

Destinations.GetParentByDestionation = (destinationName) => {

    return Destinations.aggregate([
        { $match: { destinationName: { $regex: new RegExp(`^${destinationName}$`, "i") } } },
        { $lookup: { from: "destinations", localField: "parentId", foreignField: "destinationId", as: "country" } },
        { $project: { _id: 0, desid: "$destinationId", name: { $toLower: "$destinationName" }, country: "$country.destinationName" } },
        { $limit: 1 },]).exec()
}

export default Destinations;

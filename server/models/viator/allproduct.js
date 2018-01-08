import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection('mongodb://localhost:27017/viator');

const schema = new Mongoose.Schema({
    sortOrder: {
        type: Number,
    },
    supplierName: {
        type: String,
    },
    currencyCode: {
        type: String
    },
    catIds: {
        type: Array,
    },
    subCatIds: {
        type: Array,
    },
    webURL: {
        type: String,
    },
    specialReservationDetails: {
        type: String,
    },
    panoramaCount: {
        type: Number
    },
    merchantCancellable: {
        type: Boolean,
    },
    bookingEngineId: {
        type: String,
    },
    onRequestPeriod: {
        type: String,
    },
    primaryGroupId: {
        type: Number,
    },
    pas: {
        type: String,
    },
    title: {
        type: String,

    },
    shortDescription: {
        type: String
    },
    price: {
        type: Number,
    },
    supplierCode: {
        type: String,
    },
    translationLevel: {
        type: Number,

    },
    thumbnailHiResURL: {
        type: String,
    },
    primaryDestinationId: {
        type: Number

    },
    primaryDestinationName: {
        type: String,
    },
    thumbnailURL: {
        type: String,
    },
    priceFormatted: {
        type: String,
    },
    rrp: {
        type: Number,
    },
    rrpformatted: {
        type: String,
    },
    onSale: {
        type: Boolean
    },
    videoCount: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    photoCount: {
        type: Number,
    },
    reviewCount: {
        type: Number,
    },
    specialReservation: {
        type: Boolean
    },
    shortTitle: {
        type: String,
    },
    uniqueShortDescription: {
        type: String,
    },
    merchantNetPriceFrom: {
        type: Number,
    },
    merchantNetPriceFromFormatted: {
        type: String,
    },
    savingAmount: {
        type: Number,
    },
    savingAmountFormated: {
        type: String,
    },
    specialOfferAvailable: {
        type: Boolean,
    },
    code: {
        type: String,
    },
    duration: {
        type: String,
    },
},
    {
        timestamps: true,
        versionKey: false
    });

export default conn.model('Product', schema, 'allproduct');

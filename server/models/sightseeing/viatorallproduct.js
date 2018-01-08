import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection('mongodb://localhost:27017/viator');

const schema = new Mongoose.Schema({
    sortOrder: {
        type: Number,
        required: true
    },
    supplierName: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    currencyCode: {
        type: String,
        required: true
    },
    catIds: {
        type: Array,
        default: []
    },
    subCatIds: {
        type: Array,
        default: []
    },
    webURL: {
        type: String,
        required: true

    },
    specialReservationDetails: {
        type: String,
        required: true
    },
    panoramaCount: {
        type: Number

    },
    merchantCancellable: {
        type: String,
        required: true
    },
    bookingEngineId: {
        type: String

    },
    onRequestPeriod: {
        type: String,
        required: true
    },
    primaryGroupId: {
        type: String,
        required: true
    },
    pas: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    specialReservation: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true

    },
    photoCount: {
        type: Number

    },
    reviewCount: {
        type: String,
        required: true
    },
    primaryDestinationId: {
        type: String,
        required: true
    },
    supplierCode: {
        type: String
    },
    translationLevel: {
        type: String
    },

    primaryDestinationName: {
        type: String
    },
    thumbnailURL: {
        type: String
    },
    priceFormatted: {
        type: String
    },
    rrp: {
        type: String
    },
    rrpformatted: {
        type: String
    },
    onSale: {
        type: String
    },
    videoCount: {
        type: String
    },
    rating: {
        type: String
    },
    thumbnailHiResURL: {
        type: String
    },
    merchantNetPriceFrom: {
        type: String
    },
    merchantNetPriceFromFormatted: {
        type: String
    },
    savingAmount: {
        type: Number,
        default: 0
    },
    savingAmountFormated: {
        type: String
    },
    specialOfferAvailable: {
        type: Boolean
    },
    uniqueShortDescription: {
        type: String
    },
    shortTitle: {
        type: String
    },
    shortDescription: {
        type: String
    },
   
});

export default conn.model('viatorallproduct', schema, 'allproduct_copy');

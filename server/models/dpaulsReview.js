import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection('mongodb://localhost:27017/dpaulsb2c');

const schema = new Mongoose.Schema({
    review_id: {
        type: Number
    },
    onewordreview: {
        type: String
    },
    overall_rating: {
        type: Number
    },
    review: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    ispublish: {
        type: Boolean
    },
    priority: {
        type: Number
    },
    service_id: {
        type: Number
    },
    affiliateId: {
        type: Number
    },
    sendDate: {
        type: Date
    },
    Location: {
        type: String
    },
    service_type: {
        type: String
    },
    likes: {
        type: String
    },
    RowID: {
        type: Number
    },
}, { timestamps: true, versionKey: false });

export default conn.model('DpaulsReviews', schema, 'dpaulsreview');

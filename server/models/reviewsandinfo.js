import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection('mongodb://localhost:27017/dpaulsb2c');

const schema = new Mongoose.Schema({
    reviewTitle: {
        type: String
    },
    reviewBody: {
        type: String
    },
    rating: {
        type: Number
    },
    likes: {
        type: Array
    },
    likedCound: {
        type: Number,
        default: 0
    },
    reviewsSeen: {
        type: Number,
        default: 0
    },
    author: {
        type: Object
    },
    comment: { type: Array }
}, { timestamps: true, versionKey: false });

export default conn.model('ReviewsAndInfo', schema, 'reviewsArticales');

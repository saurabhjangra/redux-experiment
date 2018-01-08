import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection('mongodb://localhost:27017/dpaulsb2c');

const schema = new Mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    message: {
        type: String
    }
}, { timestamps: true, versionKey: false });

export default conn.model('Enquiry', schema, 'enquiry');

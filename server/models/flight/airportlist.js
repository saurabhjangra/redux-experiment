import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection('mongodb://localhost:27017/Airport');

const schema = new Mongoose.Schema({
    AirPortCode: { type: String },
    Description: { type: String },
    City: { type: String },
    Country: { type: String },
    IsTop: { type: String },
}, { timestamps: true, versionKey: false });

export default conn.model('Airport', schema, 'airportlist');

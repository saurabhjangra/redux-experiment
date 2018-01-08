import Mongoose from 'mongoose';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';
Mongoose.Promise = Promise;
const conn = Mongoose.createConnection('mongodb://localhost:27017/viator');

const schema = new Mongoose.Schema({
    sortOrder: {
        type: Number
    },
    selectable: {
        type: Boolean,
        required: true       
    },
    defaultCurrencyCode: {
        type: String,
        required: true,
        default: 'USD'
    },
    lookupId: {
        type: String,
        required: true
    },
    parentId: {
        type: Number,
        required: true
    },
    timeZone: {
        type: String,
        required: true
    },
    iataCode: {
        type: String,
        required: true
    },
    destinationType: {
        type: String,
        required: true
    },
    destinationName: {
        type: String,
        required: true
    },
    destinationId: {
        type: Number,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
});

// export default Mongoose.model('destination', schema, 'destination');
export default conn.model('destination', schema, 'destination');

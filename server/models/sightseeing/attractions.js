import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection('mongodb://localhost:27017/viator');

const schema = new Mongoose.Schema({
    destination: { type: String, required: true },
    destinationId: { type: Number, required: true },
    data: { type: Array, default: [] },
});

schema.virtual('ID').get(function () { return this.code; });

//export default conn.model('Categories', schema, 'categories');

let Attractions = conn.model('Attractions', schema, 'attraction');

export default Attractions;
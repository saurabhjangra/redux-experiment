import Mongoose from 'mongoose';
import Promise from 'bluebird';
Mongoose.Promise = Promise;

const conn = Mongoose.createConnection('mongodb://localhost:27017/eanprod');

const schema = new Mongoose.Schema({
    RegionID: {
        type: Number,

    },
    RegionType: {
        type: String,

    },
    RelativeSignificance: {
        type: String
    },
    SubClass: {
        type: String,
    },
    RegionName: {
        type: String,
    },
    RegionNameLong: {
        type: String,

    },
    ParentRegionID: {
        type: Number,
    },
    ParentRegionType: {
        type: String

    },
    ParentRegionName: {
        type: String,
    },
    ParentRegionNameLong: {
        type: String,

    },

}, {
        timestamps: true,
        versionKey: false
    });

export default conn.model('expediacity', schema, 'parentregionlist');

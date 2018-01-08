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

let Categories = conn.model('Categories', schema, 'categories');

Categories.getCategoriesByDestinationName = (destinationname) => {
    const categorie = Categories.aggregate([
        { $match: { destination: { $regex: new RegExp(`^${destinationname}`, "i") } } },
        { "$unwind": "$data" },
        { $project: { _id: 0, name: "$data.groupName", id: '$data.id', count: '$data.productCount', thumbImg: '$data.thumbnailHiResURL', subCat: '$data.subcategories' } },
    ]).exec()
    return categorie;

}

export default Categories;
import Mongoose from 'mongoose';
import Promise from 'bluebird';
import 'dotenv/config';

Mongoose.Promise = Promise;

const conn = Mongoose.createConnection(process.env.VIATOR_DB_URL);

const reviewsSchema = new Mongoose.Schema({
    sortOrder: { type: Number, trim: true },
    ownerName: { type: String, lowercase: true, trim: true },
    ownerCountry: { type: String, lowercase: true, trim: true },
    productTitle: { type: String, lowercase: true, trim: true },
    productUrlName: { type: String, lowercase: true, trim: true },
    ownerAvatarURL: { type: String, lowercase: true, trim: true },
    sslSupported: { type: Boolean, default: false },
    publishedDate: { type: String, trim: true },
    rating: { type: Number, trim: true },
    review: { type: String, trim: true },
    productCode: { type: String, trim: true },
    submissionDate: { type: String, trim: true },
    ownerId: { type: Number, trim: true },
    viatorFeedback: { type: String, trim: true },
    viatorNotes: { type: String, trim: true },
    reviewId: { type: Number, trim: true }

}, { timestamps: true, versionKey: false });

let Reviews = conn.model('Reviews', reviewsSchema, 'reviews');

export default Reviews;

import Mongoose from 'mongoose';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';
Mongoose.Promise = Promise;
//const conn = mongoose.createConnection('mongodb://localhost/dotw');
const schema = new Mongoose.Schema({

	username: { type: String, trim: true, },
	email: { type: String, required: true, trim: true, index: { unique: true } },
	password: { type: String },
	userdata: { type: Object, default: {} },
	role: { type: String, required: true, default: 'USER' }
},
	{ timestamps: true, versionKey: false });

// After validate hook
schema.post('validate', (doc) => {
	// encrypt the password
	if (doc.password) {
		doc.password = bcrypt.hashSync(doc.password, 10);
	}
});

// Remove the password information when toObject()
schema.options.toObject = {
	transform: function (doc, ret) {
		delete ret.password;
	}
};

//  const mongos = server.plugins['hapi-multi-mongo'].mongo;
//  const db = mongos.example.db('example');
export default Mongoose.model('User', schema, 'Users');

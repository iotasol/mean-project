/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

var UserSchema = new Schema({
	username: String,
	password: String,
	roles: {
		type: String,
		default: 'user'
	},
	firstName: String,
	lastName: String,
	email: String, 
	salt: String
})

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	this.salt = this.createSalt();
	this.password = this.hashPassword(this.password, this.salt);
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password, salt) {
	if (salt && password) {
		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
* Creating instance method for creation of salt
*/
UserSchema.methods.createSalt = function(){
	return new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
};

module.exports = mongoose.model('User', UserSchema);
/**
 * Module dependencies.
 */
var appRootPath = require('app-root-path'),
	User = require(appRootPath +  '/app/model/User');

/*Creation os user for both admin and sub user*/
module.exports.registerUser = function(req, res){
	var user = new User(req.body.combinedObj);
	if(req.body.combinedObj.userType)
		user.roles = req.body.combinedObj.userType;
	user.save(function(err, obj){
		if(err)
			return err;
		res.json(obj);
	});
}

/*check username exists and provide roles*/
module.exports.userSignIn = function(req, res){
	var user = new User();
	User.findOne({username: req.body.combinedObj.username}, function(err, obj){
		if(err)
			return res.json(err);
		else if(obj === null){
			return res.send({"status": obj});
		} else {
			var password = user.hashPassword(req.body.combinedObj.password, obj.salt);
			if(password === obj.password){
				req.session.userId = obj._id;
				req.session.userName = obj.username;
				req.session.role = obj.roles;
				return res.send({'status': 'OK'});
			}
			else
				return res.json(obj);
				// return res.send({"status": "Not Found"});
		}
	})
}

/*Listing of Sub Users*/
module.exports.listVendors = function(req, res){
	User.find({roles: 'user'}, function(err, results){
		res.json(results);
	});
}

/*Fetch Sub User*/
module.exports.fetchVendor = function(req, res){
	User.find({username: req.session.userName, _id: req.session.userId}, function(err, obj){
		if(err)
			return res.json(err);
		return res.json(obj);
	});
}

/*Deleting Sub User*/
module.exports.deleteVendor = function(req, res){
	var arrOfVals = [];
	User.findByIdAndRemove(req.query.vendorId, {}, function(err, obj){
		if(err)
			return res.json(err);
	    arrOfVals.push(obj);	
		return res.json(arrOfVals);
	});
}

/*Updating Sub User*/
module.exports.updateVendor = function(req, res){
	var setValues = {$set: {firstName: req.body.combinedObj.firstName, lastName: req.body.combinedObj.lastName, email: req.body.combinedObj.email}};
	var vendor = new User();
	User.findById(req.body.combinedObj._id, function(err, oldVendor){
		if(oldVendor.password != req.body.combinedObj.password){
			var newSalt = vendor.createSalt();
			var newPassword = vendor.hashPassword(req.body.combinedObj.password, newSalt);
			setValues = {$set: {salt: newSalt, password: newPassword, firstName: req.body.combinedObj.firstName, lastName: req.body.combinedObj.lastName, email: req.body.combinedObj.email}};
		} 
		User.findByIdAndUpdate(req.body.combinedObj._id, setValues, {}, function(err, obj){
			return res.json(obj);
		});
	});
}


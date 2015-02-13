/**
 * Module dependencies.
 */
var appRootPath = require('app-root-path'),
	serverController = require(appRootPath +  '/app/controller/serverController'),
	constants = require(appRootPath + '/app/Constants');

module.exports = function(app){

	app.get('/*', function(req, res){
		var url = req.originalUrl;
		if(url === '/'){
			if(req.session.role === 'admin')
				res.redirect('/subUserCreation');
			else if(req.session.role === 'user')
				res.redirect('/subUserProfile');
			else
				res.sendFile(appRootPath + '/public/pages/login.html');
		} else if(url == '/loggedIn'){
			if(req.session.role === 'admin')
				res.redirect('/subUserCreation');
			else if(req.session.role === 'user')
				res.redirect('/subUserProfile');
			else
				res.redirect('/');
		} else if(url == '/subUserCreation') {
			if(req.session.role === 'admin')
				res.sendFile(appRootPath + '/public/pages/vendorCreation.html');
			else if(req.session.role === 'user')
				res.sendFile(appRootPath + '/public/pages/unauthorized.html');
			else
				res.redirect('/');
		} else if(url == '/subUserProfile') {
			if(req.session.role === 'user')
				res.sendFile(appRootPath + '/public/pages/vendorProfile.html');
			else if(req.session.role === 'admin')
				res.sendFile(appRootPath + '/public/pages/unauthorized.html');
			else
				res.redirect('/');
		} else if(url == '/about') {
			if(req.session.role === 'admin')
				res.sendFile(appRootPath + '/public/pages/vendorList.html');
			else if(req.session.role === 'user')
				res.sendFile(appRootPath + '/public/pages/unauthorized.html');
			else
				res.redirect('/');
		} else if(url == '/logout'){
			req.session.destroy();
			res.redirect('/');
		} else if(url.indexOf('api/meanLogin') > -1){
			if(req.query.otype === constants.allVendor)
				serverController.listVendors(req, res);
			else if(req.query.otype === constants.fetchVendor)
				serverController.fetchVendor(req, res);
			else if(req.query.otype === constants.deleteVendor)
				serverController.deleteVendor(req, res);
		} else if(url == '/register?userType=admin')
			res.sendFile(appRootPath + '/public/pages/signup.html');
		else
			res.sendFile(appRootPath + '/public/pages/notAvailable.html');
	});

	/*POST REQUEST*/
	app.post('/api/meanLogin', function(req, res){
		if(req.query.otype === constants.registerUser)
			serverController.registerUser(req, res);
		else if(req.query.otype === constants.userSignIn)
			serverController.userSignIn(req, res);
		else if(req.query.otype == constants.updateVendor)
			serverController.updateVendor(req, res);
	});

	/*GET REQUEST*/
	// app.get('/api/meanLogin', function(req, res){
	// 	if(req.query.otype === constants.allVendor)
	// 		serverController.listVendors(req, res);
	// 	else if(req.query.otype === constants.fetchVendor)
	// 		serverController.fetchVendor(req, res);
	// 	else if(req.query.otype === constants.deleteVendor)
	// 		serverController.deleteVendor(req, res);
	// })
}


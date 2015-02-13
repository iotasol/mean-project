angular.module('mean-login-service').factory('MeanLoginService', function($resource){
	return $resource('/api/meanLogin?otype=:otype&vendorId=:vendorId', {otype:'@otype', vendorId:'@vendorId'}, {
		query: {
			method: 'GET',
			params: {},
			isArray: true
		},
		post: {
			method: 'POST',
			params: {},
			data: "",
			isArray: false
		}
	});
});
angular.module('mean-login-controller').controller("meanController", function($scope, MeanLoginService){
	$scope.meanObj = {};
	$scope.vendorList = [];
	$scope.currentPage = 1;
	var AlertErrorMsgTimeOut;

	/*Clear all the fields of user or vendor object*/
	$scope.cleanMeanObject = function(){
		$scope.meanObj.username = '';
		$scope.meanObj.password = '';
		$scope.meanObj.confirmPassword = '';
		$scope.meanObj.firstName = '';
		$scope.meanObj.lastName = '';
		$scope.meanObj.email = '';
		$scope.meanObj.userType = $scope.getParameterByName('userType')
	}

	$scope.getParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	$scope.cleanMeanObject();

	/*Display alert message*/
	$scope.showAlertError = function(headerText, textMessage, addClass){
		$('#alert').hide();
		$('#alert').removeClass();
		if(textMessage==undefined || textMessage == '') 
			textMessage = 'Some error has occured. Please retry.';
		$('.errorHeadText').html(headerText);
		$('.errorText').html(' ' + textMessage);
		$('#alert').addClass('alert ' + addClass);
		$('#alert').show();
		$('.alert').fadeIn();
		AlertErrorMsgTimeOut = window.setTimeout(function() {
				$('#alert').fadeOut();
				$('.errorHeadText').html('');
				$('.errorText').html('');
				$('#alert').removeClass();
		    }, 5000); 
	};

	/*Hide the alert message*/
	$scope.hideAlertError = function(){
		clearTimeout(AlertErrorMsgTimeOut);
		$('#alert').fadeOut();
		$('#alert').removeClass();
		$('.errorHeadText').html('');
		$('.errorText').html('');
	};

	/*For User Creation and also for Sub User Creation*/
	$scope.registerUser = function(){
		if($scope.meanObj.username == ''){
			$scope.showAlertError('Error !', 'Please enter Username.', 'alert-danger');
			return;
		}
		if($scope.meanObj.password == ''){
			$scope.showAlertError('Error !', 'Please enter Password.', 'alert-danger');
			return;
		}
		if($scope.meanObj.confirmPassword == ''){
			$scope.showAlertError('Error !', 'Please enter Confirm Password.', 'alert-danger');
			return;
		}
		if($scope.meanObj.password != $scope.meanObj.confirmPassword){
			$scope.showAlertError('Error !', 'Password and Confirm Password are not same.', 'alert-danger');
			return;
		}
		if($scope.meanObj.firstName == ''){
			$scope.showAlertError('Error !', 'Please enter First Name.', 'alert-danger');
			return;
		}
		if($scope.meanObj.lastName == ''){
			$scope.showAlertError('Error !', 'Please enter Last Name.', 'alert-danger');
			return;
		}
		if($scope.meanObj.email == ''){
			$scope.showAlertError('Error !', 'Please enter Email', 'alert-danger');
			return;
		}
		if(!$scope.validEmailAddress($scope.meanObj.email, "email address"))
			return;
		MeanLoginService.post({otype: 'registerUser', combinedObj: $scope.meanObj}, function(obj){
			if(obj.roles === "admin")
				window.location = "/";
			$scope.cleanMeanObject();
			$scope.showAlertError('Success !', 'User Created successfully.', 'alert-success');
			$scope.listOfVendors();
		});
		
	};

	/*For User as well as Sub User Sign In*/
	$scope.checkUserSignIn = function(){
		if($scope.meanObj.username == ''){
			$scope.showAlertError('Error !', 'Please enter Username.', 'alert-danger');
			return;
		}
		if($scope.meanObj.password == ''){
			$scope.showAlertError('Error !', 'Please enter Password.', 'alert-danger');
			return;
		}
		MeanLoginService.post({otype: 'userSignIn', combinedObj: $scope.meanObj}, function(obj){
			$scope.cleanMeanObject();
			if(obj.status == 'OK'){
				window.location = '/loggedIn';
			} else if(obj.status == null){
				$scope.showAlertError('Error !', 'Invalid Username/Password.', 'alert-danger');
			}
		});
	};

	/*Query for the listing of sub users*/
	$scope.listOfVendors = function(){
		MeanLoginService.query({otype:'allVendor'}, function(obj){
			$scope.vendorList = obj;
		});
	}

	/*Query to fetch sub user*/
	$scope.fetchVendorProfile = function(){
		MeanLoginService.query({otype:'fetchVendorProfile'}, function(obj){
			$scope.meanObj = obj[0];
			$scope.meanObj.confirmPassword = obj[0].password;
		});
	}

	/*Query to fetch admin profile*/
	$scope.fetchAdminProfile = function(){
		MeanLoginService.query({otype:'fetchVendorProfile'}, function(obj){
			$scope.adminObj = obj[0];
		});
	}

	/*Deleting Sub User*/
	$scope.deleteVendor = function(_obj){
		MeanLoginService.query({otype:'deleteVendor', vendorId: _obj._id}, function(obj){
			angular.forEach($scope.vendorList, function(item, index){
				if(obj[0]._id == item._id)
					$scope.vendorList.splice(index, 1);
			});
		});
	};

	/*Updating Sub User*/
	$scope.updateVendorProfile = function(){
		if($scope.meanObj.password == ''){
			$scope.showAlertError('Error !', 'Please enter Password.', 'alert-danger');
			return;
		}
		if($scope.meanObj.confirmPassword == ''){
			$scope.showAlertError('Error !', 'Please enter Confirm Password.', 'alert-danger');
			return;
		}
		if($scope.meanObj.password != $scope.meanObj.confirmPassword){
			$scope.showAlertError('Error !', 'Password and Confirm Password are not same.', 'alert-danger');
			return;
		}
		if($scope.meanObj.firstName == ''){
			$scope.showAlertError('Error !', 'Please enter First Name.', 'alert-danger');
			return;
		}
		if($scope.meanObj.lastName == ''){
			$scope.showAlertError('Error !', 'Please enter Last Name.', 'alert-danger');
			return;
		}
		if($scope.meanObj.email == ''){
			$scope.showAlertError('Error !', 'Please enter Email', 'alert-danger');
			return;
		}
		if(!$scope.validEmailAddress($scope.meanObj.email, "email address"))
			return;
		MeanLoginService.post({otype: 'updateVendor', combinedObj: $scope.meanObj}, function(obj){
			$scope.meanObj = obj;
			$scope.meanObj.confirmPassword = obj.password;
			$scope.showAlertError('Success !', 'Vendor Updated successfully.', 'alert-success');
		});
	};

	/*Email Address Validation*/
	$scope.validEmailAddress = function(email, error){
		//var email = id;
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filter.test(email))
		{
			$scope.showAlertError('Error!', 'Please provide a valid ' + error + '.', 'alert-danger');
			return false;
		}
		return true;
	};

});
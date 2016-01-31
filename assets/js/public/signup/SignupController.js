angular.module('SignupControllers', [])
.controller('SignupController', ['$scope', '$http', 'toastr', 'DataBaseService', function($scope, $http, toastr, DataBaseService){

	$scope.housings = [];
	
	// setup loading state
	$scope.signupForm = {
		loading: false
	}

	DataBaseService.housing.query(function(res){
		console.log(res);
		$scope.housings = res;
	})

	$scope.selectedAddress = function(selected) {
      if (selected) {
        console.log(selected.originalObject);
				$scope.signupForm.housingId = selected.originalObject.id;
      } else {
				$scope.signupForm.housingId = null;
        console.log('cleared');
      }
    };

		$scope.addressRequired = true;

	$scope.submitSignupForm = function(){
		$scope.signupForm.loading = true;

		$http.post('/signup', {
			name: $scope.signupForm.name,
			housingId: $scope.signupForm.housingId,
			email: $scope.signupForm.email,
			password: $scope.signupForm.password
		})
		.then(function onSuccess(sailsResponse){
			window.location = '/';
		})
		.catch(function onError(sailsResponse){
			// Handle known error type(s).
			// If using sails-disk adpater -- Handle Duplicate Key
			var emailAddressAlreadyInUse = sailsResponse.status == 409;

			if (emailAddressAlreadyInUse) {
				toastr.error('That email address has already been taken, please try again.', 'Error');
				return;
			}
		})
		.finally(function eitherWay(){
			$scope.signupForm.loading = false;
		})

	}
}]);

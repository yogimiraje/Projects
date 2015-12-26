app.controller('SettingsCtrl', function ($http, $scope, $location, $rootScope,ProfileService)
{
	console.log("In SettingsCtrl ");
	
	$scope.selectedTab = 1;

	var id = $rootScope.currentUser._id;
	//console.log(id);
	 
	 
	
	ProfileService.profileDetails(id,function(response){

	$scope.user = response;
	console.log("old user:")
	console.log(response);
	if($scope.user.need.summary){
	//	console.log('I am a recipient');
		$scope.recipient = true;
		
	}
	else{
	//	console.log('I am a NOT recipient');

		$scope.recipient = false;
	}
	
	 
	});
	
	
	$scope.update = function(user){  

		$scope.sucessfulMessage = false;
    	
			console.log("updated user:")
			console.log(user);
    		 
			 
    		$http.post("/rest/update", user)
            .success(function(response){
                console.log(response);
                
                if(response != null)
                {
                    $rootScope.currentUser = response;
                    console.log('update user:' +   $rootScope.currentUser);
                    $scope.sucessfulMessage = true; 
                    alert('Profile updated successfully !');
                    $location.path("/profile");
                }
                
            })
    		 
    	 
    	
    	 
    }
 
	
	
	var handleFileSelect = function (evt) {
        var files = evt.target.files;
        var file = files[0];

        if (files && file) {
            var reader = new FileReader();

            reader.onload = function (readerEvt) {
                var binaryString = readerEvt.target.result;
                $scope.user.imgurl = "data:image/jpeg;base64," + btoa(binaryString);
                $scope.$apply();
                console.log('uploaded:');
                console.log($scope.user.imgurl);
               
            };
            reader.readAsBinaryString(file);
            
        }
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $('#filePicker').change(handleFileSelect);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
});
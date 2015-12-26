app.controller('PublicProfileCtrl', function ($http, $scope, $location,$rootScope,LoginService,$routeParams){
console.log("In PublicProfileCtrl ");
//console.log($rootScope.currentUser);
$scope.selectedTab = 1;

var username = $routeParams.username
console.log(username);
  
 
$http.get('/rest/publicProfile/' + username)
.success(function (response) {
	console.log('getting Profile Details');

	//$scope.publicProf = response;
	$scope.user = response;
	console.log($scope.user);  
	
	 if(response.role == "both"){
 		$scope.receiver = true;
 		$scope.amount = response.need.amount;
 		 
 		console.log(response.need.amountReceived);
 		
 		if(response.need.receivedAmount == 0){
 			$scope.receivedAmount = "0"
 		}
 		else
		{
		$scope.receivedAmount =	response.need.amountReceived;
		}
	 }
	
	 if($rootScope.currentUser){
		 
		 if ($scope.user.username != $rootScope.currentUser.username){
			 $scope.selfView = false;
		 }
		 else{
			 $scope.selfView = true;
		 }
		 followDisplay();
	 }
	 else{
		 $scope.followText = "Follow";
		 $scope.selfView = false;
	 }
		
});
	 
function followDisplay(){
	 
	$http.get('/rest/following/'+ $rootScope.currentUser.username)
    .success(function (response) {
    
     $scope.currentUserFollowing = response;
      
     for(var i in $scope.currentUserFollowing){
	    	
	    	if($scope.currentUserFollowing[i] == $scope.user.username){
	    		console.log('following found');
	    		$scope.followText = "Unfollow" ;
	    	    return;
	    	}
	    	 

	    }
	 
	 $scope.followText = "Follow" ;
		return; 
      
     });
	    
} 
 
$scope.viewNeedProfile = function(username){
	
	console.log('In view need profile:'+ username);
	
	$http.get('/rest/getid/' + username)
	.success(function (response) {
		var userID = response;
		console.log(userID);
		
        $location.url("/viewDetail/" + userID);

	});	
} 


//function to follow/unfollow the user
$scope.follow = function(followedUsername){
	
	console.log('In follow:'+ followedUsername);

	
	if($rootScope.currentUser){
		
		var followInfo = {"username" : $rootScope.currentUser.username, "followedUsername": followedUsername};
		
		//console.log(followInfo);
		
		if($scope.followText == "Unfollow"){
			
    		$http.put("/rest/unfollow", followInfo)
            .success(function(response){
                //console.log(response);
          		console.log("unfollowed..updated bookmarks:"+ response )
        		$scope.followText = "Follow" ;
          		$scope.user.follower = response;
        			
             //	console.log("in bookmark user:" + username);

            });
    		
    	}	
    	else{
    		$http.put("/rest/follow", followInfo)
            .success(function(response){
            	
                console.log(response);
        		$scope.followText = "Unfollow" ;
        		$scope.user.follower = response;
        		 

            });
    	}	
    }
	else{
		alert('Please Sign in to follow this recipient !');
	}
			
	}


});
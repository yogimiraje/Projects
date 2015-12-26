

app.controller('ViewCtrl', function ($http, $scope, $location, $rootScope,LoginService,$routeParams)
{
	console.log("In View controller ");
	$scope.fetched = 0;
	var category = $routeParams.category;
	
	
	LoginService.chkLogin(function(response){
		console.log('Current User:');
		 $rootScope.currentUser = response;
		 console.log($rootScope.currentUser);
	});
	
	
    var needsData = getNeedsData();
     
    function getNeedsData() {
    	console.log('sending request for category:' + category);

	    $http.get('/rest/recipient/' + category)
	    .success(function (response) {
	    	
	    	$scope.needsData = response;
	    	console.log(response);  
	    	$scope.fetched = 1;
	  	    });

      }
     
    $scope.viewDetail = function (id) {

      
        console.log('In view controller....routing to view details for ID :');
        console.log(id);
         
     	$location.path('/viewDetail/' + id );
    }
    

    $scope.go = function ( path ) {
    	  $location.path( path );
    	};
  
});




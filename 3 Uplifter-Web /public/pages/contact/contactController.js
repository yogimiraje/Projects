
app.controller('ContactCtrl', function ($http,$scope, $rootScope,LoginService)
{
	console.log("In ContactCtrl controller ");
	
	LoginService.chkLogin(function(response){
		console.log('Current user: ')
		$rootScope.currentUser = response;
		 console.log($rootScope.currentUser);
	});
	

    $scope.go = function ( path ) {
    	  $location.path( path );
    	};
  
    
});
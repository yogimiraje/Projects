app.controller('LoginCtrl', function($scope, $http, $location,$rootScope)
{
	 
	$('.nav :not(.dropdown) a').on('click', function(){ 
        if($('.navbar-toggle').css('display') !='none'){
            $(".navbar-toggle").trigger( "click" );
        }
    });

	$http.get('/rest/loggedin').success(function(user)
    {
		if (user !== '0'){
        	$rootScope.currentUser = user;
        }     
        
    });
	
    $scope.userloggedin = null;
    $scope.login = function(user)
    {
        
        
        $http.post('/rest/login', user)
        .success(function(response)
        {
        	console.log("Logged in Now-  current user: ");
            $rootScope.currentUser = response;
            console.log($rootScope.currentUser);
            
            $location.path("/profile");
        })

        .error(function(response)
        {
            $scope.user = null;
            alert('User name and password does not match !');
            
        });
    }


    $scope.logout = ( function () {

        $http.post('/rest/logout')
        .success(function (response) {
            $scope.user = null;
            $rootScope.currentUser = null;
            $location.path("/");
        });
    });

    $scope.go = function ( path ) {
    	  $location.path( path );
    	};
  
});
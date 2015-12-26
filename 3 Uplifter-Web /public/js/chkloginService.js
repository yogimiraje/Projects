app.factory('LoginService', function LoginService($http) {

	console.log("In LoginService ");

    var chkLogin = function(callback){
    	
    	$http.get('/rest/loggedin').success(function(user){
    	 
			if (user !== '0'){
				  callback;
	        }     
        
    	});
    }
	
	return {
        chkLogin: chkLogin 
    }
});

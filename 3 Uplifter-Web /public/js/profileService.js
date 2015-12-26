app.factory('ProfileService', function ProfileService($http) {

	console.log("In profileService ");
	
	
    var profileDetails = function(id,callback){
    	console.log(id);
    	 $http.get('/rest/profile/'+ id)
        .success(callback);
    	 
        }
   
    
	return {
		profileDetails: profileDetails  
    }
   
});
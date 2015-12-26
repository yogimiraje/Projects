

app.controller('ViewDetailCtrl', function ($scope,$rootScope, $http,$routeParams)
{
	//console.log($routeParams);
	console.log('in view detail controller..fetching details for ID:');
	var id = $routeParams.id;
 	$scope.donateClicked = false;
    $scope.donationDone = false;
    
    $scope.class = unbookmarkedClass ;
    
    var bookmarkedClass = "bookmarked glyphicon glyphicon-star";
    var unbookmarkedClass = "glyphicon glyphicon-star-empty";
   
    $http.get('/rest/loggedin').success(function(user)
    {
		if (user !== '0'){
			console.log('fetched current user info');
        	$rootScope.currentUser = user;
            console.log($rootScope.currentUser);
        
        }
		else{
			 
		    $scope.class = unbookmarkedClass ;
		}
		getNeedsData();
    });
    
    //var needsData = getNeedsData();
 
    
 //*************************** Get Need Details ************************************************   
    function getNeedsData() {
    	
    	console.log('in getNeedsData()');
        $http.get('/rest/details/'+ id)
        .success(function (response) {
        	
         var needDetail = response;
         
         $scope.needDetail = needDetail;
          
         console.log($scope.needDetail);
         
      	if($scope.needDetail.receivedAmount == 0){
      		//console.log('amount 0')
			$scope.receivedAmount = "0"
		}
		else
		{
			
			$scope.receivedAmount =	String($scope.needDetail.amountReceived);
			//console.log($scope.receivedAmount);
		}
      	
        if($rootScope.currentUser){
        	getBookmarkDetails();
        }
      });
    }
    
 
//*************************** Get Bookmark Details ************************************************   
    
 function getBookmarkDetails(){
	 console.log('in getBookmarkDetails()');
	 
	 $http.get('/rest/bookmarkedUsers/'+ $rootScope.currentUser.username)
     .success(function (response) {
     	
      var bookmarkedUsers = response;
      
      $scope.bookmarkedUsers = bookmarkedUsers;
       
      console.log(' BookmarkDetails received: ' + $scope.bookmarkedUsers);
      bookmarkDisplay();
      
     });
 } 
 
 function bookmarkDisplay(){
	 
	 var  bk= $scope.bookmarkedUsers;
	// console.log('in bookmarkDisplay()');
	// console.log(bk);
	 
	 
	 for(var i in bk){
	    	//console.log('bookmark searching....:' + bk[i]);
	    	
	    	if(bk[i] == $scope.needDetail.username){
	    		console.log('user found');
	    	    $scope.class = bookmarkedClass ;
	    	    return;
	    	}
	    	 

	    }
	 
    $scope.class = unbookmarkedClass ;
	return;    
 }
    
    
    
//****************************** Donate  ************************************************   
    
    $scope.donate = function(){
    	console.log("doante clicked");
    	$scope.donationDone = false;
    	 
    	if($rootScope.currentUser){
    		
    		
    			$scope.donateClicked = true;
    		
    		 
    	}
    	else{
    		alert('Please Sign in to donate');
    	}
    	
		 
     }
    
    $scope.cancel = function(){
    	console.log("doante cancelled");
    	$scope.donateClicked = false;
    	
    	$scope.donation = null;
    }
    
    $scope.processDonation = function(){
    	console.log("process donation");
    	$scope.donation.donor = $rootScope.currentUser.username;
    	$scope.donation.donorName = $rootScope.currentUser.first;
    	$scope.donation.receiver = $scope.needDetail.username;
    	$scope.donation.receiverName = $scope.needDetail.name;
    	$scope.donation.totalReceived = $scope.needDetail.amountReceived + $scope.donation.amount;

    	$scope.donation.date = new Date;
		console.log($scope.donation);
		
		$http.put("/rest/donate", $scope.donation)
        .success(function(response){
            console.log(response);
             
            $scope.receivedAmount = $scope.donation.totalReceived
            $scope.donationDone = true;
            $scope.cancel();
            
        });
		
    }
    
    
    //  function to bookmark the user
    $scope.bookmark = function(bookmarkedUsername){
    	
    	if($rootScope.currentUser){
    		
    		var bookmarkInfo = {"username" : $rootScope.currentUser.username, "bookmarkedUsername": bookmarkedUsername};

    		if($scope.class == bookmarkedClass){
    			
        		$http.put("/rest/removeBookmarked", bookmarkInfo)
                .success(function(response){
                    //console.log(response);
            		$scope.class = unbookmarkedClass ;
            		 

            		 
            		$scope.bookmarkedUsers =  response;
            		console.log("removed bookmarked..updated bookmarks:"+ $scope.bookmarkedUsers )

            			
                 //	console.log("in bookmark user:" + username);

                });
        		
        	}
        	else{
        		
        		
        		$http.put("/rest/bookmark", bookmarkInfo)
                .success(function(response){
                	
                    //console.log(response);
            		$scope.class = bookmarkedClass ;
            		$scope.bookmarkedUsers = response;
            		console.log("added bookmarked..updated bookmarks:"+ $scope.bookmarkedUsers )

                 //	console.log("in bookmark user:" + username);

                });
        		
        	}	
		
		 
	}
	else{
		alert('Please Sign in to bookmark this recipient !');
	}
			
    }
    
    /*
    $scope.hoverIn = function(){
        $scope.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        $scope.hoverEdit = false;
    };
    */
    
//****************************** Post Comment  ************************************************   
     
    $scope.postComment = function(){
    	console.log('postComment');
    	
    	if($rootScope.currentUser){
    		var comment = {};
    		
    		comment.commentor = $rootScope.currentUser.username;
    		comment.receiver = $scope.needDetail.username;
    		comment.commentedOn = new Date;
    		comment.text = $scope.newComment;
    		
    		console.log(comment);
    		
    		$http.put("/rest/postComment", comment)
            .success(function(response){
                console.log(response);
                $scope.needDetail.comment =  response;
                $scope.newComment = null;
            });

    	}
    	else{
            $scope.newComment = null;
    		alert('Please Sign in to post the comment !');

    	}
    	
    	
    }
    

    $scope.go = function ( path ) {
    	  $location.path( path );
    	};
  
});




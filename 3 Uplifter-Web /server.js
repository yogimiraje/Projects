// Initialization 
var express = require('express');
var app     = express();

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bodyParser = require('body-parser');
var multer     = require('multer'); 

var cookieParser = require('cookie-parser');
var session      = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser())

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/uplifter';

mongoose.connect(connectionString);
//----------------------------------------------------------------------

// Schema definitions
var commentSchema = new Schema({
	commentor: String,
	commentedOn : Date,
	text: String
});

var donationReceivedSchema = new Schema({
	donor: String,
	donorName:  String,
	amount: Number,
	receivedOn : Date,
 	message: String
});

var donationGivenSchema = new Schema({
	receiver: String,
	receiverName:  String,
	amount: Number,
	givenOn : Date,
 	message: String
});

var userSchema = new Schema({
	username: String,
	first:  String,
	last: String,
	password: String,
	email: String,
	address:String,
	imgurl: String,
	role: String,                       // "both" : Recipient and Donor, "Donor" : only donor 
	need: {
		  amount: Number,
		  amountReceived: Number,
		  category: String,
		  summary: String,
		  text: String,
		  comment: [commentSchema]
		  
	},
	donationReceived: [donationReceivedSchema],
	donationGiven: [donationGivenSchema],
	bookmarked: [String],
	following: [String],
	follower: [String]
	
},
{collection:"user"});




// Model creation

var User = mongoose.model("User",userSchema);


//----------------------------------------------------------------------
// REGISTER and LOGIN :
//----------------------------------------------------------------------

passport.use(new LocalStrategy(
function(username, password, done)
{
    console.log("I am in startegy");
   // console.log(username);
   // console.log(password);
  
    
    User.findOne({username: username, password: password}, function(err, user)
    {
	      if (err) { return done(err); }
	      if (!user) { return done(null, false); }
	       
	     
          return done(null, user);
     })

}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


app.post('/rest/login', passport.authenticate('local'), function(req, res)
{
    console.log("sending you the user data");
    var user = req.user;
    
    User.findOne({username: user.username}, function(err, user)
    {  
    	if(err) 
        { 
    		console.log(err); 
            return next(err); 
        }
           // console.log(user);
    	res.json(user);
    });

});
 
app.post('/rest/register', function(req, res)
		{
			console.log('in rest/register');
			
		    var newUser = req.body;
		    
		    if(newUser.need){
		    	newUser.need.amountReceived = 0;
		    	newUser.role = "both";
		    }
		    else
	    	{
		    	newUser.role = "donor";
	    	}
        
		     console.log(newUser);
		    
		    User.findOne({username: newUser.username}, function(err, user)
		    {
		    	
		        if(err) 
		        { console.log(err); 
		          return next(err); 
		        }
		        
		        if(user)
		        {
		        	console.log('this user already exists:')
		        	//console.log(user.username);
		        	res.json(null);
		            return;
		        }
		        
		        var newUser = new User(req.body);
		        
		        newUser.save(function(err, newUser)
			        {
		        	
		        		JSON.stringify(newUser)
		        		
		        	/*
		        		var user = {};
		        		user._id = newUser._id;
		        		user.username = newUser.username;
		        		user.password = newUser.password;*/
		        		
			            req.login(newUser, function(err)
			            {
			                if(err) { return next(err); }
			                 res.json(newUser);
			            });
			        });
		       
		      
		    });
});

var auth = function(req, res, next)
{
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};


app.get('/rest/loggedin', function(req, res)
{
    res.send(req.isAuthenticated() ? req.user : '0');
});
    

app.post('/rest/logout', function(req, res)
{
    req.logOut();
    res.send(200);
});

//----------------------------------------------------------------------
//VIEW RECIPIENT  
//----------------------------------------------------------------------
app.get('/rest/recipient/:category', function(req, res){
	 
	console.log('/rest/recipient');
	var categoryRequested = req.params.category;
	console.log('searching category: ' + categoryRequested);
	
	if (categoryRequested == "all"){
		User.find({}, function(err, users) {
			sendRecipientData(users,res);
	  });
	} 
	else{
		User.find({'need.category': categoryRequested}, function(err, users) {
			sendRecipientData(users,res);
		  }); 
	  }
 
});

function sendRecipientData(users,res){
	
	var recipientData = [];
    
    users.forEach(function(user) {
    	
      if(user.need.summary != null){	
    //	  console.log(user.need);
	      var recipient = {};
	      recipient.id = user._id,
	      recipient.name = user.first + ' ' +  user.last ;
	      
	      recipient.category = user.need.category;
	      recipient.amount = user.need.amount;
	      recipient.summary = user.need.summary;
	      
	      recipientData.push(recipient);
      }
    });

    res.send(recipientData);  
}


//get recipient details by ID
app.get('/rest/details/:id', function(req, res){
	 
	
	var id = req.params.id
	//console.log(id);
	
	User.findById(req.params.id, function(err, user) {
		  if(err) console.log(err);
		
		  var details = {};
		
		  details.id = user._id,
		  details.username = user.username,
		  details.name = user.first + ' ' +  user.last ;
		  details.email = user.email;
		  details.address = user.address;
		  details.imgurl = user.imgurl;
		  details.role = user.role;
		  
		  details.amount = user.need.amount;
		  details.amountReceived = user.need.amountReceived;
		  details.category = user.need.category;
		  details.summary = user.need.summary;
		  details.text = user.need.text;
		  details.comment = user.need.comment

		  res.send(details);  
	  }); 
	
});

// get recipient details by username
app.get('/rest/getid/:username', function(req, res){
	 
	console.log('in /rest/getid');
	var username = req.params.username
	console.log(username);
	
	User.findOne({username:req.params.username}, function(err, user) {
		  if(err) console.log(err);
		  console.log(user._id);
		  res.json(user._id);  
	  }); 
	
});



//----------------------------------------------------------------------
// DONATE :
//----------------------------------------------------------------------
app.put('/rest/donate', function(req, res){
		console.log('in rest/donate');
	 
		delete req.body._id;
		var donation = req.body;
		
		
		
		var donationRec = {};
		
		donationRec.donor = donation.donor;
		donationRec.donorName = donation.donorName;
		donationRec.amount = donation.amount;
		donationRec.message = donation.message;
		donationRec.receivedOn = donation.date;

		console.log(donationRec);
		
		var donationGive = {};
		
		console.log(donationGive);

		 
		donationGive.receiver = donation.receiver;
		donationGive.receiverName = donation.receiverName;
		donationGive.amount = donation.amount;
		donationGive.message = donation.message;
		donationGive.givenOn = donation.date;
		 
		console.log(donationRec);
		var amountUpdated = donation.totalReceived;
		//console.log('amountUpdated:' + donation.totalReceived);
		 
	 
		 
		 User.findOne({username:donation.receiver}).exec(function(err,user) {
			   user.donationReceived.push(donationRec);
			   user.save(function(err){
				   if(err){
					   console.log(err);
					   return next(err);
				   }
				   else
				   {
				    user.update({$set: {"need.amountReceived": donation.totalReceived }}, function(err, count){
					 if(err) { 
							console.log(err);
							return next(err);
						}
						console.log(count);

					 	User.findOne({username:donation.donor}).exec(function(err,user){
				 	  	 user.donationGiven.push(donationGive);
				 		 user.save(function(err){
							   if(err){
								   console.log(err);
								   return next(err);
							   }
							   
				 		 });	 
					 		
					 	});
						
						
					 });
				   }
			   });
			});
		
		
		//console.log(donationGive);
		res.json("Done");
		
});		

//----------------------------------------------------------------------
// BOOKAMRK:    
//----------------------------------------------------------------------
app.get('/rest/bookmarkedUsers/:reqUser', function(req,res){
	console.log('in rest/bookmarkedUsers');
 	
	var reqUser = req.params.reqUser;
	console.log(reqUser);
	User.findOne({username:reqUser}).exec(function(err,user) {
		    
			   if(err){
				   console.log(err);
				   return ;
			   }
			   else
			   {
				   console.log(user.bookmarked);
				   res.json(user.bookmarked);
			   }
		   
		});
	
});

app.put('/rest/bookmark', function(req, res){
	console.log('in rest/bookmark');
 
 	var bookmarkInfo = req.body;
 	
	console.log(bookmarkInfo);
	
	User.findOne({username:bookmarkInfo.username}).exec(function(err,user) {
		   user.bookmarked.push(bookmarkInfo.bookmarkedUsername);
		   
		   user.save(function(err){
			   if(err){
				   console.log(err);
				   return next(err);
			   }
			   else
			   {
				   console.log(user.bookmarked);
				   res.json(user.bookmarked);
			   }
		   });
		});
	
});

app.put('/rest/removeBookmarked', function(req, res){
	console.log('in rest/bookmark');
 
 	var bookmarkInfo = req.body;
 	
	console.log(bookmarkInfo);
	
	User.findOne({username:bookmarkInfo.username}).exec(function(err,user) {
		   user.bookmarked.pull(bookmarkInfo.bookmarkedUsername);
		   
		   user.save(function(err){
			   if(err){
				   console.log(err);
				   return next(err);
			   }
			   else
			   {
				   console.log(user.bookmarked);
				   res.json(user.bookmarked);
			   }
		   });
		});
	
});

//----------------------------------------------------------------------
// POST COMMENT :
//----------------------------------------------------------------------
app.put('/rest/postComment', function(req, res){
		console.log('in rest/postComment');
		

 		var comment = req.body;
 		var commentReceiver = comment.receiver;
 		
 		delete comment._id;
 		delete comment.receiver;
 		
		console.log(comment);
 		
		User.findOne({username:commentReceiver}).exec(function(err,user) {
		   user.need.comment.push(comment);
		   
		   user.save(function(err){
			   if(err){
				   console.log(err);
				   next(err) ;
			   }
			   else
			   {
				   console.log(user.need.comment);
				   res.json(user.need.comment);
			   }
		   });
		});
});
		
	
			
//----------------------------------------------------------------------
// PROFILE and SETTINGS :
//----------------------------------------------------------------------

app.get('/rest/profile/:id', function(req, res){
	
	console.log('in /rest/profile');
	User.findById(req.params.id, function(err, user) {
		  if(err) {
			  console.log(err);
		  }
		//  console.log(user);
		  res.json(user);
		
	});	
});


app.get('/rest/publicProfile/:username', function(req, res){
	
	console.log('in rest/publicProfile');
	User.findOne({username:req.params.username}, function(err, user) {
		  if(err) {
			  console.log(err);
		  }
	      //console.log(user);
		  res.json(user);
		
	});	
});


app.post('/rest/update', function(req, res){
	console.log('in rest/update');
	
    var user = req.body;
    
    console.log(user);
    
  

	User.find({username: user.username}).remove(function(err,response){
		
		if(err) { return next(err); }
		
		console.log('user removed')
		
		var newUser = new User(user);
        
        newUser.save(function(err, newUser)
	        { 
        	   if(err) { return next(err); }
        	    console.log('user saved');
                res.json(newUser);
	             
	        });
	});      
				   
});		

//----------------------------------------------------------------------
// FOLLOW /UNFOLLOW :
//----------------------------------------------------------------------
app.get('/rest/following/:reqUser', function(req,res){
	console.log('in rest/following');
 	
	var reqUser = req.params.reqUser;
	console.log(reqUser);
	User.findOne({username:reqUser}).exec(function(err,user) {
		    
			   if(err){
				   console.log(err);
				   return ;
			   }
			   else
			   {
				   console.log(user.following);
				   res.json(user.following);
			   }
		   
		});
	
});
app.put('/rest/follow', function(req, res){
	console.log('in rest/follow');
 
 	var followInfo = req.body;
 	
	console.log(followInfo);
	
 	 
	User.findOne({username:followInfo.username}).exec(function(err,user) {
		   user.following.push(followInfo.followedUsername);
		   
		   user.save(function(err){
			   if(err){
				   console.log(err);
				   return next(err);
			   }
			   else
			   {
				   var currentUserFollowing = user.following;
				   ///
				   User.findOne({username:followInfo.followedUsername}).exec(function(err,user) {
					   user.follower.push(followInfo.username);
					   
					   user.save(function(err){
						   if(err){
							   console.log(err);
							   return next(err);
						   }
						   else
						   {
							   console.log(user.follower);
							   res.json(user.follower);
						   }
					   });
					});
				   
				   ///
 			   }
		   });
		});

});

app.put('/rest/unfollow', function(req, res){
	console.log('in rest/unfollow');
 
 	var unfollowInfo = req.body;
 	
	//console.log(unfollowInfo);
	
	User.findOne({username:unfollowInfo.username}).exec(function(err,user) {
		   user.following.pull(unfollowInfo.followedUsername);
		   
		   user.save(function(err){
			   if(err){
				   console.log(err);
				   return next(err);
			   }
			   else
			   {
				    
				   var currentUserFollowing = user.following;
				   ///
				   User.findOne({username:unfollowInfo.followedUsername}).exec(function(err,user) {
					   user.follower.pull(unfollowInfo.username);
					   
					   user.save(function(err){
						   if(err){
							   console.log(err);
							   return next(err);
						   }
						   else
						   {
							   console.log(user.follower);
							   res.json(user.follower);
						   }
					   });
					});
				   
				   ///
			   }
		   });
		});
	
});

//----------------------------------------------------------------------
//OTHER SERVICES
//----------------------------------------------------------------------

//generic  web service to get user details

app.get('/rest/user', function(req, res){
	User.find(function (err,data){
	res.json(data);
	});
});

// generic web service to get configuration details

app.get('/process',function(err,res){
	res.json(process.env);
});

//----------------------------------------------------------------------
// work-around so that server works locally and on opernshift
//----------------------------------------------------------------------

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;	

app.listen(port, ip);

//*************************   End of file *****************************  

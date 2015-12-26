var app = angular.module('PassportApp', ['ngRoute','ui.bootstrap']);

app.config(function($routeProvider, $httpProvider){
    $routeProvider
        .when('/', {
            templateUrl: '/pages/home/home.html',
            controller: 'LoginCtrl'
        })

        
        .when('/view/:category', {
            templateUrl: 'pages/view/view.html',
            controller: 'ViewCtrl'
           
        })

        .when('/viewDetail/:id', {
            templateUrl: 'pages/view/viewDetail.html',
             controller: 'ViewDetailCtrl'

        })

         .when('/register', {
             templateUrl: 'pages/register/register.html',
             controller: 'RegisterCtrl'

         })

         .when('/publicprof/:username', {
             templateUrl: 'pages/profile/publicProfile.html',
             controller:'PublicProfileCtrl' 
             
         })
         .when('/profile', {
             templateUrl: 'pages/profile/profile.html',
             controller:'ProfileCtrl',
             resolve: {
                 loggedin: checkLoggedin
             }
             
         })

         .when('/settings', {
             templateUrl: 'pages/settings/settings.html',
             controller:'SettingsCtrl',
             resolve: {
                 loggedin: checkLoggedin
             }
             
         })

        .when('/contact', {
            templateUrl: 'pages/contact/contact.html',
            controller:	'ContactCtrl'
        })

        .otherwise({
            redirectTo: '/'
        });     
    
    $httpProvider
    .interceptors
    .push(function($q, $location)
    {
        return {
            response: function(response)
            { 
                return response;
            },
            responseError: function(response)
            {
                if (response.status == 401)
                    $location.url('/');
                return $q.reject(response);
            }
        };
    }); 
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
{
    var deferred = $q.defer();

    $http.get('/rest/loggedin').success(function(user)
    {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0'){
        	$rootScope.currentUser = user;
            deferred.resolve();
        }
        
        // User is Not Authenticated
        else
        {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/');
           
        }
    });
    
    return deferred.promise;
};

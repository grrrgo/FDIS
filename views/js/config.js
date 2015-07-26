angular.module('quizApp').config(function ($routeProvider, $httpProvider, $locationProvider) {
    var checkLoggedIn = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/loggedin').success(function (user) {
            $rootScope.errorMessage = null;
            if (user !== '0'){
                $rootScope.currentUser = user;
                $rootScope.isLoggedIn = (user != 0);
                deferred.resolve();
            } else {
                $rootScope.errorMessage = "You are not login yet.";
                deferred.reject();
                $location.url('/login');
                $rootScope.isLoggedIn = (user != 0);
            }
        })
    };
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            templateUrl: '../partials/login.html',
            controller: 'loginCtrl'
        }).
        when('/dashboard', {
            templateUrl: '../partials/dashboard.html',
            controller:'reportCtrl',
            resolve: {
                loggedin: checkLoggedIn
            }
        }).
        when('/register', {
            templateUrl: '../partials/register.html',
            controller: 'registerCtrl'
        }).
        when('/quiz', {
            templateUrl: '../partials/quiz.html',
            controller: 'quizCtrl',
            resolve: {
                loggedin: checkLoggedIn
            }
        }).when('/practise', {
            templateUrl: '../partials/practise.html',
            resolve: {
                loggedin: checkLoggedIn
            }
        }).
        when('/practise/:category', {
            templateUrl: '../partials/quiz.html',
            controller: 'practiseCtrl',
            resolve: {
                loggedin: checkLoggedIn
            }
        }).
        when('/report', {
            templateUrl: '../partials/report.html',
            controller: 'reportCtrl',
            resolve: {
                loggedin: checkLoggedIn
            }
        }).
        when('/404', {
            templateUrl: '../partials/404.html'
        }).
        otherwise({
            redirectTo: '/404'
        });
});


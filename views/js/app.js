/**
 * Created by grrrgo on 5/22/15.
 */
var app = angular.module('quizApp', ['ngRoute', 'highcharts-ng']);
app.factory('checkSession', function ($rootScope, $http) {
    fac = {};
    fac.check = function () {
        $http.get('/loggedin').success(function (user) {
            $rootScope.isLoggedIn = (user != 0);
        });
    };
    return fac;
});
app.config(function ($routeProvider, $httpProvider, $locationProvider) {
    var checkLoggedIn = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/loggedin').success(function (user) {
            $rootScope.errorMessage = null;
            if (user !== '0'){
                $rootScope.currentUser = user;
                $rootScope.isLoggedIn = (user != 0);
                deferred.resolve();
            } else {
                $rootScope.errorMessage = "You are not login yet."
                deferred.reject();
                $location.url('/login');
                $rootScope.isLoggedIn = (user != 0);
            }
        })
    };
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html'
        }).
        when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
        }).
        when('/profile', {
            templateUrl: 'partials/profile.html',
            resolve: {
                loggedin: checkLoggedIn
            }
        }).
        when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'registerCtrl'
        }).
        when('/quiz', {
            templateUrl: 'partials/quiz.html',
            controller: 'quizCtrl',
            resolve: {
                loggedin: checkLoggedIn
            }
        }).
        when('/report', {
            templateUrl: 'partials/report.html',
            controller: 'reportCtrl',
            resolve: {
                loggedin: checkLoggedIn
            }
        }).
        when('/404', {
            templateUrl: 'partials/404.html'
        }).
        otherwise({
            redirectTo: '/404'
        });
});

app.controller('quizCtrl', function ($scope, $http, $interval, $location, $rootScope) {
    var now = new Date().valueOf();
    var timeLimit = now + 4*60*60*1000;
    var counting = $interval(function () {
        var current = new Date().valueOf();
        var diff = timeLimit - current;
        var Hours = Math.floor(diff%(1000*60*60*24)/(1000*60*60));
        var Minutes = Math.floor(diff%(1000*60*60*24)%(1000*60*60)/(1000*60));
        var Seconds = Math.floor(diff%(1000*60*60*24)%(1000*60*60)%(1000*60)/1000);
        $scope.Hours = Hours<10?'0'+Hours:Hours;
        $scope.Minutes =Minutes<10?'0'+Minutes:Minutes;
        $scope.Seconds =Seconds<10?'0'+Seconds:Seconds
        console.log(diff);
    },1000);
    var questions = [1,2,3,4,5,6,7,8,9,10];
    $http.post('/quiz', questions).success(function (response) {
        $scope.questions = response;
    });

    $scope.submit = function () {
        $interval.cancel(counting);
        $location.url('/report');
    };
    $scope.cancel = function () {
        $interval.cancel(counting);
        $location.url('/');
    };

    //$scope.questions = [{
    //    content: "question1",
    //    choices: {
    //        A: "choice_A",
    //        B: "choice_B",
    //        C: "choice_C",
    //        D: "choice_D"
    //    },
    //    correctChoice: "B",
    //    category: "1"
    //},{
    //    content: "question2",
    //    choices: {
    //        A: "choice_A",
    //        B: "choice_B",
    //        C: "choice_C",
    //        D: "choice_D"
    //    },
    //    correctChoice: "B",
    //    category: "1"
    //},{
    //    content: "question3",
    //    choices: {
    //        A: "choice_A",
    //        B: "choice_B",
    //        C: "choice_C",
    //        D: "choice_D"
    //    },
    //    correctChoice: "B",
    //    category: "1"
    //},{
    //    content: "question4",
    //    choices: {
    //        A: "choice_A",
    //        B: "choice_B",
    //        C: "choice_C",
    //        D: "choice_D"
    //    },
    //    correctChoice: "B",
    //    category: "1"
    //},{
    //    content: "question5",
    //    choices: {
    //        A: "choice_A",
    //        B: "choice_B",
    //        C: "choice_C",
    //        D: "choice_D"
    //    },
    //    correctChoice: "B",
    //    category: "1"
    //}]
});

app.controller('loginCtrl', function ($scope, $rootScope, $http, $location) {
    $scope.login = function (user){
        $http.post('/login', user).success(function (response){
            $rootScope.currentUser = response;
            $location.url('/profile');
        }).error(function (err) {
            console.log(err);
            alert(err);
        })
    }
});

app.controller('navCtrl', function ($scope, $http, $location, $rootScope, checkSession){
    $scope.logout = function () {
        $http.post('/logout',$rootScope.user).success(function () {
            $location.url('/');
            checkSession.check();
            $rootScope.currentUser = undefined;
        })
    }
});

app.controller('registerCtrl', function ($scope, $rootScope, $http, $location) {
    //initialization of scope variables.
    $scope.user = {};
    $scope.passwordErr = false;
    $scope.usernameErr = false;
    $scope.passwordShort = false;
    //listen to keypress on first and last name input boxes.
    $('#fName, #lName').keypress(function(key) {
        //prevent user from input non-letter chars.
        if((key.charCode < 97 || key.charCode > 122) && (key.charCode < 65 || key.charCode > 90)
            && ($.inArray(key.charCode, [0, 8, 16, 20, 45, 46]))) {
            //show a tooltip to let user know why the keystroke is not working.
            $('[data-toggle="tooltip"]').tooltip('show');
            return false;
        } else {
            $('[data-toggle="tooltip"]').tooltip('hide');
        }
    });

    // listen on the enter key press event and submit form.
    $("body").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $scope.submit();
        }
    });

    //regex to test the email pattern, gets invoked after the blur event of email input.
    $scope.testUsername = function () {
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        $scope.usernameErr = !re.test($scope.user.username);
    };

    //test on the length of first password.
    $scope.testPassword = function () {
        $scope.passwordShort = $scope.user.password.length <= 5
    };

    //test if both passwords match.
    $scope.testPassword2 = function () {
        $scope.passwordErr = ($scope.user.password != $scope.user.password2);
    };

    //push user information to rootScope enable cross scope sharing if everything is valid.
    $scope.submit = function () {
        if (
            $scope.user.username && $scope.user.firstName && $scope.user.birthday &&
            !$scope.usernameErr && !$scope.passwordErr && !$scope.passwordShort
        ) {
            alert("Success!");
            $rootScope.user = $scope.user;
            $location.url('/success')
        } else {
            alert("There's something wrong.")
        }
    };
    $scope.clear = function () {
        if(confirm("Are you sure to clear the form?")) $scope.user = {}
    };

    $scope.register = function (user){
        if (
            $scope.user.username && $scope.user.firstName && $scope.user.birthday &&
            !$scope.usernameErr && !$scope.passwordErr && !$scope.passwordShort
        ) {
            $http.post('/register', user).success(function (response){
                if (response != "0"){
                    alert("Success!");
                    $rootScope.currentUser = response;
                    $location.url('/profile');
                } else {
                    alert("Sorry, we already have someone named "+ user.username +"!")
                }
            })
        } else {
            alert("There's something wrong.")
        }

    }
});

app.controller('reportCtrl', function ($scope) {
    $scope.chartConfig = {
        options: {
            chart: {
                type: 'column'
            }
        },

        title: {
            text: 'Total fruit consumtion, grouped by gender'
        },

        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },

        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Number of fruits'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2],
            stack: 'male'
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5],
            stack: 'male'
        }, {
            name: 'Jane',
            data: [2, 5, 6, 2, 1],
            stack: 'female'
        }, {
            name: 'Janet',
            data: [3, 0, 4, 4, 3],
            stack: 'female'
        }]
    }

})
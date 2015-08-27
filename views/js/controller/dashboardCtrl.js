angular.module('quizApp').controller('dashboardCtrl', function($http, $scope, $rootScope, $q, $location) {
	$rootScope.displayDBoard = false;

    $scope.user = {};
    $scope.passwordErr = false;
    $scope.usernameErr = false;
    $scope.passwordShort = false;

    var quizPostData = {
        username: $rootScope.currentUser.username,
        mode:'quiz',
        number: 3
    };

    var practisePostData = {
        username: $rootScope.currentUser.username,
        mode:'practise',
        number: 3
    };

    $scope.pwSave = function (user) {
        var postData = {
            username: $rootScope.currentUser.username,
            oldPassword: user.oldPassword,
            newPassword: user.password2
        };
        $http.post('/changePasswd', postData).success(function (response) {
            if (response == 'success'){
                alert ('Success!');
                $scope.user={};
            } else if (response == 'incorrect') {
                alert ('Current Password not correct!')
                $scope.user={};
                $location.url('/dashboard#resetPW')

            } else if (response == 'error'){
                alert ('Error!')
                $scope.user={};
            }
        })
    };

    //test on the length of first password.
    $scope.testPassword = function () {
        $scope.passwordShort = $scope.user.password.length <= 5
    };

    //test if both passwords match.
    $scope.testPassword2 = function () {
        $scope.passwordErr = ($scope.user.password != $scope.user.password2);
    };

    function getData (postData,number){
        var deferred = $q.defer();
        if (number){
            postData.number = number
        }
        $http.post('/getRecord', postData).success(function(response){
            deferred.resolve(response)
        });
        return deferred.promise
    }

    $scope.init = function (num){

        quizPostData.number = num? num: 3;
        practisePostData.number = num? num: 3;
        $scope.quizChartConfig = {
            "options": {
                "chart": {
                    "type": "areaspline"
                },
                "plotOptions": {
                    "series": {
                        "stacking": ""
                    }
                }
            },
            xAxis: {
                categories: []
            },
            yAxis:{
                title:{text:"Score"},
                max: 100,
                min: 0
            },
            "series": [
                {
                    "name": "Overall Score",
                    "data": [],
                    "connectNulls": true,
                    "id": "series-1"
                },
                {
                    "name": "General Knowledge",
                    "data": [],
                    "type": "column",
                    "id": "series-2"
                },
                {
                    "name": "Software Quality Management",
                    "data": [],
                    "type": "column",
                    "id": "series-3"
                },
                {
                    "data": [],
                    "id": "series-4",
                    "name": "Engineering Process",
                    "type": "column",
                    "dashStyle": "Solid"
                },
                {
                    "data": [],
                    "id": "series-5",
                    "name": "Project Management",
                    "dashStyle": "Solid",
                    "type": "column"
                },
                {
                    "data": [],
                    "id": "series-6",
                    "type": "column",
                    "name": "Metrics & Analysis"
                },
                {
                    "data": [],
                    "id": "series-7",
                    "type": "column",
                    "name": "Software Verification & Validation"
                },
                {
                    "data": [],
                    "id": "series-8",
                    "type": "column",
                    "name": "Software Configuration Management"
                }
            ],
            "title": {
                "text": "Exam Mode Progression"
            },
            "credits": {
                "enabled": false
            },
            "loading": false,
            "size": {}
        };

        $scope.practiseChartConfig = {
            "options": {
                "chart": {
                    "type": "line"
                },
                "plotOptions": {
                    "series": {
                        "stacking": ""
                    }
                }
            },
            xAxis: {
                categories: []
            },
            yAxis:{
                title:{text:"Score"},
                max: 100,
                min: 0
            },
            "series": [
                {
                    "name": "Score",
                    "data": [],
                    "type": "spline",
                    "id": "series-3",
                    "dashStyle": "LongDash",
                    "connectNulls": false
                }
            ],
            "title": {
                "text": "Practise Mode Progression"
            },
            "credits": {
                "enabled": false
            },
            "loading": false,
            "size": {}
        };


        getData(practisePostData).then(function(data){
            data.forEach(function (value) {
                $scope.practiseChartConfig.xAxis.categories.unshift(value.time);
                $scope.practiseChartConfig.series[0].data.unshift(value.score)
            })

        });

        getData(quizPostData).then(function(data){
            data.forEach(function (value) {
                $scope.quizChartConfig.xAxis.categories.unshift(value.time);
                $scope.quizChartConfig.series[0].data.unshift(value.score);
                $scope.quizChartConfig.series[1].data.unshift(value.gkScore);
                $scope.quizChartConfig.series[2].data.unshift(value.sqmScore);
                $scope.quizChartConfig.series[3].data.unshift(value.epScore);
                $scope.quizChartConfig.series[4].data.unshift(value.pmScore);
                $scope.quizChartConfig.series[5].data.unshift(value.maScore);
                $scope.quizChartConfig.series[6].data.unshift(value.svvScore);
                $scope.quizChartConfig.series[7].data.unshift(value.scmScore);

            })
        });
    };

    $scope.init();
});
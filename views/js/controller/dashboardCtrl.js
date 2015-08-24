angular.module('quizApp').controller('dashboardCtrl', function($http, $scope, $rootScope, $q) {

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

    function init (){

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
            "series": [
                {
                    "name": "TotalPoints",
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
                    "id": "series-6",
                    "type": "column",
                    "name": "Software Verification & Validation"
                },
                {
                    "data": [],
                    "id": "series-6",
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
        }

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
    }

    init();
});
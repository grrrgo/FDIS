app = angular.module('quizApp').controller('quizCtrl', function ($scope, $http, $interval, $location, $anchorScroll, getRandom, $rootScope) {
	$rootScope.displayDBoard = false;
    var now = new Date().valueOf();
    $rootScope.report = {type:'quiz', wrong: []};
    $rootScope.wrong = 0;
    var timeLimit = now + 2*60*60*1000;
    var counting = $interval(function () {
        var current = new Date().valueOf();
        var diff = timeLimit - current;
        var Hours = Math.floor(diff%(1000*60*60*24)/(1000*60*60));
        var Minutes = Math.floor(diff%(1000*60*60*24)%(1000*60*60)/(1000*60));
        var Seconds = Math.floor(diff%(1000*60*60*24)%(1000*60*60)%(1000*60)/1000);
        $scope.Hours = Hours<10?'0'+Hours:Hours;
        $scope.Minutes =Minutes<10?'0'+Minutes:Minutes;
        $scope.Seconds =Seconds<10?'0'+Seconds:Seconds;
        if ($scope.Hours == 0 && $scope.Minutes == 0 && $scope.Seconds ==0){
            alert("Time's up, submitting quiz...")
            //TODO submit quiz code here.
        }
    },1000);


    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $interval.cancel(counting);
    });

    $scope.Mode = "Quiz";

    $http.get('/quiz').success(function (response) {
        $scope.questions = response;
        console.log(response)
    });

    $scope.labels = [];

    $scope.addLabels = function (id) {
        $scope.labels.push(id);
        $scope.labels.sort()
    };

    $scope.gotoAnchor = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        $location.hash(old)
    };

    $scope.submit = function () {
        $interval.cancel(counting);
        var epwrong = 0, gkwrong = 0, mawrong = 0, pmwrong = 0, scmwrong = 0, sqmwrong = 0, svvwrong = 0;
        var postData = {
            "username":$rootScope.currentUser.username,
            "mode": "quiz",
            "time": new Date(),
            "score": 0,
            "category": null,
            epScore: 0,
            gkScore: 0,
            maScore: 0,
            pmScore: 0,
            scmScore: 0,
            sqmScore: 0,
            svvScore: 0
        };
        $scope.questions.forEach(function (value, index, array) {
            if (value.answer != value.correctChoice){
                $rootScope.wrong ++;
                $rootScope.report.wrong.push(value);
                switch (value.category){
                    case 'ep':
                        epwrong ++;
                        break;
                    case 'gk':
                        gkwrong ++;
                        break;
                    case 'mam':
                        mawrong ++;
                        break;
                    case 'pm':
                        pmwrong ++;
                        break;
                    case 'scm':
                        scmwrong ++;
                        break;
                    case 'sqm':
                        sqmwrong ++;
                        break;
                    case 'SVV':
                        svvwrong ++;
                        break;
                }

            }

            if (index == array.length - 1){
                postData.score = (1-($rootScope.wrong/35))*100;
                $rootScope.report.score = postData.score;
                $rootScope.report.epScore = (1-(epwrong/5))*100;
                $rootScope.report.gkScore = (1-(gkwrong/5))*100;
                $rootScope.report.maScore = (1-(mawrong/5))*100;
                $rootScope.report.pmScore = (1-(pmwrong/5))*100;
                $rootScope.report.scmScore = (1-(scmwrong/5))*100;
                $rootScope.report.sqmScore = (1-(sqmwrong/5))*100;
                $rootScope.report.svvScore = (1-(svvwrong/5))*100;
                postData.epScore = $rootScope.report.epScore;
                postData.gkScore = $rootScope.report.gkScore;
                postData.maScore = $rootScope.report.maScore;
                postData.pmScore = $rootScope.report.pmScore;
                postData.scmScore = $rootScope.report.scmScore;
                postData.sqmScore = $rootScope.report.sqmScore;
                postData.svvScore = $rootScope.report.svvScore;
                $http.post('/saveRecord', postData).success(function () {
                    $location.url('/report');
                });
            }
        });
    };
    $scope.cancel = function () {
        $interval.cancel(counting);
        $location.url('/dashboard');
    };

});

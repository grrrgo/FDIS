app = angular.module('quizApp').controller('quizCtrl', function ($scope, $http, $interval, $location, $anchorScroll, getRandom) {
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


    function randomNfromM (N, M){
        var i = 0, j, arr = [];
        while(i<N){
            j = Math.floor(Math.random()*(M + 1));
            if (arr.indexOf(j)<0){
                arr.push(j);
                i++
            }
        }
        return arr;
    }

    $scope.Mode = "Quiz";

    $http.get('/getquestions').success(function(response){
        $scope.totalQuestions = response;
        var questions = randomNfromM(5, $scope.totalQuestions.length),list = [];
        angular.forEach(questions,function(id){
            list.push($scope.totalQuestions[id])
        });
        console.log(list);
        $http.post('/quiz', list).success(function (response) {
            $scope.questions = response;
            console.log($scope.questions)
        });
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
        $location.url('/report');
    };
    $scope.cancel = function () {
        $interval.cancel(counting);
        $location.url('/');
    };

});

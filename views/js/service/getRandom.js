angular.module('quizApp').factory('getRandom', function ($http, $q) {
    var fac = {};
    //TODO get this to work
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

    fac.get = function (route, questionNumber) {
        $http.get(route).success(function (response) {
            var questions = randomNfromM(questionNumber, response.length),list = [];
            angular.forEach(questions,function(id){
                list.push(response[id])
            });
            return list
        });
    };

    return fac

});
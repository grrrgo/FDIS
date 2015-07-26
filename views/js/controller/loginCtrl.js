angular.module('quizApp').controller('loginCtrl', function ($scope, $rootScope, $http, $location) {
    $scope.login = function (user){
        $http.post('/login', user).success(function (response){
            $rootScope.currentUser = response;
            $location.url('/dashboard');
        }).error(function (err) {
            console.log(err);
            alert(err);
        })
    }
});
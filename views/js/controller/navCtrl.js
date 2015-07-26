angular.module('quizApp').controller('navCtrl', function ($scope, $http, $location, $rootScope, checkSession){
    $scope.logout = function () {
        $http.post('/logout',$rootScope.user).success(function () {
            $location.url('/');
            checkSession.check();
            $rootScope.currentUser = undefined;
        })
    }
});
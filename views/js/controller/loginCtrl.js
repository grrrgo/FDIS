angular.module('quizApp').controller('loginCtrl', function ($scope, $rootScope, $http, $location) {
    $scope.user={
        username:'',
        password:''
    };
    $scope.noemail = false;
    $scope.nopassword = false;
    $scope.testEmail = function () {
        ($scope.user.username =='')? $scope.noemail=true:$scope.noemail=false;
    };
    $scope.testPassword = function () {
        ($scope.user.password =='')? $scope.nopassword=true:$scope.nopassword=false;
    };
	$scope.login = function (user){
        $http.post('/login', user).success(function (response){
            $rootScope.currentUser = response;
            $location.url('/dashboard')
        }).error(function () {
            alert('Username or password error!')
        })
    }
});
angular.module('quizApp').controller('registerCtrl', function ($scope, $rootScope, $http, $location) {
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
            $scope.user.username && $scope.user.firstName && 
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
            $scope.user.username && $scope.user.firstName && 
            !$scope.usernameErr && !$scope.passwordErr && !$scope.passwordShort
        ) {
            $http.post('/register', user).success(function (response){
                if (response != "0"){
                    alert("Success!");
                    $rootScope.currentUser = response;
                    $location.url('/dashboard');
                } else {
                    alert("Sorry, account for "+ user.username +" exists! Please retry.")
                }
            })
        } else {
            alert("There's something wrong.")
        }

    }
});

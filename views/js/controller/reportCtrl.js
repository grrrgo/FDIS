angular.module('quizApp').controller('reportCtrl', function ($scope,$rootScope,$http) {
	$rootScope.displayDBoard = true;
    $scope.BOK  = function (value) {
        var returnVal = '';
        switch (value) {
            case 'gk':
                returnVal = "General";
                break;
            case 'sqm':
                returnVal = 'AngularJS';
                break;
            case 'ep':
                returnVal = 'HTML';
                break;
            case 'pm':
                returnVal = 'CSS';
                break;
            case 'mam':
                returnVal = 'JavaScript';
                break;
            case 'SVV':
                returnVal = 'BootStrap';
                break;
            case 'scm':
                returnVal = 'jQuery';
                break;
        }
        return returnVal + ' category';
    }
});

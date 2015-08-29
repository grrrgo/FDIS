angular.module('quizApp').controller('reportCtrl', function ($scope,$rootScope,$http) {
	$rootScope.displayDBoard = true;
    $scope.BOK  = function (value) {
        var returnVal = '';
        switch (value) {
            case 'gk':
                returnVal = "General Knowledge";
                break;
            case 'sqm':
                returnVal = 'Software Quality Management';
                break;
            case 'ep':
                returnVal = 'Engineering Processes';
                break;
            case 'pm':
                returnVal = 'Project Management';
                break;
            case 'mam':
                returnVal = 'Metrics & Analysis';
                break;
            case 'SVV':
                returnVal = 'Software Verification & Validation';
                break;
            case 'scm':
                returnVal = 'Software Configuration Management';
                break;
        }
        return returnVal + ' category';
    }
});

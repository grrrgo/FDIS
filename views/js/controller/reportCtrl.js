angular.module('quizApp').controller('reportCtrl', function ($scope,$rootScope,$http) {
    var route = '/getPractise';
    $scope.number = 3;
    switch ($rootScope.reportType){
        case 'practise':
            route = '/getPractise';
            break;
        case 'quiz':
            route = '/getQuiz';
            break;
        default:
            route = '/getPractise';
            break;
    }

    var postBody = {
        user: $rootScope.currentUser.username,
        number: $scope.number,
        category: $rootScope.currentCategory
    };

    $http.post(route,postBody).success(function (response) {
        if(response){

        }
    });


    $scope.chartConfig = {
        options: {
            chart: {
                type: 'column'
            }
        },

        title: {
            text: 'Total fruit consumtion, grouped by gender'
        },

        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },

        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Number of fruits'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2],
            stack: 'male'
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5],
            stack: 'male'
        }, {
            name: 'Jane',
            data: [2, 5, 6, 2, 1],
            stack: 'female'
        }, {
            name: 'Janet',
            data: [3, 0, 4, 4, 3],
            stack: 'female'
        }]
    }

});
angular.module('quizApp').controller('practiseCtrl', function($scope, $http, $interval, $location, $anchorScroll, $routeParams) {
	$scope.Mode = "Practise Mode";
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
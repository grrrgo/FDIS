angular.module('quizApp').controller('practiseCtrl', function($scope, $http, $interval, $location, $anchorScroll, $routeParams) {
	$scope.Mode = "Practise Mode";
	switch ($routeParams.category) {
		case "GKModel":
			$scope.Category = "General Knowledge";
			break;
		case "SQMModel":
			$scope.Category = "Software Quality Management";
			break;
		case "EPModel":
			$scope.Category = "Engineering Processes";
			break;
		case "PMModel":
			$scope.Category = "Project Management";
			break;
		case "MAModel":
			$scope.Category = "Metrics & Analysis";
			break;
		case "SVVModel":
			$scope.Category = "Software Verification & Validation";
			break;
		case "SCMModel":
			$scope.Category = "Software Configuration Management";
			break;
	}

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

	$http.get('/get' + $routeParams.category).success(function(response){
		$scope.totalQuestions = response;
		console.log(response);
		var questions = randomNfromM(5, $scope.totalQuestions.length),list = [];
		angular.forEach(questions,function(id){
			list.push($scope.totalQuestions[id])
		});
		$http.post('/get' + $routeParams.category, list).success(function (response) {
			$scope.questions = response;
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
		$location.url('/report');
	};
	$scope.cancel = function () {
		$location.url('/');
	};
});
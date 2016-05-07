describe('contactCtrl test suit', function () {
    var scope, ctrl, rootScope;
    beforeEach(function () {
        module('quizApp');

        inject(function ($rootScope, $controller) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            ctrl = $controller('contactCtrl', {
                $scope: scope
            });
        });
    });

    it('should have default value', function () {
        expect(rootScope.displayDBoard).toEqual(true
        );

    });


});
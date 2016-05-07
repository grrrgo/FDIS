describe('navCtrl test suit', function () {
    var scope, ctrl, rootScope, http;
    beforeEach(function () {
        module('quizApp');

        inject(function ($rootScope, $controller, $http) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            http = $http;
            rootScope.user = {
                username:'test'
            }
            ctrl = $controller('navCtrl', {
                $scope: scope
            });
        });
    });

    it('should log user out upon function call', function () {
        spyOn(http, 'post').and.callFake(function () {
            return {
                success: function (cb) {
                    cb('success')
                }
            }
        });
        scope.logout();
        expect(http.post).toHaveBeenCalledWith('/logout', {
            username:'test'
        });

        expect(rootScope.currentUser).toEqual(undefined);
        

    });
});
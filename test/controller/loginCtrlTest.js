describe('loginCtrl test suit', function () {
    var scope, ctrl, rootScope, http;
    beforeEach(function () {
        module('quizApp');

        inject(function ($rootScope, $controller, $http) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            http = $http;
            rootScope.currentUser = {
                username:'test'
            }
            ctrl = $controller('loginCtrl', {
                $scope: scope
            });
        });
    });

    it('should have default value', function () {
        expect(scope.user).toEqual({
            username:'',
            password:''
        });
        expect(scope.noemail).toEqual(false);
        expect(scope.nopassword).toEqual(false);
    });

    it('should call the login endpoint', function () {
        spyOn(http, 'post').and.callFake(function () {
            return {
                success: function (cb) {
                    cb('fakeResponse');
                    return {
                        error: function(){}
                    }
                }
            }
        });
        scope.login('fakeUser');
        expect(http.post).toHaveBeenCalledWith('/login','fakeUser');
        expect(rootScope.currentUser).toEqual('fakeResponse');

    });

    it('should test the email', function () {
        scope.user = {username:''};
        scope.testEmail();
        expect(scope.noemail).toEqual(true);

    });


    it('should test the password', function () {
        scope.user = {password:'', password2:'124'};
        scope.testPassword();
        expect(scope.nopassword).toEqual(true);

    });


});
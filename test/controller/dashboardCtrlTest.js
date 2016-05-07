describe('dashboardCtrl test suit', function () {
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
            ctrl = $controller('dashboardCtrl', {
                $scope: scope
            });
        });
    });

    it('should have default value', function () {
        expect(scope.user).toEqual({});
        expect(scope.passwordErr).toEqual(false);
        expect(scope.usernameErr).toEqual(false);
        expect(scope.passwordShort).toEqual(false);
    });

    it('should save password when user changes it', function () {
        spyOn(http, 'post').and.callFake(function () {
            return {
                success: function (cb) {
                    cb('success')
                }
            }
        });
        scope.pwSave({
            oldPassword:'123',
            password2:'456'
        });
        expect(http.post).toHaveBeenCalledWith('/changePasswd',{
            username:'test',
            oldPassword:'123',
            newPassword:'456'
        });
        expect(scope.user).toEqual({});

    });

    it('should test the length of the first password', function () {
        scope.user = {password:{length:4}};
        scope.testPassword();
        expect(scope.passwordShort).toEqual(true);
        
    });


    it('should test the length of the second password', function () {
        scope.user = {password:'123', password2:'124'};
        scope.testPassword2();
        expect(scope.passwordErr).toEqual(true);

    });


});
(function (angular) {
    angular
        .module('pbox.auth')
        .service('authService', authService);

    /**@ngInject */
    function authService($q, $rootScope, $state, pboxApi, config, $localStorage, UserModel) {
        var service = this;

        service.init = init;
        service.register = register;
        service.login = login;
        service.logout = logout;
        service.currentUser = currentUser;

        //////////////////////////////////

        function init() {
            if (!!$localStorage.current_user) {
                setCurrentUser($localStorage.current_user);
            } else {
                $state.go('login');
            }
        }

        function register(user) {
            return pboxApi.http({
                method: config.httpMethods.POST,
                url: config.pboxAPI.USERS,
                data: user
            })
            .then(function (data) {
                return setCurrentUser(data);
            });
        }

        function login(username, password) {
            return pboxApi.http({
                method: config.httpMethods.POST,
                url: config.pboxAPI.TOKEN,
                data: {
                    username: username,
                    password: password,
                    type: 4
                }
            })
            .then(function (data) {
                return setCurrentUser(data);
            });
        }

        function currentUser() {
            return $q.when(function () {
                if (!!$localStorage.current_user) {
                    return $localStorage.current_user;
                }
                return null;
            }());
        }

        function setCurrentUser(userData) {
            var userModel = new UserModel(userData);
            $localStorage.current_user = userModel;
            $rootScope.current_user = userModel;
            return userModel;
        }

        function logout() {
            return $q.when(function () {
                delete $localStorage.current_user;
                delete $localStorage.credentials;
                delete $rootScope.current_user;
                return true;
            }());
        }
    }
})(window.angular);

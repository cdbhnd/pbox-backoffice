(function() {
    'use strict';

    angular
        .module('pbox.auth')
        .controller('authController', authController);

    /** @ngInject */
    function authController($state, $q, authService, UserModel) {

        var vm = this;

        vm.user = new UserModel();

        vm.loginUser = loginUser;

        /////////////////////////////////////

        (function activate() {
            checkIfUserAlreadyLogedIn();
        }());

        /////////////////////////////////////

        function loginUser() {
            if (vm.user.username && vm.user.password) {
                login()
                    .then(function(response) {
                        $state.go('boxes-overview');
                    })
                    .catch(function(e) {
                        if (e.status === 401) {
                            console.log('Wrong username or password!');
                        }
                        if (e.status === 500) {
                            console.log('Something went wrong, please try leater!');
                        }
                    })
                    .finally(function() {});
            } else {
                if (!vm.user.username || !vm.user.password) {
                    console.log('Username or password is missing!');
                }
            }
        }

        ////////////////////////////////////////////////////

        function checkIfUserAlreadyLogedIn() {
            return $q.when(function() {
                return authService.currentUser()
                    .then(function(user) {
                        if (!!user) {
                            $state.go('boxes-overview');
                            return false;
                        }
                        return true;
                    });
            }());
        }

        function login() {
            return authService.login(vm.user.username, vm.user.password)
        }
    }
})();
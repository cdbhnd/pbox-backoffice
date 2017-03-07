(function() {
    'use strict';

    angular
        .module('pbox.auth')
        .controller('authController', authController);

    /** @ngInject */
    function authController($state, $q, authService, UserModel, ngNotify) {

        var vm = this;

        vm.user = new UserModel();

        vm.loginUser = loginUser;
        vm.submitForm = submitForm;
        /////////////////////////////////////

        (function activate() {
            checkIfUserAlreadyLogedIn();
        }());

        /////////////////////////////////////
        function submitForm(isValid) {
            if(!!isValid) {
                loginUser();
            };
        }

        function loginUser() {
            if (vm.user.username && vm.user.password) {
                login()
                    .then(function(response) {
                        $state.go('boxes-overview');
                    })
                    .catch(function(e) {
                        if (e.status === 401) {
                            ngNotify.set('Wrong username or password!', 'error');
                        }
                        if (e.status === 500) {
                            ngNotify.set('Something went wrong, please try leater!', 'info');
                        }
                    })
                    .finally(function() {});
            } else {
                if (!vm.user.username || !vm.user.password) {
                    ngNotify.set('Username or password is missing!', 'error');
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
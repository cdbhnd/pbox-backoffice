(function (angular) {
    angular
        .module('pbox.auth')
        .controller('authController', authController);

    /**@ngInject */
    function authController($state, $q, authService, UserModel, ngNotify) {
        var vm = this;

        //public methods
        vm.loginUser = loginUser;
        vm.submitForm = submitForm;
        vm.logout = logoutUser;

        //variables and properties
        vm.user = new UserModel();

        /////////////////////////////////////

        /**Activate */
        (function () {
            checkIfUserAlreadyLogedIn();
        }());

        /////////////////////////////////////

        function checkIfUserAlreadyLogedIn() {
            return $q.when(function () {
                return authService.currentUser()
                    .then(function (user) {
                        if (!!user) {
                            $state.go('boxes-overview');
                            return false;
                        }
                        return true;
                    });
            }());
        }

        function loginUser() {
            if (vm.user.username && vm.user.password) {
                login()
                    .then(function () {
                        $state.go('boxes-overview');
                    })
                    .catch(function (e) {
                        if (e.status === 401) {
                            ngNotify.set('Wrong username or password!', 'error');
                        }
                        if (e.status === 500) {
                            ngNotify.set('Something went wrong, please try leater!', 'info');
                        }
                    });
            } else {
                if (!vm.user.username || !vm.user.password) {
                    ngNotify.set('Username or password is missing!', 'error');
                }
            }
        }

        function submitForm(isValid) {
            if (!!isValid) {
                loginUser();
            }
        }

        function logoutUser() {
            return authService.logout()
                .then(redirectToLogin);
        }

        function redirectToLogin() {
            return $q.when(function () {
                $state.go('login');
            }());
        }

        function login() {
            return authService.login(vm.user.username, vm.user.password);
        }
    }
})(window.angular);

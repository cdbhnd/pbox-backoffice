(function (angular) {
    angular
        .module('pbox.header')
        .controller('headerController', headerController);

    /**@ngInject */
    function headerController($state) {
        var vm = this;

        //public methods
        vm.toggleDropdown = toggleDropdown;
        vm.changeState = changeState;

        //variables and properties
        vm.showDropdown = false;

        function toggleDropdown() {
            vm.showDropdown = !vm.showDropdown;
        }

        function changeState(state, dontToggleDropdown) {
            $state.go(state);
            if (!!dontToggleDropdown) {
                return false;
            }
            toggleDropdown();
            return true;
        }
    }
})(window.angular);

(function() {
    'use strict';

    angular
        .module('pbox.header')
        .controller('headerController', headerController);

    /** @ngInject */
    function headerController() {

        var vm = this;

        // public methods
        vm.toggleDropdown = toggleDropdown;

        //variables and properties
        vm.showDropdown = false;

        /////////////////////////////////////

        (function activate() {}());

        /////////////////////////////////////

        function toggleDropdown() {
            vm.showDropdown = !vm.showDropdown;
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('pbox.popup')
        .controller('confirmModalInstanceController', confirmModalInstanceController);

    /** @ngInject */
    function confirmModalInstanceController($uibModalInstance) {
        var ctrl = this;

        ctrl.yes = yes;
        ctrl.no = no;

        function yes() {
            $uibModalInstance.close(true);
        }

        function no() {
            $uibModalInstance.close(false);
        }
        
    }
})();
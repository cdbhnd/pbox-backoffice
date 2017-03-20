(function (angular) {
    angular
        .module('pbox.popup')
        .controller('confirmModalInstanceController', confirmModalInstanceController);

    /**@ngInject */
    function confirmModalInstanceController($uibModalInstance, options) {
        //properties
        var ctrl = this;
        ctrl.message = options.message;

        //methods
        ctrl.yes = yes;
        ctrl.no = no;

        function yes() {
            $uibModalInstance.close(true);
        }

        function no() {
            $uibModalInstance.close(false);
        }
    }
})(window.angular);

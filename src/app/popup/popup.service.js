(function () {
    angular
        .module('pbox.popup')
        .service('pboxPopup', pboxPopup);

    /** @ngInject */
    function pboxPopup($uibModal) {

        var service = this;

        service.confirm = confirm;

        function confirm(message) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/popup/confirm.modal.html',
                controller: 'confirmModalInstanceController as ctrl',
                size: 'sm',
                resolve: {
                    options: function() {
                        return {
                            message: message
                        };
                    }
                }
               
            });

            return modalInstance
                .result
                .then(function(result) {
                    return result;
                });
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('pbox.management')
        .controller('managementController', managementController);


    function managementController(DTOptionsBuilder, DTColumnDefBuilder, boxService, pboxPopup) {
        var vm = this;

        // properties 
        vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        vm.boxes = [];

        //methods
        vm.deleteBox = deleteBox;
        vm.reactivateBox = reactivateBox;
        vm.syncBox = syncBox;

        (function activate() {
             loadBoxes();
        }());

        function loadBoxes() {
           return boxService.getAllBoxes()
            .then(function(response) {
                vm.boxes = response;
            });
        }

        function deleteBox(index) {
            var box = vm.boxes[index].code;
            pboxPopup.confirm('Are you sure you want to delete box ?')
                .then(function(confirmed) {
                    if (confirmed) {
                        boxService.deleteBox(box)
                            .then(function(data) {
                                loadBoxes();
                            });
                    } else {
                        false;
                    }
                });
        }

        function reactivateBox(index) {
            console.log('Reactivate box' + vm.boxes[index].deviceId);
        }

        function syncBox(index) {
            console.log('Sync box' + vm.boxes[index].deviceId);
        }
    }
})();

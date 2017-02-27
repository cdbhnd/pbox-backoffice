(function () {
    'use strict';

    angular
        .module('pbox.management')
        .controller('managementController', managementController);


    function managementController(DTOptionsBuilder, DTColumnDefBuilder, realtimeService) {
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
           return realtimeService.getAllBoxes()
            .then(function(response) {
                vm.boxes = response;
            });
        }

        function deleteBox(index) {
            console.log('Delete box' + vm.boxes[index].deviceId);
        }

        function reactivateBox(index) {
            console.log('Reactivate box' + vm.boxes[index].deviceId);
        }

        function syncBox(index) {
            console.log('Sync box' + vm.boxes[index].deviceId);
        }
    }
})();

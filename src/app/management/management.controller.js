(function (angular) {
    angular
        .module('pbox.management')
        .controller('managementController', managementController);


    function managementController(DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions, boxService, pboxPopup) {
        var vm = this;

        //properties
        DTDefaultOptions.setOption('dom', 'lpfrtip');
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDOM('<"top" <"glyphicon glyphicon-search search-icon">f>rt<"bottom"p><"clear">');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        vm.boxes = [];

        //methods
        vm.deleteBox = deleteBox;
        vm.toggleBoxActive = toggleBoxActive;
        vm.syncBox = syncBox;

        //////////////////////////////////////////

        /**Activate */
        (function () {
            loadBoxes();
        }());

        //////////////////////////////////////////

        function loadBoxes() {
            return boxService.getAllBoxes()
            .then(function (response) {
                vm.boxes = response;
            });
        }

        function deleteBox(index) {
            var box = vm.boxes[index].code;
            pboxPopup.confirm('Are you sure you want to delete box ?')
                .then(function (confirmed) {
                    if (confirmed) {
                        boxService.deleteBox(box)
                            .then(function () {
                                loadBoxes();
                            });
                    }
                });
        }

        function toggleBoxActive(index) {
            var box = vm.boxes[index];
            var setBoxStatus = null;

            if(box.status === 'ACTIVE') {
                setBoxStatus = 'IDLE';
            }else {
                setBoxStatus = 'ACTIVE';
            }

            pboxPopup.confirm('Are you sure you want to set box state to ' + setBoxStatus + ' ?')
                .then(function (confirmed) {
                    if (confirmed) {
                        boxService.setBoxStatus(box.code, setBoxStatus)
                            .then(function () {
                                loadBoxes();
                            });
                    }
                });
        }

        function syncBox(index) {
            var box = vm.boxes[index].code;
            pboxPopup.confirm('Are you sure you want to sync box sensors ?')
                .then(function (confirmed) {
                    if (confirmed) {
                        boxService.syncBox(box)
                            .then(function () {
                                loadBoxes();
                            });
                    }
                });
        }
    }
})(window.angular);

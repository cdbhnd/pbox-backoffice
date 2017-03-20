(function (angular) {
    angular
        .module('pbox')
        .factory('BoxFilterModel', boxFilterModelFactory);

    /**@ngInject */
    function boxFilterModelFactory() {
        function BoxFilterModel(obj) {
            this.code = !!obj && !!obj.code ? obj.code : null;
            this.activeStatus = !!obj && !!obj.activeStatus ? obj.activeStatus : false;
            this.sleepStatus = !!obj && !!obj.sleepStatus ? obj.sleepStatus : false;
        }

        BoxFilterModel.prototype.match = function (box) {
            var match = true;
            if (!this.activeStatus && this.sleepStatus && box.status !== 'SLEEP') {
                match = false;
            }
            if (this.activeStatus && !this.sleepStatus && box.status !== 'ACTIVE') {
                match = false;
            }
            if (!!this.code && this.code !== '') {
                var boxCodeLowerCase = box.code.toLowerCase();
                match = boxCodeLowerCase.includes(this.code.toLowerCase());
            }
            return match;
        };

        return BoxFilterModel;
    }
})(window.angular);

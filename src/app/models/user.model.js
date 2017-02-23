(function() {
    'use strict';

    angular
        .module('pbox')
        .factory('UserModel', userModelFactory);

    /** @ngInject */
    function userModelFactory() {

        function UserModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.first_name = obj && obj.firstName ? obj.firstName : null;
            this.last_name = obj && obj.lastName ? obj.lastName : null;
            this.username = obj && obj.username ? obj.username : null;
            this.password = obj && obj.password ? obj.password : null;
            this.type = obj && obj.type ? obj.type : null;
            this.token = obj && obj.token ? obj.token : null;
        }
        return UserModel;
    }
})();
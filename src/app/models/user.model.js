(function (angular) {
    angular
        .module('pbox')
        .factory('UserModel', userModelFactory);

    /**@ngInject */
    function userModelFactory() {
        function UserModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.firstName = obj && obj.first_name ? obj.first_name : null;
            this.lastName = obj && obj.last_name ? obj.last_name : null;
            this.username = obj && obj.username ? obj.username : null;
            this.password = obj && obj.password ? obj.password : null;
            this.type = obj && obj.type ? obj.type : null;
            this.token = obj && obj.token ? obj.token : null;
        }
        return UserModel;
    }
})(window.angular);

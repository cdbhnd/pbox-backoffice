(function (angular) {
    angular
        .module('pbox.notify')
        .service('notifyService', authService);

    /**@ngInject */
    function authService($q, ngNotify) {
        var service = this;

        service.info = info;
        service.success = success;
        service.warn = warn;
        service.error = error;
        service.grimace = grimace;

        //////////////////////////////////

        function info(message) {
            return raiseNotification(message, 'info');
        }

        function success(message) {
            return raiseNotification(message, 'success');
        }

        function warn(message) {
            return raiseNotification(message, 'warn');
        }

        function error(message) {
            return raiseNotification(message, 'error');
        }

        function grimace(message) {
            return raiseNotification(message, 'grimace');
        }

        /**Raise UI notification by using ngNotify plugin
         * @param {string} message - Message to be displayed in UI notification
         * @param {string} type - Type of UI notification to display (success, error, warn, info, grimace, default)
         * @returns {Promise<boolean>} - If the notification is successfully shown promise resolves true if not, false
         */
        function raiseNotification(message, type) {
            return $q.when(function () {
                try {
                    ngNotify.set(!!message ? message : 'default', type);
                    return true;
                } catch(e) {
                    return false;
                }
            }());
        }
    }
})(window.angular);

(function() {
    'use strict';

    angular
        .module('pbox.iot')
        .service('iotService', iotService);

    /** @ngInject */
    function iotService($rootScope, $window) {

        var service = this;
        var host = "https://api.allthingstalk.io:15671/stomp";
        var listeners = {};

        service.listen = listenBox;
        service.stopListen = stopListenBox;
        service.stopListenAll = stopListenAll;

        //////////////////////////////////////

        function listenBox(box) {

            if (!!listeners[box.id]) {
                return true;
            }

            try {
                console.log('----------startFeed----------');
                var ws = new $window.SockJS(host);
                var s = $window.Stomp.over(ws);

                s.heartbeat.outgoing = 2000;
                s.heartbeat.incoming = 0;

                s.connect(box.clientId, box.clientKey, function(success) {
                    s.subscribe(box.topic, function(response) {
                        var data = JSON.parse(response.body);
                        box.setSensorValue(data.Id, data.Value);
                        // run angular apply and digest process in 
                        // order to new sensors values can be visible to other components in the app
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    });
                }, function(error) {}, box.clientId);

                listeners[box.id] = s;
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }

        function stopListenBox(boxId) {
            try {
                if (listeners[boxId]) {
                    listeners[boxId].disconnect(function() {
                        console.log('Box with id: ' + boxId + ' has been disconnected from IOT');
                        delete listeners[boxId];
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }

        function stopListenAll() {
            for (var i in listeners) {
                if (listeners.hasOwnProperty(i)) {
                    stopListenBox(i);
                }
            }
        }
    }
})();
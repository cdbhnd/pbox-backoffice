(function (angular) {
    angular
        .module('pbox.iot')
        .service('iotService', iotService);

    /**@ngInject */
    function iotService($rootScope, $window, config) {
        var service = this;
        var host = config.att.STOMP_HOST;
        var listeners = {};

        service.listenBox = listenBox;
        service.listenAllBoxes = listenAllBoxes;
        service.stopListenBox = stopListenBox;
        service.stopListenAllBoxes = stopListenAllBoxes;

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

                s.connect(box.clientId, box.clientKey, function () {
                    s.subscribe(box.topic, function (response) {
                        var data = JSON.parse(response.body);
                        box.setSensorValue(data.Id, data.Value);
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    });
                }, null, box.clientId);

                listeners[box.id] = s;
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }

        function listenAllBoxes(boxes) {
            if (!!boxes && !boxes.length) {
                return false;
            }

            try {
                console.log('----------startFeed----------');
                var ws = new $window.SockJS(host);
                var s = $window.Stomp.over(ws);

                s.heartbeat.outgoing = 2000;
                s.heartbeat.incoming = 0;

                s.connect(boxes[0].clientId, boxes[0].clientKey, function () {
                    s.subscribe(boxes[0].topic, function (response) {
                        var data = JSON.parse(response.body);
                        for (var i = 0; i < boxes.length; i++) {
                            boxes[i].setSensorValue(data.Id, data.Value);
                            listeners[boxes[i].id] = s;
                        }
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    });
                }, null, boxes[0].clientId);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }

        function stopListenBox(boxId) {
            try {
                if (listeners[boxId]) {
                    listeners[boxId].disconnect(function () {
                        console.log('Box with id: ' + boxId + ' has been disconnected from IOT');
                        delete listeners[boxId];
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }

        function stopListenAllBoxes() {
            for (var i in listeners) {
                if (listeners.hasOwnProperty(i)) {
                    stopListenBox(i);
                }
            }
        }
    }
})(window.angular);

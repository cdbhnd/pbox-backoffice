(function() {
    'use strict';

    angular
        .module('pbox')
        .factory('BoxModel', boxModelFactory);

    /** @ngInject */
    function boxModelFactory(iotService, GeolocationModel) {

        function BoxModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.code = obj && obj.code ? obj.code : null;
            this.size = obj && obj.size ? obj.size : null;
            this.status = obj && obj.status ? obj.status : null;
            this.host = obj && obj.host ? obj.host : null;
            this.topic = obj && obj.topic ? obj.topic : null;
            this.groundId = obj && obj.groundId ? obj.groundId : null;
            this.clientId = obj && obj.clientId ? obj.clientId : null;
            this.clientKey = obj && obj.clientKey ? obj.clientKey : null;
            this.deviceId = obj && obj.deviceId ? obj.deviceId : null;
            this.deviceName = obj && obj.deviceName ? obj.deviceName : null;
            this.gps_sensor = obj && obj.sensors ? findSensor(obj.sensors, 'GPS') : null;
            this.temp_sensor = obj && obj.sensors ? findSensor(obj.sensors, 'TEMPERATURE') : null;
            this.acc_sensor = obj && obj.sensors ? findSensor(obj.sensors, 'ACCELEROMETER') : null;
            this.battery_sensor = obj && obj.sensors ? findSensor(obj.sensors, 'BATTERY') : null;

            this._listen_active = false;
            this._sensors = obj && obj.sensors ? obj.sensors : [];
        }

        BoxModel.prototype.activate = function() {
            if (!this._listen_active) {
                iotService.listen(this);
                this._listen_active = true;
            }
        }

        BoxModel.prototype.deactivate = function() {
            if (this._listen_active) {
                iotService.stopListen(this.id);
                this._listen_active = false;
            }
        }

        BoxModel.prototype.setSensorValue = function(sensorId, value) {
            if (!!this.battery_sensor && this.battery_sensor.assetId == sensorId) {
                console.log('Battery sensor updated');
                console.log(value);
                var batteryData = value.split(",");
                this.battery_sensor.value = {
                    percentage: batteryData[0],
                    charging: batteryData[1]
                }
            }
        }

        return BoxModel;

        function findSensor(sensors, type) {
            // find and return sensor by type;
            for (var i = 0; i < sensors.length; i++) {
                if (sensors[i].type == type) {
                    return sensors[i];
                }
            }
        }
    }
})();
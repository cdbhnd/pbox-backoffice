(function (angular) {
    angular
        .module('pbox')
        .factory('BoxModel', boxModelFactory);

    /**@ngInject */
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
            this.gpsSensor = obj && obj.sensors ? findSensor(obj.sensors, 'GPS') : null;
            this.tempSensor = obj && obj.sensors ? findSensor(obj.sensors, 'TEMPERATURE') : null;
            this.accSensor = obj && obj.sensors ? findSensor(obj.sensors, 'ACCELEROMETER') : null;
            this.batterySensor = obj && obj.sensors ? findSensor(obj.sensors, 'BATTERY') : null;
            this.vibrationSensor = obj && obj.sensors ? findSensor(obj.sensors, 'VIBRATION') : null;

            this.listenActive = false;
            this.sensors = obj && obj.sensors ? obj.sensors : [];
        }

        BoxModel.prototype.activate = function () {
            if (!this.listenActive) {
                iotService.listenBox(this);
                this.listenActive = true;
            }
        };

        BoxModel.prototype.deactivate = function () {
            if (this.listenActive) {
                iotService.stopListenBox(this.id);
                this.listenActive = false;
            }
        };

        BoxModel.prototype.setSensorValue = function (sensorId, value) {
            if (!!this.gpsSensor && this.gpsSensor.assetId === sensorId) {
                var geolocationModel = new GeolocationModel();
                this.gpsSensor.value = geolocationModel.parseGpsSensorValue(value);
            }
            if (!!this.tempSensor && this.tempSensor.assetId === sensorId) {
                var tempHumi = value.split(',');
                this.tempSensor.value = {
                    temperature: tempHumi[0],
                    humidity: tempHumi[1]
                };
            }
            if (!!this.accSensor && this.accSensor.assetId === sensorId) {
                var accelerometerValues = value.split(',');
                this.accSensor.value = {
                    ax: accelerometerValues[0],
                    ay: accelerometerValues[1],
                    az: accelerometerValues[2]
                };
            }
            if (!!this.batterySensor && this.batterySensor.assetId === sensorId) {
                var batteryData = value.split(',');
                this.batterySensor.value = {
                    percentage: batteryData[0],
                    charging: batteryData[1]
                };
            }
            if (!!this.vibrationSensor && this.vibrationSensor.assetId === sensorId) {
                this.vibrationSensor.value = parseInt(value, 10);
            }
        };

        return BoxModel;

        function findSensor(sensors, type) {
            for (var i = 0; i < sensors.length; i++) {
                if (sensors[i].type === type) {
                    return sensors[i];
                }
            }
            return null;
        }
    }
})(window.angular);

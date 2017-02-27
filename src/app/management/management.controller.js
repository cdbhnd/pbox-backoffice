(function () {
    'use strict';

    angular
        .module('pbox.management')
        .controller('managementController', managementController);


    function managementController(DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        // properties 
        vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        console.log(vm.dtOptions);
        console.log(vm.dtColumnDefs);
        vm.boxes = [{
    "_id": {
        "$oid": "58b40a29f7ec7700045f09a3"
    },
    "id": "58b40a29f7ec7700045f09a3",
    "code": "cloneBox",
    "size": null,
    "status": "ACTIVE",
    "sensors": [
        {
            "name": "GPS",
            "code": "2",
            "status": "IDLE",
            "value": {
                "latitude": "44.807062",
                "longitude": "20.425606"
            },
            "assetId": "nYwLL7d7vVuuRZfQd1fHvg4R",
            "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.nYwLL7d7vVuuRZfQd1fHvg4R.state",
            "type": "GPS"
        },
        {
            "name": "ACTIVATOR",
            "code": "3",
            "status": "IDLE",
            "value": true,
            "assetId": "vCCzASPfBZtLLjtcReb4X7GL",
            "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.vCCzASPfBZtLLjtcReb4X7GL.state",
            "type": "ACTIVATOR"
        },
        {
            "name": "TEMPERATURE",
            "code": "4",
            "status": "IDLE",
            "value": null,
            "assetId": "mjmfEknFZgnfseWeogRrjvON",
            "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.mjmfEknFZgnfseWeogRrjvON.state",
            "type": "TEMPERATURE"
        },
        {
            "name": "ACCELEROMETER",
            "code": "6",
            "status": "IDLE",
            "value": null,
            "assetId": "QIVvCFUG6CilC9nXx4KnLoK9",
            "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.QIVvCFUG6CilC9nXx4KnLoK9.state",
            "type": "ACCELEROMETER"
        },
        {
            "name": "log",
            "code": "7",
            "status": "IDLE",
            "value": null,
            "assetId": "GcSjIYMytg3pmdlCKHW6a2dJ",
            "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.GcSjIYMytg3pmdlCKHW6a2dJ.state",
            "type": "log"
        },
        {
            "name": "BATTERY",
            "code": "5",
            "status": "IDLE",
            "value": null,
            "assetId": "KvMztqcoya01eGx45GajLUYF",
            "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.KvMztqcoya01eGx45GajLUYF.state",
            "type": "BATTERY"
        }
    ],
    "deviceId": "tBulZIcRpJqgrDcD2EoWxvrf",
    "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.#",
    "clientId": "ognjent_EjGwg4VW",
    "clientKey": "GsqcBmey"
},{
    "_id": {
        "$oid": "58808cda8b08fd6ae222ad14"
    },
    "id": "58808cda8b08fd6ae222ad14",
    "code": "xyz111",
    "size": "L",
    "status": "ACTIVE",
    "sensors": [
        {
            "name": "gps",
            "code": "s1",
            "status": "ACTIVE",
            "value": {
                "latitude": "44.821983",
                "longitude": "20.414627"
            },
            "assetId": "I55vyk5thZpyN6zaJs7xCchJ",
            "assetName": "2",
            "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.I55vyk5thZpyN6zaJs7xCchJ.state",
            "type": "GPS"
        },
        {
            "name": "activateButton",
            "code": "s2",
            "status": "ACTIVE",
            "value": false,
            "assetId": "3bwzwk7PmTwb4x3NKD8mnWpR",
            "assetName": "3",
            "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.3bwzwk7PmTwb4x3NKD8mnWpR.state",
            "type": "ACTIVATOR"
        },
        {
            "name": "accelerometer",
            "code": "s3",
            "status": "ACTIVE",
            "value": {
                "ax": "246.660g",
                "ay": "245.474g",
                "az": "228.877g"
            },
            "assetId": "hwGfgZT7B9wRecrCuLEtQ6oa",
            "assetName": "6",
            "topic": "client.np.in.asset.hwGfgZT7B9wRecrCuLEtQ6oa.state",
            "type": "ACCELEROMETER"
        },
        {
            "name": "temperature",
            "code": "s4",
            "status": "ACTIVE",
            "value": {
                "temperature": "25.60C",
                "humidity": "47.00%"
            },
            "assetId": "zETwpBDHYhksu1xJDMt3y627",
            "assetName": "4",
            "topic": "client.np.in.asset.zETwpBDHYhksu1xJDMt3y627.state",
            "type": "TEMPERATURE"
        },
        {
            "name": "battery",
            "code": "s5",
            "status": "ACTIVE",
            "value": "100%,1",
            "assetId": "KZ17pf3Gdp00Q83Uu33FslHT",
            "assetName": "5",
            "topic": "client.np.in.asset.KZ17pf3Gdp00Q83Uu33FslHT.state",
            "type": "BATTERY"
        }
    ],
    "host": "https://api.allthingstalk.io:15671/stomp",
    "topic": "/exchange/root/client.ognjent_EjGwg4VW.in.asset.#",
    "groundId": "ovmeIFchoK7sH6HoPZOZY9gx",
    "clientId": "ognjent_EjGwg4VW",
    "clientKey": "GsqcBmey",
    "deviceId": "tIfnBDpabrH4K6aF5l2RCAnv",
    "deviceName": "Lolamu"
}];

        
        //methods
        vm.deleteBox = deleteBox;


        (function activate() {
            // loadBoxes()
            //     .then(loadBooking)
            //     .then(loadPassengers)
            //     .then(setBirthDateMin);
        }());

        function deleteBox(index) {
            console.log('Delete box');
        }


    }
})();

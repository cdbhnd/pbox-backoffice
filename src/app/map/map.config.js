(function (angular, google) {
    angular
        .module('pbox.map')
        .constant('mapConfig', {

            positionOptions: {
                timeout: 6000,
                enableHighAccuracy: true
            },
            mapOptions: {
                center: null,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                styles: [
                    {
                        featureType: 'landscape.natural',
                        stylers: [{ visibility: 'on' }, { color: '#e2cbac' }]
                    },
                    {
                        featureType: 'water',
                        stylers: [{ visibility: 'on' }, { color: '#9ed0e9' }]
                    },
                    {
                        featureType: 'landscape.natural',
                        stylers: [{ visibility: 'simplified' }]
                    },
                    {
                        featureType: 'transit',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'poi',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'road.arterial',
                        elementType: 'geometry.fill',
                        stylers: [{ visibility: 'on' }, { color: '#ffffff' }]
                    },
                    {
                        featureType: 'road.arterial',
                        elementType: 'geometry.stroke',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'road.local',
                        elementType: 'geometry.stroke',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'landscape.man_made',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'road.highway.controlled_access',
                        elementType: 'geometry.fill',
                        stylers: [{ color: '#baaca2' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'road.highway.controlled_access',
                        elementType: 'labels.text.fill',
                        stylers: [{ visibility: 'on' }, { color: '#ffffff' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#565757' }, { visibility: 'on' }]
                    },
                    {
                        featureType: 'road.local',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#808080' }, { visibility: 'off' }]
                    },
                    {
                        featureType: 'road.arterial',
                        elementType: 'labels.text.stroke',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'administrative.neighborhood',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{ visibility: 'on' }, { color: '#535555' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#fffffe' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.text.stroke',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.icon',
                        stylers: [{ visibility: 'on' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.icon',
                        stylers: [{ visibility: 'on' }, { saturation: -100 }, { lightness: 17 }]
                    },
                    {}
                ]
            }
        });
})(window.angular, window.google);

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFraW1zIiwiYSI6ImNqZmQ1bm4yaDF4NnQzdW8xem54dmNzYXQifQ.VfaDRyNApyLYnCVL7PcpzA';

var mapStyle = 'mapbox://styles/aakims/cjfgej20o1t452smsp0rysgsi';
var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyle,
    center: [-96, 37.8],
    zoom: 3
});

map.on('load', function () {
    // Add a layer showing the state polygons.
    map.addLayer({
        'id': 'states-layer',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson'
        },
        'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
    });
    });

//displayMap(); 
// var months = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December'
// ];

//list of mappable elements: 'AVGSAL', 'APP', 'WORKER', 'PCTINSTATE'
//col format: [quarterkey_resultkey_col]


// function filterBy(month) {

//     var filters = ['==', 'month', month];
//     map.setFilter('earthquake-circles', filters);
//     map.setFilter('earthquake-labels', filters);

//     // Set the label to the month
//     document.getElementById('month').textContent = months[month];
// }

// function filterBy(quarter) {

//     var qprefix = empSt_quarterkey[quarter];

//     var filters = ['==', 'month', month];
//     map.setFilter('earthquake-circles', filters);
//     map.setFilter('earthquake-labels', filters);

//     // Set the label to the month
//     document.getElementById('month').textContent = months[month];
// };
//var displayMap = function() {

/*
    map = new mapboxgl.Map({
        container: 'map',
        style: mapStyle,
        zoom: 3,
        center: [-96, 37.8] //[-75.1652, 39.9526]
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", function() {
        map.addSource("state-level", {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": thisStateData
            }
        });

        map.addSource("county-level", {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": thisCountyData
            }
        });

        map.addLayer({
            "id": "state-level-result",
            "type": "fill",
            "source": "sensing-samples",
            "paint": {
                'fill-color': 'rgba(200, 100, 240, 0.4)'
            }
            // {
            //     "circle-radius": markerSize,
            //     "circle-color": "#db8a83",
            //     // [
            //     // 'match', 
            //     // ['get', 'properties.olive'],
            //     // 6 , "#ffff", 
            //     // "#db8a83"
            //     // ],
            //     "circle-opacity": 1
            // }
        });

        // map.addLayer({
        //     "id": "path-hover",
        //     "type": "circle",
        //     "source": "sensing-samples",
        //     "paint": {
        //         "circle-radius": markerSize + 3,
        //         "circle-color": "#54505E",
        //         "circle-opacity": 1
        //     },
        //     "filter": ["==", "unixt", ""]
        // });
    });
//};
*/

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFraW1zIiwiYSI6ImNqZmQ1bm4yaDF4NnQzdW8xem54dmNzYXQifQ.VfaDRyNApyLYnCVL7PcpzA';

var mapStyle = 'mapbox://styles/aakims/cjfgej20o1t452smsp0rysgsi';
var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyle,
    center: [-96, 37.8],
    zoom: 3
});

var zoomThreshold = 4; 

map.addControl(new mapboxgl.NavigationControl());


map.on('load', function() {

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

    // map.addLayer({
    //         "id": "state-level-result",
    //         "type": "fill",
    //         "source": "state-level",
    //         "maxzoom": zoomThreshold,
    //         "paint": {
    //             'fill-color': 'rgba(155, 100, 240, 0.4)'
    //         }
    //         // {
    //         //     "circle-radius": markerSize,
    //         //     "circle-color": "#db8a83",
    //         //     // [
    //         //     // 'match', 
    //         //     // ['get', 'properties.olive'],
    //         //     // 6 , "#ffff", 
    //         //     // "#db8a83"
    //         //     // ],
    //         //     "circle-opacity": 1
    //         // }
    //     });

    map.addLayer({
            "id": "county-level-result",
            "type": "fill",
            "source": "county-level",
            "minzoom": zoomThreshold,
            "paint": {
                'fill-color': 'rgba(155, 155, 155, 0.4)'
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

    $('#denied').click(function() {
        result = 'DEN';
        resultChange(); 
        map.removeLayer("state-level-result");
        map.removeSource("state-level");
        updateSource();
        updateLayer(); 
    }); 

    $('#certified').click(function() {
        result = 'CERT';
        resultChange(); 
        map.removeLayer("state-level-result");
        map.removeSource("state-level");
        updateSource();
        updateLayer(); 
    });

    $('#withdrawn').click(function() {
        result = 'WD';
        resultChange(); 
        map.removeLayer("state-level-result");
        map.removeSource("state-level");
        updateSource();
        updateLayer(); 
        //printThis();
        //console.log('withdrawn');
    });

    $('#worksite').click(function() {
        subject = 'worksite';
        initizeWithState(); 
        //printThis();
        //console.log('withdrawn');
    });

    $('#employer').click(function() {
        subject = 'employer';
        initizeWithState(); 
    });

    var whichLev = function () {
        var zoomLev = map.getZoom(); 
        console.log(zoomLev); 
        if (zoomLev < 4) {
            return 'state-level-result';
        } else {return 'county-level-result';}
    };

    var labelLayer = whichLev(); 

    console.log(labelLayer); 

    map.on('click', labelLayer, function (e) {

        // var labelStr; 
        var result_worker = subjectKey[subject] + "_18Q1_" + result + "_WORKER";
        console.log(result_worker);
        
        var labelStr = '<h3>State of ' + e.features[0].properties.NAME + '</h3><p>There are ' + e.features[0].properties[result_worker] + ' H1B workers</p>'
        console.log(labelStr);

    
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            //.setHTML(e.features[0].properties.NAME)
            .setHTML(labelStr)
            .addTo(map);
    });



});

var updateSource = function() {
    return map.addSource("state-level", {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": thisStateData
            }
        }); 
};

var updateLayer = function() {
       return map.addLayer({
            "id": "state-level-result",
            "type": "fill",
            "source": "state-level",
            "maxzoom": zoomThreshold,
            "paint": {
                'fill-color': 'rgba(155, 100, 240, 0.4)'
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

    };

var labelMaker = function(labelLayer) {

    var labelStr; 
    var result_worker = subjectKey[subject] + "_18Q1_" + result + "_WORKER";
    console.log(result_worker);
    if (labelLayer == 'state-level-result') {
        labelStr = '<h3>State of ' + e.features[0].properties.NAME + '</h3><p>There are' + e.features[0].properties[result_worker] + '</p>'
    };
    return labelStr; 

};

var displayMap = function() {

    var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyle,
    center: [-96, 37.8],
    zoom: 3
    });

    console.log(map);
    map.on('load', function() {
        // Add a layer showing the state polygons.
        // map.addLayer({
        //     'id': 'states-layer',
        //     'type': 'fill',
        //     'source': {
        //         'type': 'geojson',
        //         'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson'
        //     },
        //     'paint': {
        //         'fill-color': 'rgba(200, 100, 240, 0.4)',
        //         'fill-outline-color': 'rgba(200, 100, 240, 1)'
        //     }
        // });


        map.addSource("state-level", {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": thisStateData
            }
        });


        map.addLayer({
            "id": "state-level-result",
            "type": "fill",
            "source": "state-level",
            "paint": {
                'fill-color': 'rgba(155, 100, 240, 0.4)'
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

    });
};

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


// map = new mapboxgl.Map({
//     container: 'map',
//     style: mapStyle,
//     zoom: 3,
//     center: [-96, 37.8] //[-75.1652, 39.9526]
// });


//     map.on("load", function() {
//         map.addSource("state-level", {
//             "type": "geojson",
//             "data": {
//                 "type": "FeatureCollection",
//                 "features": thisStateData
//             }
//         });

//         map.addSource("county-level", {
//             "type": "geojson",
//             "data": {
//                 "type": "FeatureCollection",
//                 "features": thisCountyData
//             }
//         });

//         map.addLayer({
//             "id": "state-level-result",
//             "type": "fill",
//             "source": "sensing-samples",
//             "paint": {
//                 'fill-color': 'rgba(200, 100, 240, 0.4)'
//             }
//             // {
//             //     "circle-radius": markerSize,
//             //     "circle-color": "#db8a83",
//             //     // [
//             //     // 'match', 
//             //     // ['get', 'properties.olive'],
//             //     // 6 , "#ffff", 
//             //     // "#db8a83"
//             //     // ],
//             //     "circle-opacity": 1
//             // }
//         });

//         // map.addLayer({
//         //     "id": "path-hover",
//         //     "type": "circle",
//         //     "source": "sensing-samples",
//         //     "paint": {
//         //         "circle-radius": markerSize + 3,
//         //         "circle-color": "#54505E",
//         //         "circle-opacity": 1
//         //     },
//         //     "filter": ["==", "unixt", ""]
//         // });
//     });
// //};
// };
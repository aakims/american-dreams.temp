mapboxgl.accessToken = 'pk.eyJ1IjoiYWFraW1zIiwiYSI6ImNqZmQ1bm4yaDF4NnQzdW8xem54dmNzYXQifQ.VfaDRyNApyLYnCVL7PcpzA';

var mapStyle = 'mapbox://styles/aakims/cjgx8l7h500012sph7oarvuza';
//'mapbox://styles/aakims/cjfgej20o1t452smsp0rysgsi';
var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyle,
    center: [-105.43, 39.585],
    zoom: 3.9
});


var colorSch; 
var theStateRule, theRule; 
var zoomThreshold = 4.5;
// var markerSize = function () {
//     var mapZoom = map.getZoom(); 
//     mapZoom < 4.5 ? 5 :
//     mapZoom < 8 ? 10 : 15; 
//     return mapZoom;}

var stateMajorCities = {
        "id": "state-major-cities",
        "type": "circle",
        "source": "cities",
        "minzoom": zoomThreshold,
        "filter": ["all", ["==", "NATEMP", "False"],
            ["==", "NATEMP", "False"]
        ],
        "paint": {
            "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            zoomThreshold, 0,
            zoomThreshold+1, 8
            ],
            "circle-color": "#B29F73",
            "circle-opacity": 1
        }
    };

var nationalMajorCities = {
        "id": "national-major-cities",
        "type": "circle",
        "source": "cities",
        "filter": ["any", ["==", "NATEMP", "True"],
            ["==", "NATWORK", "True"]
        ],
        "paint": {
            "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            zoomThreshold, 5,
            zoomThreshold+1, 10
            ],
            "circle-color": "#550E28",
            "circle-opacity": 1
        }
    };

map.addControl(new mapboxgl.NavigationControl());

function showStatePaintRules () {

    var selKey = subjKey[subj] + "_18Q1_" + result + "_" + featureKey; 
    console.log(selKey);

    var findRule = function(colscheme) {
        output = {
            'fill-color': colscheme,
            'fill-opacity': 0.7
        };
        return output;
    };

    var quantBreaksState = []; 

    if (featureKey == "WORKER") {

        if ((subj == "worksite") && (result == "CERT")) {
            quantBreaksState = [2, 209, 741, 2314, 6537, 142255]; // max 65191
        } else if ((subj == "worksite") && (result == "DEN")) {
            quantBreaksState = [1, 5, 12, 30, 89, 2276]; // max 1137
        } else if ((subj == "worksite") && (result == "WD")) {
            quantBreaksState = [1, 9, 26, 72, 183, 3709]; // NA 
        } else if ((subj == "employer") && (result == "CERT")) {
            quantBreaksState = [2, 87, 246, 674, 4087, 151092];
        } else if ((subj == "employer") && (result == "DEN")) {
            quantBreaksState = [1, 4, 9, 21, 68, 2629];
        } else { // (subj == "employer" && result == "WD")
            quantBreaksState = [1, 5, 12, 39, 135, 15149];
        }

    } else { // (selKey == "AVGSAL")

        if (subj == "worksite" && result == "CERT") {
            quantBreaksState = [30000, 45000, 65000, 85000, 100000];
        } else if (subj == "worksite" && result == "DEN") {
            quantBreaksState = [30000, 45000, 65000, 85000, 100000];
        } else if (subj == "worksite" && result == "WD") { // (result == "WD")
            quantBreaksState = [30000, 45000, 65000, 85000, 100000];
        } else if (subj == "employer" && result == "CERT") {
            quantBreaksState = [30000, 45000, 65000, 85000, 100000];
        } else if (subj == "employer" && result == "DEN") {
            quantBreaksState = [30000, 45000, 65000, 85000, 100000];
        } else { // (subj == "employer" && result == "WD")
            quantBreaksState = [30000, 45000, 65000, 85000, 100000];
        }
    }
    console.log(quantBreaksState);

    var certColSch = [
        'interpolate', ['linear'],
        ['get', selKey],
        quantBreaksState[0], '#eff8fb',
        quantBreaksState[1], '#b8cde1',
        quantBreaksState[2], '#8d97c2',
        quantBreaksState[3], '#805aa2',
        quantBreaksState[4], '#762178'
    ];

    var denColSch = [
        'interpolate', ['linear'],
        ['get', selKey],
        quantBreaksState[0], '#fcf0db',
        quantBreaksState[1], '#f6cd93',
        quantBreaksState[2], '#ee9264',
        quantBreaksState[3], '#d3553e',
        quantBreaksState[4], '#a52015'
    ];

    var wdColSch = [
        'interpolate', ['linear'],
        ['get', selKey],
        quantBreaksState[0], '#f1eef6',
        quantBreaksState[1], '#d7b5d8',
        quantBreaksState[2], '#df65b0',
        quantBreaksState[3], '#dd1c77',
        quantBreaksState[4], '#980043'
    ];

    if (result == "CERT") {
        theStateRule = findRule(certColSch);
    } else if (result == "DEN") {
        theStateRule = findRule(denColSch);
    } else {
        theStateRule = findRule(wdColSch); 
    }

    return theStateRule;
};

function showPaintRules () {

    var selKey = subjKey[subj] + "_18Q1_" + result + "_" + featureKey; 
    console.log(selKey);

    var findRule = function(colscheme) {
        output = {
            'fill-color': colscheme,
            'fill-opacity': 0.7
        };
        return output;
    };

    var quantBreaks = []; 

    if (featureKey == "WORKER") {

        if ((subj == "worksite") && (result == "CERT")) {
            quantBreaks = [0, 1, 3, 8, 47, 65191]; // max 65191
        } else if ((subj == "worksite") && (result == "DEN")) {
            quantBreaks = [0, 1, 2, 3, 8, 1137]; // max 1137
        } else if ((subj == "worksite") && (result == "WD")) {
            quantBreaks = [0, 1, 2, 4, 14, 1128]; // NA 
        } else if ((subj == "employer") && (result == "CERT")) {
            quantBreaks = [0, 1, 2, 6, 27, 90320];
        } else if ((subj == "employer") && (result == "DEN")) {
            quantBreaks = [0, 1, 2, 3, 7, 2474];
        } else { // (subj == "employer" && result == "WD")
            quantBreaks = [0, 1, 2, 3, 11, 14893];
        }

    } else { // (selKey == "AVGSAL")

        if (subj == "worksite" && result == "CERT") {
            quantBreaks = [30000, 45000, 65000, 85000, 100000];
        } else if (subj == "worksite" && result == "DEN") {
            quantBreaks = [30000, 45000, 65000, 85000, 100000];
        } else if (subj == "worksite" && result == "WD") { // (result == "WD")
            quantBreaks = [30000, 45000, 65000, 85000, 100000];
        } else if (subj == "employer" && result == "CERT") {
            quantBreaks = [30000, 45000, 65000, 85000, 100000];
        } else if (subj == "employer" && result == "DEN") {
            quantBreaks = [30000, 45000, 65000, 85000, 100000];
        } else { // (subj == "employer" && result == "WD")
            quantBreaks = [30000, 45000, 65000, 85000, 100000];
        }
    }
    console.log(quantBreaks);

    var certColSch = [
        'interpolate', ['linear'],
        ['get', selKey],
        quantBreaks[0], '#eff8fb',
        quantBreaks[1], '#b8cde1',
        quantBreaks[2], '#8d97c2',
        quantBreaks[3], '#805aa2',
        quantBreaks[4], '#762178'
    ];

    var denColSch = [
        'interpolate', ['linear'],
        ['get', selKey],
        quantBreaks[0], '#fcf0db',
        quantBreaks[1], '#f6cd93',
        quantBreaks[2], '#ee9264',
        quantBreaks[3], '#d3553e',
        quantBreaks[4], '#a52015'
    ];

    var wdColSch = [
        'interpolate', ['linear'],
        ['get', selKey],
        quantBreaks[0], '#f1eef6',
        quantBreaks[1], '#d7b5d8',
        quantBreaks[2], '#df65b0',
        quantBreaks[3], '#dd1c77',
        quantBreaks[4], '#980043'
    ];

    if (result == "CERT") {
        theRule = findRule(certColSch);
    } else if (result == "DEN") {
        theRule = findRule(denColSch);
    } else {
        theRule = findRule(wdColSch); 
    }

    return theRule;
};


map.on('load', function() {

    var cityPopup;
    showPaintRules(); 
    showStatePaintRules();

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

    map.addSource("cities", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": allCities
        }
    });

    map.addLayer({
        "id": "state-level-result",
        "type": "fill",
        "source": "state-level",
        "maxzoom": zoomThreshold,
        "paint": theStateRule
    });

    map.addLayer({
        "id": "county-level-result",
        "type": "fill",
        "source": "county-level",
        "minzoom": zoomThreshold,
        "paint": theRule
    });


    $('#denied').click(function() {
        result = 'DEN';
        resultChange();
        layerTheWorks();
    });

    $('#certified').click(function() {
        result = 'CERT';
        resultChange();
        layerTheWorks();
    });

    $('#withdrawn').click(function() {
        result = 'WD';
        resultChange();
        layerTheWorks();
        //printThis();
        //console.log('withdrawn');
    });

    $('#worksite').click(function() {
        subj = 'worksite';
        resultChange(); 
        //subjectChange();
        getData("worksite");
        initizeWithState();
    });

    $('#employer').click(function() {
        subj = 'employer';
        //resultChange(); 
        getData("employer");
        initizeWithState();
    });

    $('#worker').click(function() {
        featureKey = 'WORKER';
        layerTheWorks();
    });

    $('#avgsal').click(function() {
        featureKey = 'AVGSAL';
        layerTheWorks();
    });

    map.addLayer(nationalMajorCities);

    map.addLayer(stateMajorCities);

    map.on('click', 'state-level-result', function(e) {

        //var labelStr; 
        var result_worker = subjKey[subj] + "_18Q1_" + result + "_WORKER";
        console.log(result_worker);

        var labelStr = '<h3>State of ' + e.features[0].properties.NAME + '</h3><p>There are ' + e.features[0].properties[result_worker] + ' foreign high-skilled workers ' + resultKey[result] + '</p>'
        console.log(labelStr);

        console.log(e.features[0]);
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            //.setHTML(e.features[0].properties.NAME)
            .setHTML(labelStr)
            .addTo(map);

    });

    map.on('click', 'county-level-result', function(e) {

        //var labelStr; 
        var result_worker = subjKey[subj] + "_18Q1_" + result + "_WORKER";
        console.log(result_worker);
        var labelStr = '<h3>' + e.features[0].properties.NAME + ' County</h3><p>There are ' + e.features[0].properties[result_worker] + ' foreign high-skilled workers ' + resultKey[result] + '</p>'

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            //.setHTML(e.features[0].properties.NAME)
            .setHTML(labelStr)
            .addTo(map);
    });

    map.on('click', 'national-major-cities', function(e) {

        map.getCanvas().style.cursor = 'pointer';
        console.log(e.features[0]);
        var typeArray = e.features[0].properties['TYPE'].split(", ");
        var cityArray = _.uniq(typeArray); 
        console.log(cityArray);

        var cityTemplate = function (array) {

            listArray = [];
            for (var index in array) {
                listItem = "<span> " + array[index] + "</span>";
                console.log(listItem);
                listArray.push(listItem); 
            }
            return listArray; 

        };

        var description = "<h5>" + e.features[0].properties["CITYLABEL"] + "<br>" + cityTemplate(cityArray) + "<br>";
        new mapboxgl.Popup().setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);

        // Populate the popup and set its coordinates
        // based on the feature found.

    });

    map.on('click', 'state-major-cities', function(e) {

        map.getCanvas().style.cursor = 'pointer';

        console.log(e.features[0]);
        var typeArray = e.features[0].properties['TYPE'].split(", ");
        var cityArray = _.uniq(typeArray); 
        console.log(cityArray);

        var cityTemplate = function (array) {

            listArray = [];
            for (var index in array) {
                listItem = "<span> " + array[index] + "</span>";
                console.log(listItem);
                listArray.push(listItem); 
            }
            return listArray; 

        };

        var description = "<h5>" + e.features[0].properties["CITYLABEL"] + "<br>" + cityTemplate(cityArray) + "<br>";

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            
        // }
        new mapboxgl.Popup().setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);

        // Populate the popup and set its coordinates
        // based on the feature found.

    });


});

var updateStateSource = function() {
    return map.addSource("state-level", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": thisStateData
        }
    });
};

var updateCountySource = function() {
    return map.addSource("county-level", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": thisCountyData
        }
    });
};

var updateStateLayer = function() {
    return map.addLayer({
        "id": "state-level-result",
        "type": "fill",
        "source": "state-level",
        "maxzoom": zoomThreshold,
        "paint": theStateRule


    });

};


var updateCountyLayer = function() {
    return map.addLayer({
        "id": "county-level-result",
        "type": "fill",
        "source": "county-level",
        "minzoom": zoomThreshold,
        "paint": theRule
    });

};

var updateNationalCities = function (){
    return map.addLayer(nationalMajorCities);
};

var updateStateCities = function (){
    return map.addLayer(stateMajorCities)
};

var layerTheWorks = function() {
    map.removeLayer("state-level-result");
        map.removeSource("state-level");
        map.removeLayer("county-level-result");
        map.removeSource("county-level");
        map.removeLayer("national-major-cities");
        map.removeLayer("state-major-cities");
        showPaintRules(); 
        showStatePaintRules();
        updateStateSource();
        updateStateLayer();
        updateCountySource();
        updateCountyLayer();
        updateNationalCities(); 
        updateStateCities();
    };

// var labelMaker = function(labelLayer) {

//     var labelStr;
//     var result_worker = subjKey[subj] + "_18Q1_" + result + "_WORKER";
//     console.log(result_worker);
//     if (labelLayer == 'state-level-result') {
//         labelStr = '<h3>State of ' + e.features[0].properties.NAME + '</h3><p>There are' + e.features[0].properties[result_worker] + '</p>'
//     };
//     return labelStr;

// };
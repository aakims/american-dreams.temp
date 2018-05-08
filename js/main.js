$('.legend-option').hide();

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
var infoChunk; 

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
            "interpolate", ["linear"],
            ["zoom"],
            zoomThreshold, 0,
            zoomThreshold + 1, 9
        ],
        "circle-color": "#DA981E",
        "circle-stroke-width": 3,
        "circle-stroke-color": "#DA981E",
        "circle-opacity": 0.7
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
            "interpolate", ["linear"],
            ["zoom"],
            zoomThreshold, 4,
            zoomThreshold + 1, 10
        ],
        "circle-color": "#7DAA8B",
        "circle-stroke-width": 3,
        "circle-stroke-color": "#7DAA8B",
        "circle-opacity": 0.7
    }
};

map.addControl(new mapboxgl.NavigationControl());

function showStatePaintRules() {

    var selKey = subjKey[subj] + "_18Q1_" + result + "_" + featureKey;
    console.log(selKey);

    var findRule = function(colscheme) {
        output = {
            'fill-color': colscheme,
            'fill-opacity': 0.75
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
        quantBreaksState = [30000, 45000, 65000, 85000, 100000];
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

    var salColSch = [
        'interpolate', ['linear'],
        ['get', selKey],
        quantBreaksState[0], '#ffffcc',
        quantBreaksState[1], '#c2e699',
        quantBreaksState[2], '#78c679',
        quantBreaksState[3], '#31a354',
        quantBreaksState[4], '#006837'
    ];

    if (featureKey == 'AVGSAL') {
        theStateRule = findRule(salColSch);
    } else if (result == "CERT") {
        theStateRule = findRule(certColSch);
    } else if (result == "DEN") {
        theStateRule = findRule(denColSch);
    } else {
        theStateRule = findRule(wdColSch);
    }

    return theStateRule;
};

function showPaintRules() {

    var selKey = subjKey[subj] + "_18Q1_" + result + "_" + featureKey;
    console.log(selKey);

    var findRule = function(colscheme) {
        output = {
            'fill-color': colscheme,
            'fill-opacity': 0.75
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


        quantBreaks = [30000, 45000, 65000, 85000, 100000];

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

    var salColSch = [
        'interpolate', ['linear'],
        ['get', selKey],
        quantBreaks[0], '#ffffcc',
        quantBreaks[1], '#c2e699',
        quantBreaks[2], '#78c679',
        quantBreaks[3], '#31a354',
        quantBreaks[4], '#006837'
    ];

    if (featureKey == 'AVGSAL') {
        theRule = findRule(salColSch);
    } else if (result == "CERT") {
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

    toggleLegend();


    $('#denied').click(function() {
        result = 'DEN';
        resultChange();
        toggleLegend();
        layerTheWorks();
        map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            $(stateLegend).hide();
            $(countyLegend).show();
        } else {
            $(countyLegend).hide();
            $(stateLegend).show();
        }
    });
    });

    $('#certified').click(function() {
        result = 'CERT';
        resultChange();
        layerTheWorks();
        map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            $(stateLegend).hide();
            $(countyLegend).show();
        } else {
            $(countyLegend).hide();
            $(stateLegend).show();
        }
    });
    });

    $('#withdrawn').click(function() {
        result = 'WD';
        resultChange();
        layerTheWorks();
        //printThis();
        //console.log('withdrawn');
        map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            $(stateLegend).hide();
            $(countyLegend).show();
        } else {
            $(countyLegend).hide();
            $(stateLegend).show();
        }
    });
    });

    $('#worksite').click(function() {
        subj = 'worksite';
        resultChange();
        //subjectChange();
        getData("worksite");
        initizeWithState();
        map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            $(stateLegend).hide();
            $(countyLegend).show();
        } else {
            $(countyLegend).hide();
            $(stateLegend).show();
        }
    });
    });

    $('#employer').click(function() {
        subj = 'employer';
        //resultChange(); 
        getData("employer");
        initizeWithState();
        map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            $(stateLegend).hide();
            $(countyLegend).show();
        } else {
            $(countyLegend).hide();
            $(stateLegend).show();
        }
    });
    });

    $('#worker').click(function() {
        featureKey = 'WORKER';
        layerTheWorks();
        map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            $(stateLegend).hide();
            $(countyLegend).show();
        } else {
            $(countyLegend).hide();
            $(stateLegend).show();
        }
    });
    });

    $('#avgsal').click(function() {
        featureKey = 'AVGSAL';
        layerTheWorks();
        map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            $(stateLegend).hide();
            $(countyLegend).show();
        } else {
            $(countyLegend).hide();
            $(stateLegend).show();
        }
    });
    });

    map.addLayer(nationalMajorCities);

    map.addLayer(stateMajorCities);

    map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            $(stateLegend).hide();
            $(countyLegend).show();
        } else {
            $(countyLegend).hide();
            $(stateLegend).show();
        }
    });


    map.on('click', 'state-level-result', function(e) {

        //var labelStr; 
        var result_worker = subjKey[subj] + "_18Q1_" + result + "_WORKER";
        var result_salary = subjKey[subj] + "_18Q1_" + result + "_AVGSAL";
        var majCity = subjKey[subj] + "_18Q1_" + result + "_TOPCITY";
        var popJob = subjKey[subj] + "_18Q1_" + result + "_TOPJOB";
        console.log(result_worker);

        // console.log(labelStr);

        // console.log(e.features[0]);


        var infoChunk = "<h2>State of " + 
        e.features[0].properties['NAME'] + 
        "</h2><h4>H1B Petitions in 2018Q1</h4><ul><li> total workers " + 
         resultKey[result] + 
         " in 2018 Q1: <span class = 'info-head'>  "+ 
         e.features[0].properties[result_worker] + 
         "</span></li><li> average salary: " + 
         resultKey[result] + " in 2018 Q1: <span class = 'info-head'>  "+ 
         e.features[0].properties[result_salary] + 
         "</span></li><li> top " + subj + 
         " city: <br><span class = 'info-head'>  "+ 
         e.features[0].properties[majCity] + 
         "</span></li><li>most popular job: <br><span class = 'info-head'>  " + 
         e.features[0].properties[popJob] + 
         "</span></li>";

        console.log(infoChunk);

        $('#infobox').empty();
        $('#infobox').append(infoChunk); 

    });

    map.on('click', 'county-level-result', function(e) {

        var result_worker = subjKey[subj] + "_18Q1_" + result + "_WORKER";
        var result_salary = subjKey[subj] + "_18Q1_" + result + "_AVGSAL";
        var majCity = subjKey[subj] + "_18Q1_" + result + "_TOPCITY";
        var popJob = subjKey[subj] + "_18Q1_" + result + "_TOPJOB";
        console.log(result_worker);

        // console.log(labelStr);

        // console.log(e.features[0]);

        console.log(e.features[0]);
        var stateAbbr = e.features[0].properties[majCity].split("-")[1];
        // var takeoutState = cityState.split("-"); 
        // console.log(takeoutState); 

        // console.log(cityState); 

        var infoChunk = "<h2>" + 
        e.features[0].properties['NAME'] + 
        " County, " + stateAbbr +"</h2><h4>H1B Petitions in 2018Q1</h4><ul><li> total workers " + 
         resultKey[result] + 
         " in 2018 Q1: <span class = 'info-head'>  "+ 
         e.features[0].properties[result_worker] + 
         "</span></li><li> average salary: " + 
         resultKey[result] + " in 2018 Q1: <span class = 'info-head'>  "+ 
         e.features[0].properties[result_salary] + 
         "</span></li><li> top " + subj + 
         " city: <br><span class = 'info-head'>  "+ 
         e.features[0].properties[majCity] + 
         "</span></li><li>most popular job: <br><span class = 'info-head'>  " + 
         e.features[0].properties[popJob] + 
         "</span></li>";

        console.log(infoChunk);

        $('#infobox').empty();
        $('#infobox').append(infoChunk); 
    });

    map.on('click', 'national-major-cities', function(e) {

        map.getCanvas().style.cursor = 'pointer';
        console.log(e.features[0]);
        var typeArray = e.features[0].properties['TYPE'].split(", ");
        var cityArray = _.uniq(typeArray);
        console.log(cityArray);

        var cityTemplate = function(array) {

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

        var cityTemplate = function(array) {

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

var updateNationalCities = function() {
    return map.addLayer(nationalMajorCities);
};

var updateStateCities = function() {
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
    toggleLegend();
    // $(stateLegend).show();
    // $(countyLegend).show();
    updateLegend();
};

var stateLegend, countyLegend;
var toggleLegend = function() {

    $('.legend-option').hide();

    if (featureKey == "WORKER") {

        if (subj == "employer" && result == "CERT") {
            stateLegend = '#state-cert-e';
            countyLegend = '#county-cert-e';
        } else if (subj == "employer" && result == "DEN") {
            stateLegend = '#state-den-e';
            countyLegend = '#county-den-e';
        } else if (subj == "employer" && result == "WD") {
            stateLegend = '#state-wd-e';
            countyLegend = '#county-wd-e';
        } else if (subj == "worksite" && result == "CERT") {
            stateLegend = '#state-cert-w';
            countyLegend = '#county-cert-w';
        } else if (subj == "worksite" && result == "DEN") {
            stateLegend = '#state-den-w';
            countyLegend = '#county-den-w';
        } else if (subj =="worksite" && result == "WD") {
            stateLegend = '#state-wd-w';
            countyLegend = '#county-wd-w';
        }

    } else { // (featureKey == "AVGSAL")
        stateLegend = '#avg-sal';
        countyLegend = '#avg-sal';
    }

    var currentZoom = map.getZoom();
    if (map.getZoom() > zoomThreshold) {
        $(countyLegend).show();
    } else {
        $(stateLegend).show();
    };

};

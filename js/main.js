// load the default map 
var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyle,
    center: [-105.43, 39.585],
    zoom: 3.9
});
map.addControl(new mapboxgl.NavigationControl());

var stateMajorCities = {
    "id": "state-major-cities",
    "type": "circle",
    "source": "cities",
    "minzoom": zoomThreshold,
    "filter": ["any", ["==", "top_state_emp", "True"],
        ["==", "top_state_work", "True"]
    ],
    "paint": {
        "circle-radius": [
            "interpolate", ["linear"],
            ["zoom"],
            zoomThreshold, 0,
            zoomThreshold + 1, 7
        ],
        "circle-color": "#DA981E",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#DA981E",
        "circle-stroke-opacity": 0.5,
        "circle-opacity": 0.75
    }
};

var nationalMajorCities = {
    "id": "national-major-cities",
    "type": "circle",
    "source": "cities",
    "filter": ["any", ["==", "top_nat_emp", "True"],
        ["==", "top_nat_work", "True"]
    ],
    "paint": {
        "circle-radius": [
            "interpolate", ["linear"],
            ["zoom"],
            zoomThreshold, 4,
            zoomThreshold + 1, 8
        ],
        "circle-color": "#1895A3",
        "circle-stroke-width": 3,
        "circle-stroke-color": "#1895A3",
        "circle-stroke-opacity": 0.5,
        "circle-opacity": 0.75
    }
};

var geoSwitchOnZoom = function() {
    return
    if (map.getZoom() > zoomThreshold) {
        $(stateLegend).hide();
        $(countyLegend).show();
    } else {
        $(countyLegend).hide();
        $(stateLegend).show();
    }
};

map.on('load', function() {

    var cityPopup;
    showCountyPaintRules();
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

    // ** CLICK ** behaviors 

    map.on('click', 'state-level-result', function(e) {

        //var labelStr; 
        var result_worker = subj + "_" + quarter + "_" + result + "_WORKER";
        var result_salary = subj + "_" + quarter + "_" + result + "_AVGSAL";
        var majCity = subj + "_" + quarter + "_" + result + "_TOPCITY";
        var popJob = subj + "_" + quarter + "_" + result + "_TOPJOB";
        //console.log(result_worker);

        // console.log(labelStr);
        // console.log(e.features[0]);

        var infoChunk = "<h2>State of " +
            e.features[0].properties['NAME'] +
            "</h2><h4>H1B Petitions " +
            resultKey[result] +
            " in 20" + quarter + "</h4><ul class = 'info'><li> total workers: <span class = 'info-head'>  " +
            e.features[0].properties[result_worker] +
            "</span></li><li> average salary:  <span class = 'info-head'> $  " +
            e.features[0].properties[result_salary] +
            "</span></li><li> top " + subjKey[subj] +
            " city: <br><span class = 'info-head'>  " +
            e.features[0].properties[majCity].replace("-", ", ") +
            "</span></li><li>most popular job: <br><span class = 'info-head'>  " +
            e.features[0].properties[popJob] +
            "</span></li>";

        //console.log(infoChunk);

        $('#infobox').empty();
        $('#infobox').append(infoChunk);

    });

    map.on('click', 'county-level-result', function(e) {

        var result_worker = subj + "_" + quarter + "_" + result + "_WORKER";
        var result_salary = subj + "_" + quarter + "_" + result + "_AVGSAL";
        var majCity = subj + "_" + quarter + "_" + result + "_TOPCITY";
        var popJob = subj + "_" + quarter + "_" + result + "_TOPJOB";
        console.log(result_worker);

        // console.log(labelStr);
        // console.log(e.features[0]);

        console.log(e.features[0]);
        var stateAbbr = e.features[0].properties[majCity].split("-")[1];

        // console.log(takeoutState); 
        // console.log(cityState); 

        var infoChunk = "<h2>" +
            e.features[0].properties['NAME'] +
            " County, " + stateAbbr + "</h2><h4>H1B Petitions " + resultKey[result] + " in 20" + quarter + "</h4><ul class = 'info'><li> total workers: <span class = 'info-head'>  " +
            e.features[0].properties[result_worker] +
            "</span></li><li> average salary:  <span class = 'info-head'> $  " +
            e.features[0].properties[result_salary] +
            "</span></li><li> top " + subjKey[subj] +
            " city: <br><span class = 'info-head'>  " +
            e.features[0].properties[majCity].replace("-", ", ") +
            "</span></li><li>most popular job: <br><span class = 'info-head'>  " +
            e.features[0].properties[popJob] +
            "</span></li>";

        console.log(infoChunk);

        $('#infobox').empty();
        $('#infobox').append(infoChunk);
    });

    // ** HOVER ** behaviors 

    var cityPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'national-major-cities', function(e) {

        map.getCanvas().style.cursor = 'pointer';
        console.log(e.features[0]);
        var typeArray = e.features[0].properties['type'].split(", ");
        var cityArray = _.uniq(typeArray);
        console.log(cityArray);

        var cityTemplate = _.map(cityArray, function(cityKind) {
            console.log(cityKind);
            return "<li class = 'pop'>" + cityKind + "</li>";
        }).join('');
        console.log(cityTemplate);

        var description = "<h5>" + e.features[0].properties["location"] + "<ul>" + cityTemplate + "</ul>";
        cityPopup.setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);

    });

    map.on('mouseenter', 'state-major-cities', function(e) {

        map.getCanvas().style.cursor = 'pointer';

        console.log(e.features[0]);
        var typeArray = e.features[0].properties['type'].split(", ");
        var cityArray = _.uniq(typeArray);
        console.log(cityArray);

        var cityTemplate = _.map(cityArray, function(cityKind) {
            console.log(cityKind);
            return "<li class = 'pop'>" + cityKind + "</li>";
        }).join('');
        console.log(cityTemplate);

        var description = "<h5>" + e.features[0].properties["location"] + "<ul>" + cityTemplate + "<ul>";

        cityPopup.setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);

    });

    map.on('mouseleave', 'national-major-cities', function() {
        cityPopup.remove();
    });

    map.on('mouseleave', 'state-major-cities', function() {
        cityPopup.remove();
    });

    // ** FILTER/SUBSET ** behaviors 

    $('#denied').click(function() {
        $('#infobox').empty();
        result = 'DEN';
        resultChange();
        toggleLegend();
        layerTheWorks();
    });

    $('#certified').click(function() {
        $('#infobox').empty();
        result = 'CERT';
        resultChange();
        layerTheWorks();
    });

    $('#withdrawn').click(function() {
        $('#infobox').empty();
        result = 'WD';
        resultChange();
        layerTheWorks();
    });

    $('#worksite').click(function() {
        $('#infobox').empty();
        subj = 'work';
        resultChange();
        getData(subjKey[subj]);
        initizeWithState();
    });

    $('#employer').click(function() {
        $('#infobox').empty();
        subj = 'emp';
        getData(subjKey[subj]);
        initizeWithState();
    });

    $('#worker').click(function() {
        $('#infobox').empty();
        feature = 'WORKER';
        layerTheWorks();
    });

    $('#avgsal').click(function() {
        $('#infobox').empty();
        feature = 'AVGSAL';
        layerTheWorks();
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
        "paint": theCountyRule
    });
};

var updateNationalCities = function() {
    return map.addLayer(nationalMajorCities);
};

var updateStateCities = function() {
    return map.addLayer(stateMajorCities)
};

var toggleLegend = function() {

    $('.legend-option').hide();

    if (feature == "WORKER") {

        if (subj == "emp" && result == "CERT") {
            stateLegend = '#state-cert-e';
            countyLegend = '#county-cert-e';
        } else if (subj == "emp" && result == "DEN") {
            stateLegend = '#state-den-e';
            countyLegend = '#county-den-e';
        } else if (subj == "emp" && result == "WD") {
            stateLegend = '#state-wd-e';
            countyLegend = '#county-wd-e';
        } else if (subj == "work" && result == "CERT") {
            stateLegend = '#state-cert-w';
            countyLegend = '#county-cert-w';
        } else if (subj == "work" && result == "DEN") {
            stateLegend = '#state-den-w';
            countyLegend = '#county-den-w';
        } else if (subj == "work" && result == "WD") {
            stateLegend = '#state-wd-w';
            countyLegend = '#county-wd-w';
        }

    } else { // (feature == "AVGSAL")
        stateLegend = '#avg-sal';
        countyLegend = '#avg-sal';
    }

    if (map.getZoom() > zoomThreshold) {
        $(countyLegend).show();
    } else {
        $(stateLegend).show();
    };

};

var layerTheWorks = function() {
    map.removeLayer("state-level-result");
    map.removeSource("state-level");
    map.removeLayer("county-level-result");
    map.removeSource("county-level");
    map.removeLayer("national-major-cities");
    map.removeLayer("state-major-cities");
    showCountyPaintRules();
    showStatePaintRules();
    updateStateSource();
    updateStateLayer();
    updateCountySource();
    updateCountyLayer();
    updateNationalCities();
    updateStateCities();
    toggleLegend();

};
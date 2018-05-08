mapboxgl.accessToken = 'pk.eyJ1IjoiYWFraW1zIiwiYSI6ImNqZmQ1bm4yaDF4NnQzdW8xem54dmNzYXQifQ.VfaDRyNApyLYnCVL7PcpzA';

var mapStyle = 'mapbox://styles/aakims/cjfgej20o1t452smsp0rysgsi';
var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyle,
    center: [-96, 37.8],
    zoom: 3
});

var zoomThreshold = 5; 

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

    map.addLayer({
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
        map.removeLayer("county-level-result");
        map.removeSource("county-level");
        updateStateSource();
        updateStateLayer(); 
        updateCountySource();
        updateCountyLayer(); 
    }); 

    $('#certified').click(function() {
        result = 'CERT';
        resultChange(); 
        map.removeLayer("state-level-result");
        map.removeSource("state-level");
        map.removeLayer("county-level-result");
        map.removeSource("county-level");
        updateStateSource();
        updateStateLayer(); 
        updateCountySource();
        updateCountyLayer(); 
    });

    $('#withdrawn').click(function() {
        result = 'WD';
        resultChange(); 
        map.removeLayer("state-level-result");
        map.removeSource("state-level");
        map.removeLayer("county-level-result");
        map.removeSource("county-level");
        updateStateSource();
        updateStateLayer();
        updateCountySource();
        updateCountyLayer();  
        //printThis();
        //console.log('withdrawn');
    });

    $('#worksite').click(function() {
        subj = 'worksite';
        //subjectChange();
        getData("worksite");
        initizeWithState(); 
        map.removeLayer("state-level-result");
        map.removeSource("state-level");
        map.removeLayer("county-level-result");
        map.removeSource("county-level");
        updateStateSource();
        updateStateLayer(); 
        updateCountySource();
        updateCountyLayer(); 
        //printThis();
        //console.log('withdrawn');
    });

    $('#employer').click(function() {
        subj = 'employer';
        getData("employer");
        initizeWithState(); 
        //subjectChange(); 
        initizeWithState(); 
        map.removeLayer("state-level-result");
        map.removeSource("state-level");
        map.removeLayer("county-level-result");
        map.removeSource("county-level");
        updateStateSource();
        updateStateLayer();
        updateCountySource();
        updateCountyLayer(); 
        //initizeWithState(); 
    });

    // var whichLev = function () {
    //     var zoomLev = map.getZoom(); 
    //     console.log(zoomLev); 
    //     if (zoomLev < 4) {
    //         return 'state-level-result';
    //     } else {return 'county-level-result';}
    // };

    // var labelLayer = whichLev(); 

    // console.log(labelLayer); 

    map.on('click', 'state-level-result', function (e) {

        //var labelStr; 
        var result_worker = subjKey[subj] + "_18Q1_" + result + "_WORKER";
        console.log(result_worker);

        var labelStr = '<h3>State of ' + e.features[0].properties.NAME + '</h3><p>There are ' + e.features[0].properties[result_worker] + ' H1B workers ' + resultKey[result] + '</p>'
        console.log(labelStr);

        console.log(e.features[0]);
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            //.setHTML(e.features[0].properties.NAME)
            .setHTML(labelStr)
            .addTo(map);

    });

    map.on('click', 'county-level-result', function (e) {

        //var labelStr; 
        var result_worker = subjKey[subj] + "_18Q1_" + result + "_WORKER";
        console.log(result_worker);
    var labelStr = '<h3>' + e.features[0].properties.NAME + ' County</h3><p>There are ' + e.features[0].properties[result_worker] + ' H1B workers ' + resultKey[result] + '</p>'

            new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            //.setHTML(e.features[0].properties.NAME)
            .setHTML(labelStr)
            .addTo(map);



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
            "paint": {
                'fill-color': 'rgba(155, 100, 240, 0.4)'
            }
        });

    };

var updateCountyLayer = function() {
       return map.addLayer({
            "id": "county-level-result",
            "type": "fill",
            "source": "county-level",
            "minzoom": zoomThreshold,
            "paint": {
                'fill-color': 'rgba(155, 155, 155, 0.4)'
            }
        });

    };

var labelMaker = function(labelLayer) {

    var labelStr; 
    var result_worker = subjKey[subj] + "_18Q1_" + result + "_WORKER";
    console.log(result_worker);
    if (labelLayer == 'state-level-result') {
        labelStr = '<h3>State of ' + e.features[0].properties.NAME + '</h3><p>There are' + e.features[0].properties[result_worker] + '</p>'
    };
    return labelStr; 

};

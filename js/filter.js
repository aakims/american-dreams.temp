// global variables
var thisCountyData, thisStateData;
var selectKeys; // array variable to store columns that match filtering conditions 
var stateCities, allCities;
//var fedData, datafirst;
var fedStateData, fedCountyData;
var giveStateData, giveCountyData;

// bring in cities geojson 
var allCities = _.chain(maincities.features).value();

// key word dicts >> column_prefix : display_language 
var resultKey = {
    'CERT': 'Certified',
    'DEN': 'Denied',
    'WD': 'Withdrawn'
};

var subjKey = {
    'emp': 'employer',
    'work': 'worksite'
};

// To be used for the next update: time slider 
/*
var quarterList = [
    '15Q1',
    '15Q2',
    '15Q3',
    '15Q4',
    '16Q1',
    '16Q2',
    '16Q3',
    '16Q4',
    '17Q1',
    '17Q2',
    '17Q3',
    '17Q4',
    '18Q1'
];

var quarterKey = {
    '15Q1': '2015 Q1',
    '15Q2': '2015 Q2',
    '15Q3': '2015 Q3',
    '15Q4': '2015 Q4',
    '16Q1': '2016 Q1', 
    '16Q2': '2016 Q2', 
    '16Q3': '2016 Q3', 
    '16Q4': '2016 Q4', 
    '17Q1': '2017 Q1', 
    '17Q2': '2017 Q2', 
    '17Q3': '2017 Q3', 
    '17Q4': '2017 Q4', 
    '18Q1': '2018 Q1'
};
*/

// define filtering variables: default values 
var featureKey = 'WORKER',
    quarter = '17Q2',
    result = 'CERT',
    subj = 'work';

var colList = ['APP', 'WORKER', 'AVGSAL', 'AVGPW', 'TOPNAIC5', 'TOPJOB', 'TOPCITY', 'PCTINSTATE'];


// data fetching procedure 

var getData = function(newSubj) { // "employer" vs "worksite" 

    urlCountyStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data//geojson/byCounty_" + newSubj + ".geojson";
    urlStateStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data/geojson/byState_" + newSubj + ".geojson";

};

var allFields = function(fedData) {
    // console.log (_.unique(_.flatten(_.map(fedData.features, function(feature) {
    //     return _.allKeys(feature.properties)
    // }))));
    return (_.unique(_.flatten(_.map(fedData.features, function(feature) {
        return _.allKeys(feature.properties)
    }))))
};

var defineData = function(fedData) { // subject: employer vs worksite

    dynamicKeys = _.chain(allFields(fedData))
        .filter(function(field) { return field.split("_")[2] === result }) // result 
        .value();

    selectKeys = _.union(dynamicKeys, ['NAME']);
    //console.log("selectKeys: ", selectKeys);

    // prefix format: emp_15Q2_CERT_WORKER
    var thisData = _.chain(fedData.features)
        .map(function(feature) {
            feature.properties = _.pick(feature.properties, selectKeys);
            //console.log(feature.properties);
            //console.log(feature);
            return feature;
        })
        .value();
    console.log(thisData[1]);
    return thisData;
};


var timeForStateData = function() {
    $.ajax(urlStateStr).then(function(res) {
        //console.log(res); 
        //thisData = res;
        return res;
    }).then(function(data) {
        //console.log(data);
        fedStateData = JSON.parse(data);
        giveStateData = JSON.parse(JSON.stringify(fedStateData));
        //console.log(fedStateData.features[1]);
        thisStateData = defineData(giveStateData);
    }).then(function() {
        console.log('new fetch! from: ', subj, "   ", result, urlStateStr);
    });
};

var timeForCountyData = function() {
    $.ajax(urlCountyStr).then(function(res) {
        //console.log(res); 
        //thisData = res;
        return res;
    }).then(function(data) {
        //console.log(data);
        fedCountyData = JSON.parse(data);
        giveCountyData = JSON.parse(JSON.stringify(fedCountyData));
        //console.log(fedCountyData.features[1]);
        thisCountyData = defineData(giveCountyData);
    }).then(function() {
        layerTheWorks();
        console.log('county is done!')
    });
};

var initizeWithState = function() { //data initialization 
    timeForStateData();
    timeForCountyData();
}

var resultChange = function() { //when only result changed (no need to re download data)
    giveStateData = JSON.parse(JSON.stringify(fedStateData));
    thisStateData = defineData(giveStateData);
    giveCountyData = JSON.parse(JSON.stringify(fedCountyData));
    thisCountyData = defineData(giveCountyData);
};

getData(subjKey[subj]);
initizeWithState();
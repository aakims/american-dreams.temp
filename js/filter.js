// bring in cities geojson 
var allCities = _.chain(maincities.features).value();

var resultKey = {
    'CERT': 'whose H1B got certified',
    'DEN': 'whose H1B got denied',
    'WD': 'who withdrew their peitition'
};

var subjKey = {
    'employer': 'emp',
    'worksite': 'work'
};

// To be used for the next update: time slider 
/*
var quarterList = [
    '2015 Q1',
    '2015 Q2',
    '2015 Q3',
    '2015 Q4',
    '2016 Q1',
    '2016 Q2',
    '2016 Q3',
    '2016 Q4',
    '2017 Q1',
    '2017 Q2',
    '2017 Q3',
    '2017 Q4',
    '2018 Q1'
];

var quarterKey = {
    '2015 Q1': '15Q1',
    '2015 Q2': '15Q2',
    '2015 Q3': '15Q3',
    '2015 Q4': '15Q4',
    '2016 Q1': '16Q1',
    '2016 Q2': '16Q2',
    '2016 Q3': '16Q3',
    '2016 Q4': '16Q4',
    '2017 Q1': '17Q1',
    '2017 Q2': '17Q2',
    '2017 Q3': '17Q3',
    '2017 Q4': '17Q4',
    '2018 Q1': '18Q1'
};
*/

var thisData;

// filtering variables
var featureKey = 'WORKER',
quarter, 
result = 'CERT',
subj = 'worksite';

var colList = ['APP', 'WORKER', 'AVGSAL', 'AVGPW', 'TOPNAIC5', 'TOPJOB', 'TOPCITY', 'PCTINSTATE'];

// array variable to store columns that match filtering conditions 
var selectKeys;


var initizeWithState = function() { //when first page load 
    //console.log(result, subj);
    //getData(subject);
    timeForCountyData();
    //console.log("County Followed");
    //console.log(thisCountyData[0]);
    timeForStateData();
    //displayMap();
    //console.log("Map with State");
    //console.log(thisStateData[0]);
}

var resultChange = function() { //when only result changed (no need to re download data)
    giveStateData = JSON.parse(JSON.stringify(fedStateData));
    thisStateData = defineData(giveStateData);
    giveCountyData = JSON.parse(JSON.stringify(fedCountyData));
    thisCountyData = defineData(giveCountyData);
};

var getData = function(newSubj) { // "employer" vs "worksite" 

    urlCountyStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data//geojson/byCounty_" + newSubj + ".geojson";
    urlStateStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data/geojson/byState_" + newSubj + ".geojson";

};

getData(subj);

var allFields = function(fedData) {
    // console.log (_.unique(_.flatten(_.map(fedData.features, function(feature) {
    //     return _.allKeys(feature.properties)
    // }))));
    return (_.unique(_.flatten(_.map(fedData.features, function(feature) {
        return _.allKeys(feature.properties)
    }))))
};

var defineData = function(fedData) { // subject: employer vs worksite

    var sprefx = subjKey[subj];
    //qprefx = quarterKey[quarter],
    //rprefx = resultKey[result];
    //uprefx = sprefx + qprefx + rprefx;
    //console.log("uprefx:", uprefx);
    console.log(result);

    dynamicKeys = _.chain(allFields(fedData))
        .filter(function(field) { return field.split("_")[2] === result }) // result 
        .value();

    selectKeys = _.union(dynamicKeys, ['NAME']);

    //console.log("selectKeys: ", selectKeys);

    // prefix format: emp_15Q2_CERT_WORKER

    thisData = _.chain(fedData.features)
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
var fedData, datafirst;
var fedStateData, fedCountyData;
var giveStateData, giveCountyData;
var thisStateData, thisCountyData;

//getData(subject);


var timeForStateData = function() {
    $.ajax(urlStateStr).done(function(res) {
        //console.log(res); 
        //thisData = res;
        return res;
    }).done(function(data) {
        //console.log(data);
        datafirst = data;
        fedStateData = JSON.parse(data);
        giveStateData = JSON.parse(JSON.stringify(fedStateData));
        //console.log(fedStateData.features[1]);
        thisStateData = defineData(giveStateData);
    });
    console.log('new fetch! from: ', subj, "   ", result, urlStateStr);

};

var timeForCountyData = function() {
    $.ajax(urlCountyStr).done(function(res) {
        //console.log(res); 
        //thisData = res;
        return res;
    }).done(function(data) {
        //console.log(data);
        datafirst = data;
        fedCountyData = JSON.parse(data);
        giveCountyData = JSON.parse(JSON.stringify(fedCountyData));
        //console.log(fedCountyData.features[1]);
        thisCountyData = defineData(giveCountyData);
    }).done(function() {

        layerTheWorks();
    });

    console.log('county is done!')
};

initizeWithState();

var stateCities, allCities;
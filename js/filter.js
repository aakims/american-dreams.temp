var resultKey = {
    'CERTIFIED': 'CERT',
    'DENIED': 'DEN',
    'WITHDRAWN': 'WD'
};

var subjectKey = {
    'By Employer': 'employer',
    'By Worksite': 'worksite'
};

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

var thisData;
var colList = ['APP', 'WORKER', 'AVGSAL', 'AVGPW', 'TOPNAIC5', 'TOPJOB', 'TOPCITY', 'PCTINSTATE'];
var selectKeys;
var quarter, result, subject;

var wantedRes = $('#result option:selected').text();
var wantedSubj = $('#subject option:selected').text();
result = resultKey[wantedRes];
subject = subjectKey[wantedSubj];
quarter = '2016 Q1';

var getData = function(subject) { // "employer" vs "worksite" 

    urlCntyStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data//geojson/byCounty_" + subject + ".geojson",
    urlStateStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data/geojson/byState_" + subject + ".geojson";

};

getData(subject); 

var actualDownload = 
    $.ajax(urlStateStr).then(function(res) {
        //console.log(res); 
        //thisData = res;
        return res;
    });

var allFields = function(fedData) {
    // console.log (_.unique(_.flatten(_.map(fedData.features, function(feature) {
    //     return _.allKeys(feature.properties)
    // }))));
    return (_.unique(_.flatten(_.map(fedData.features, function(feature) {
        return _.allKeys(feature.properties)
    })))
)};

var defineData = function(fedData) { // subject: employer vs worksite

    var sprefx = subjectKey[subject],
        //qprefx = quarterKey[quarter],
        rprefx = resultKey[result];
        //uprefx = sprefx + qprefx + rprefx;
    //console.log("uprefx:", uprefx);
    console.log(rprefx);

    selectKeys = _.chain(allFields(fedData))
        .filter(function(field) { return field.split("_")[2] === rprefx }) // result 
        .value();

    console.log("selectKeys: ", selectKeys);

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
var fedData;
           actualDownload.done(function(data) {
                fedData = JSON.parse(data)
                defineData(fedData); 
            })
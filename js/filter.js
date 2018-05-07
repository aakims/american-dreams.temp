var resultKey = {
    'CERTIFIED': 'CERT',
    'DENIED': 'DEN',
    'WITHDRAWN': 'WD'
};

var subjectKey = {
    'EMPLOYER': 'employer',
    'WORKSITE': 'worksite'
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
var quarter, result = 'CERT',
    subject = 'worksite';
var wantedRes, wantedSubj;

var wantCertified = $('#certified').click(function() {
        result = 'CERT';
        printThis();
        //console.log('certified');
    }),
    wantDenied = $('#denied').click(function() {
        result = 'DEN';
        printThis();
        //console.log('denied');
    }),
    wantWithdrawn = $('#withdrawn').click(function() {
        result = 'WD';
        printThis();
        //console.log('withdrawn');
    });

var wantWorksite = $('#worksite').click(function() {
        subject = 'worksite';
        printThis();
        //console.log('worksite');
    }),
    wantEmployer = $('#employer').click(function() {
        subject = 'employer';
        printThis();
        //console.log('employer');
    });


var printThis = function() {
    console.log(result);
    console.log(subject);
    getData(subject);
    timeForData(); 

    console.log(thisCountyData[10]);
    console.log(thisStateData[10]);
};

//result = resultKey[wantedRes];
//subject = subjectKey[wantedSubj];
quarter = '2016 Q1';

var getData = function(newSubject) { // "employer" vs "worksite" 

    urlCountyStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data//geojson/byCounty_" + newSubject + ".geojson";
    urlStateStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data/geojson/byState_" + newSubject + ".geojson";

};

getData(subject);

var actualStateDownload =
    $.ajax(urlStateStr).done(function(res) {
        //console.log(res); 
        //thisData = res;
        return res;
    });

var actualCountyDownload =
    $.ajax(urlCountyStr).done(function(res) {
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
    }))))
};

var defineData = function(fedData) { // subject: employer vs worksite

    var sprefx = subjectKey[subject];
    //qprefx = quarterKey[quarter],
    //rprefx = resultKey[result];
    //uprefx = sprefx + qprefx + rprefx;
    //console.log("uprefx:", uprefx);
    console.log(result);

    dynamicKeys = _.chain(allFields(fedData))
        .filter(function(field) { return field.split("_")[2] === result }) // result 
        .value();

    selectKeys = _.union(dynamicKeys, ['NAME']);

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
var fedData, datafirst;

var timeForData = function() {
    actualStateDownload.done(function(data) {
        console.log(data);
        datafirst = data;
        fedData = JSON.parse(data);
        console.log(fedData.features[1]);
        thisStateData = defineData(fedData);
    });

    actualCountyDownload.done(function(data) {
        console.log(data);
        datafirst = data;
        fedData = JSON.parse(data);
        console.log(fedData.features[1]);
        thisCountyData = defineData(fedData);
    });
    console.log('new fetch!');

};
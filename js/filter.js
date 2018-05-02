var resultKey = {
    'certified' : 'CERT_',
    'denied' : 'DEN_',
    'withdrawn' : 'WD_'
};

var subjectKey = {
    'employer' : 'emp_',
    'worksite' : 'work_'
};

var quarter = [
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
'2015 Q1' : '15Q1_',
'2015 Q2' : '15Q2_',
'2015 Q3' : '15Q3_',
'2015 Q4' : '15Q4_',
'2016 Q1' : '16Q1_',
'2016 Q2' : '16Q2_',
'2016 Q3' : '16Q3_',
'2016 Q4' : '16Q4_',
'2017 Q1' : '17Q1_',
'2017 Q2' : '17Q2_',
'2017 Q3' : '17Q3_',
'2017 Q4' : '17Q4_',
'2018 Q1' : '18Q1_'
};

var thisData; 
var colList = ['APP', 'WORKER', 'AVGSAL', 'AVGPW', 'TOPNAIC5', 'TOPJOB', 'TOPCITY', 'PCTINSTATE'];

var actualDownload = function(urlStr) {
        $.ajax(urlStr).then(function(res) {
            //console.log(res); 
            thisData = res;
            return res;
        });

var defineData = function(subject, quarter, result) { // subject: employer vs worksite

    var sprefx = subjectKey[subject],
    qprefx = quarterKey[quarter],
    rprefx = resultKey[result],
    uprefx = sprefx + qprefix + rprefix; 

    // prefix format: emp_15Q2_CERT_WORKER

    thisData = _.chain(fedSet.features)
        .filter(function(feature) {
            //console.log(fedSet.features[0])
            return ((feature.properties["trip"] === tripIndex) && (feature.properties["olive"] > 5))
        })
        .map(function(feature) {
            feature.properties = _.pick(feature.properties, selectFields);
            //console.log(feature.properties);
            //console.log(feature);
            return feature;
        })
        .map(function(feature) {
            feature.properties["gtime"] = new Date(feature.properties["unixt"] * 1000 + 18000000);
            return feature;
        })
        .value();

    thisDataF = thisData[0],
    thisDataL = thisData[thisData.length - 1];
    console.log(thisData[1]);
    return thisData;

};

var getData = function (subject) {  // "employer" vs "worksite" 

    urlCntyStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data/newDat/geojson/byCounty_" + subject + ".geojson",
    urlStateStr = "https://raw.githubusercontent.com/aakims/american-dreams.temp/master/data/newDat/geojson/byState_" + subject + ".geojson";

    actualDownload(urlCntyStr).done(filterData); 



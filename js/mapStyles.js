mapboxgl.accessToken = 'pk.eyJ1IjoiYWFraW1zIiwiYSI6ImNqZmQ1bm4yaDF4NnQzdW8xem54dmNzYXQifQ.VfaDRyNApyLYnCVL7PcpzA';

var mapStyle = 'mapbox://styles/aakims/cjgx8l7h500012sph7oarvuza';
//'mapbox://styles/aakims/cjfgej20o1t452smsp0rysgsi';

var theStateRule, theCountyRule, // layer paint fules for the State lev vs. county lev
    stateLegend, countyLegend,
    selKey,
    certColSch, denColSch, wdColSch, salColSch, // color schemes for quantile breaks 
    quantBreaks = [],
    zoomThreshold = 4.1; // switch threshold between state and county display

function definePaintRules(quantBracket) {

    selKey = subj + "_" + quarter + "_" + result + "_" + feature;
    console.log(selKey);
    certColSch = [
            'interpolate', ['linear'],
            ['get', selKey],
            quantBracket[0], '#eff8fb',
            quantBracket[1], '#b8cde1',
            quantBracket[2], '#8d97c2',
            quantBracket[3], '#805aa2',
            quantBracket[4], '#762178'
        ],
        denColSch = [
            'interpolate', ['linear'],
            ['get', selKey],
            quantBracket[0], '#fcf0db',
            quantBracket[1], '#f6cd93',
            quantBracket[2], '#ee9264',
            quantBracket[3], '#d3553e',
            quantBracket[4], '#a52015'
        ],
        wdColSch = [
            'interpolate', ['linear'],
            ['get', selKey],
            quantBracket[0], '#f1eef6',
            quantBracket[1], '#d7b5d8',
            quantBracket[2], '#df65b0',
            quantBracket[3], '#dd1c77',
            quantBracket[4], '#980043'
        ],
        salColSch = [
            'interpolate', ['linear'],
            ['get', selKey],
            quantBracket[0], '#ffffcc',
            quantBracket[1], '#c2e699',
            quantBracket[2], '#78c679',
            quantBracket[3], '#31a354',
            quantBracket[4], '#006837'
        ];

};

var findPaintRule = function(colscheme) {
    output = {
        'fill-color': colscheme,
        'fill-opacity': 0.75
    };
    return output;
};


function showStatePaintRules() {

    var quantStateBreaks = (feature == "WORKER") ? (
        ((subj == "work") && (result == "CERT")) ? [2, 209, 741, 2314, 6537, 142255] : // max 65191 
        ((subj == "work") && (result == "DEN")) ? [1, 5, 12, 30, 89, 2276] :
        ((subj == "work") && (result == "WD")) ? [1, 9, 26, 72, 183, 3709] :
        ((subj == "emp") && (result == "CERT")) ? [2, 87, 246, 674, 4087, 151092] :
        ((subj == "emp") && (result == "DEN")) ? [1, 4, 9, 21, 68, 2629] : [1, 5, 12, 39, 135, 15149]) : [30000, 45000, 65000, 85000, 100000];

    console.log(quantStateBreaks);

    definePaintRules(quantStateBreaks);

    theStateRule = ((feature == 'AVGSAL') ? findPaintRule(salColSch) :
        (result == 'CERT') ? findPaintRule(certColSch) :
        (result == 'DEN') ? findPaintRule(denColSch) :
        findPaintRule(wdColSch));

    return theStateRule;
};

function showCountyPaintRules() {

    var quantCountyBreaks = (feature == "WORKER") ? (
            ((subj == "work") && (result == "CERT")) ? [0, 1, 3, 8, 47, 65191] :
            ((subj == "work") && (result == "DEN")) ? [0, 1, 2, 3, 8, 1137] :
            ((subj == "work") && (result == "WD")) ? [0, 1, 2, 4, 14, 1128] :
            ((subj == "emp") && (result == "CERT")) ? [0, 1, 2, 6, 27, 90320] :
            ((subj == "emp") && (result == "DEN")) ? [0, 1, 2, 3, 7, 2474] : [0, 1, 2, 3, 7, 2474]) // (subj == "emp" && result == "WD")
        :
        [30000, 45000, 65000, 85000, 100000]; // feature = "AVGSAL"

    console.log(quantCountyBreaks);

    definePaintRules(quantCountyBreaks);

    theCountyRule = ((feature == 'AVGSAL') ? findPaintRule(salColSch) :
        (result == 'CERT') ? findPaintRule(certColSch) :
        (result == 'DEN') ? findPaintRule(denColSch) :
        findPaintRule(wdColSch));
    return theCountyRule;
};
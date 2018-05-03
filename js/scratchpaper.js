D = _.map(nextData.features, function(feature) {
    	
    	feature.properties = _.pick(feature.properties, function() {

        selectKey = _.chain(nextData.feature.properties)
        .map(function(num, key) { return key })
        .filter(function(key) { return key.split("_")[1] === '15Q1' })
        .value();

        console.log(selectKey);

        return selectKey;

    });
    return feature
})
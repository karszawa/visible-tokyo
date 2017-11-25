function sum(arr, fn) {
    if (fn) {
        return sum(arr.map(fn));
    }

    return arr.reduce(function(prev, current, i, arr) {
        return prev + current;
    }, 0);
};

function average(arr, fn) {
    return sum(arr, fn) / arr.length;
};

function heatMapColorforValue(value) {
    const h = (1.0 - value) * 250;
    return `hsl(${h}, 100%, 50%)`;
}

function getPixelPositionOffset(width, height) {
    return {
        x: -(width / 2),
        y: -(height / 2)
    };
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

export { sum, average, heatMapColorforValue, getPixelPositionOffset, getDistanceFromLatLonInKm, deg2rad };

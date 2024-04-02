
mapboxgl.accessToken = 'pk.eyJ1IjoidmlzaGFsZGhhaW1vZGthciIsImEiOiJjbGZpZXVqbG80NjdnNDBvNDN5NnlwY2s1In0.zFkuq-cu2YfC4-aHqKkmaA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // style URL
    center: [-122, 37.5], // starting position [lng, lat]
    zoom: 15, // starting zoom
    maxZoom: 17
});




function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    //return `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},1)`
}



var hex = function (x) {
    x = x.toString(16);
    return (x.length == 1) ? '0' + x : x;
};

function getColorString(speed) {


    speed = speed / 15


    return hslToHex(2 * speed, 100, 50)
};




const el = document.createElement('div');
el.className = 'marker';
var marker = new mapboxgl.Marker(el);
var marker1 = new mapboxgl.Marker();
var marker2 = new mapboxgl.Marker();

map.on("load", () => {

    if (!ispc) XAPI.readTrips();


    map.on('click', function (e) {



        if (map.getZoom() < 13) return;


        var cUL = map.unproject([e.point.x - 50, e.point.y - 50]).toArray();
        var cLR = map.unproject([e.point.x + 50, e.point.y + 50]).toArray();


        var proxim = coords.filter(function (cord, idx) {

            if (cord[0] > cUL[0] && cord[0] < cLR[0] && cord[1] < cUL[1] && cord[1] > cLR[1]) {

                cord[2] = idx;

                return true;
            }
            else return false;
        });


        var targetPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
        var pts = [];


        proxim.forEach(pt => {
            pts.push(turf.point([pt[0], pt[1]]));
            //  var mkr = new mapboxgl.Marker();
            //  mkr.setLngLat(pt).addTo(map);
        });

        if (!pts.length) return;

        let points = turf.featureCollection(pts);

        let nearest = turf.nearestPoint(targetPoint, points);

        nearest_globalIdx = proxim[nearest.properties.featureIndex][2];

        marker.setLngLat([proxim[nearest.properties.featureIndex][0], proxim[nearest.properties.featureIndex][1]]).addTo(map);

        loadStats(undefined);

    });


});


function updatepath(datarr) {
    var darr = [
        'interpolate',
        ['linear'],
        ['line-progress']


    ];

    datarr.forEach(element => {
        darr.push(element);
    });



    map.setPaintProperty('line', 'line-gradient', darr);

}


var bounds;

function resetBounds() {
    if (bounds) map.fitBounds(bounds, { padding: 50 });
}

function addPath(latlongarray) {



    if (map.getLayer('line')) {

        map.removeLayer('line');
        map.removeSource('line');
    }

    bounds = [
        latlongarray[0], // southwestern corner of the bounds
        latlongarray[latlongarray.length - 1] // northeastern corner of the bounds
    ];


    map.fitBounds(bounds, { padding: 50 });



    const ls = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
            "coordinates": latlongarray,
            "type": "LineString"
        }
    }

    const geojson = {
        'type': 'FeatureCollection',
        'features': [
            ls
        ]
    };
    map.addSource('line', {
        type: 'geojson',
        lineMetrics: true,
        data: geojson
    });






    map.addLayer({
        type: 'line',
        source: 'line',
        id: 'line',
        paint: {
            'line-color': 'green',
            'line-width': 5,
            // 'line-gradient' must be specified using an expression
            // with the special 'line-progress' property

        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });

}
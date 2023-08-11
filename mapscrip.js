
mapboxgl.accessToken = 'pk.eyJ1IjoidmlzaGFsZGhhaW1vZGthciIsImEiOiJjbGZpZXVqbG80NjdnNDBvNDN5NnlwY2s1In0.zFkuq-cu2YfC4-aHqKkmaA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // style URL
    center: [74.0004989, 15.3978042], // starting position [lng, lat]
    zoom: 15, // starting zoom
    maxZoom: 17
});



//console.log(turf.length(ls), 'kms');

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


console.log(getColorString(50));


const el = document.createElement('div');
el.className = 'marker';
var marker = new mapboxgl.Marker(el);
var marker1 = new mapboxgl.Marker();
var marker2 = new mapboxgl.Marker();

var nrst;
map.on("load", () => {




    map.on('click', function (e) {





        if (map.getZoom() < 15) return;





        var cUL = map.unproject([e.point.x - 50, e.point.y - 50]).toArray();
        var cLR = map.unproject([e.point.x + 50, e.point.y + 50]).toArray();







        var proxim = coordinatesArray.filter(cord => {

            return cord[0] > cUL[0] && cord[0] < cLR[0] && cord[1] < cUL[1] && cord[1] > cLR[1];
        });

        console.log(e.lngLat);

        var targetPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
        var pts = [];


        proxim.forEach(pt => {
            pts.push(turf.point(pt));
            //  var mkr = new mapboxgl.Marker();
            //  mkr.setLngLat(pt).addTo(map);
        });

        var points = turf.featureCollection(pts);

        var nearest = turf.nearestPoint(targetPoint, points);


        marker.setLngLat(proxim[nearest.properties.featureIndex
        ]).addTo(map);

    });


});






var coordinatesArray, dataArray;

function addPath(latlongarray, datarr) {

    coordinatesArray = latlongarray;
    dataArray = datarr;

    if (map.getLayer('line')) {

        map.removeLayer('line');
        map.removeSource('line');
    }

    map.flyTo({
        center: latlongarray[0],
        zoom: 20,
        speed: 1.2,
        curve: 1
    });

    map.fitBounds([
        latlongarray[0], // southwestern corner of the bounds
        latlongarray[latlongarray.length - 1] // northeastern corner of the bounds
    ]);



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


    var darr = [
        'interpolate',
        ['linear'],
        ['line-progress']


    ];

    datarr.forEach(element => {
        darr.push(element);
    });



    map.addLayer({
        type: 'line',
        source: 'line',
        id: 'line',
        paint: {
            'line-color': 'red',
            'line-width': 5,
            // 'line-gradient' must be specified using an expression
            // with the special 'line-progress' property
            'line-gradient': darr
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });

}
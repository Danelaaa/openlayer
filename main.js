import 'ol/ol.css'; // OpenLayers CSS
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import { fromLonLat, get as getProjection } from 'ol/proj';

const centerLonLat = [42, 42]; 
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat(centerLonLat),
        zoom: 16
    })
});


function updateImage(imageUrl, imageWidth, imageHeight) {

    const resolution = map.getView().getResolution();

   
    const center = fromLonLat(centerLonLat);


    const halfWidth = (imageWidth * resolution) / 2;
    const halfHeight = (imageHeight * resolution) / 2;

    const extent = [
        center[0] - halfWidth, 
        center[1] - halfHeight,
        center[0] + halfWidth, 
        center[1] + halfHeight 
    ];

    console.log("Image Extent:", extent);


    const imageLayer = new ImageLayer({
        source: new ImageStatic({
            url: imageUrl,
            imageExtent: extent,
            projection: getProjection('EPSG:3857')
        })
    });


    map.getLayers().getArray().forEach(layer => {
        if (layer instanceof ImageLayer) {
            map.removeLayer(layer);
        }
    });

  
    map.addLayer(imageLayer);


    map.getView().fit(extent, { size: map.getSize() });
}


document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;

        
            const img = new Image();
            img.onload = function () {
                const imageWidth = img.width;  
                const imageHeight = img.height; 

                updateImage(imageUrl, imageWidth, imageHeight);
            };
            img.src = imageUrl;
        };
        reader.readAsDataURL(file);
    }
});

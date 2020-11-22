<template>
    <div id="map" class="map"></div>
</template>

<script>
import 'ol/ol.css';
import Map                       from "ol/Map";
import TileLayer                 from "ol/layer/Tile";
import {OSM, Cluster}            from "ol/source";
import View                      from "ol/View";
import VectorLayer               from "ol/layer/Vector";
import VectorSource              from "ol/source/Vector";
// import Feature       from "ol/Feature";
// import Point         from "ol/geom/Point";
import {Icon, Style, Fill, Text} from "ol/style";
import {fromLonLat}              from "ol/proj";
import courts                    from './../../data/courts_location.json'
import Feature                   from "ol/Feature";
import Point                     from "ol/geom/Point";

const centers = {
    '01': [25.408217, 52.472241],
    '02': [28.730089, 55.237508],
    '03': [29.453430, 52.411738],
    '04': [25.078919, 53.866871],
    '05': [27.747928, 53.752841],
    '06': [30.424774, 53.564610],
    '07': [27.649054, 53.890890]
};

export default {
    data() {
        return {
            currentLayer: null,
            layers      : {},
            map         : null,
            view        : null,
        }
    },
    props  : {
        initialRegion: {
            type   : String,
            default: '07'
        }
    },
    methods: {
        changeLayer(regionCode) {
            this.map.removeLayer(this.currentLayer);
            this.currentLayer = this.layers[regionCode];
            this.map.addLayer(this.layers[regionCode]);

            this.view.setCenter(fromLonLat(centers[regionCode]))
            this.view.setZoom(regionCode === '07' ? 11.5 : 7.5)
        },
    },
    mounted() {
        setTimeout(() => {
            this.view         = new View({
                zoom  : this.initialRegion === '07' ? 12.5 : 7.5,
                center: fromLonLat(centers[this.initialRegion])
            });
            let map           = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    })
                ],
                target: 'map',
                view  : this.view,
            });
            const updatedView = map.getView();
            for (let regionCode in courts) {
                let array = [];
                for (let courtCode in courts[regionCode]) {
                    array.push(
                        new Feature({
                            id      : courtCode,
                            name    : courts[regionCode][courtCode].name,
                            geometry: new Point(fromLonLat([
                                courts[regionCode][courtCode].longitude,
                                courts[regionCode][courtCode].latitude,
                            ])),
                        })
                    )
                }
                // let styleCache          = {};
                const layer             = new VectorLayer({
                    source: new Cluster({
                        distance: 55,
                        source  : new VectorSource({features: array})
                    }),
                    style(feature) {
                        // console.log(feature.getProperties());
                        const size = feature.get('features').length;

                        return new Style({
                            image: new Icon({
                                anchor: [0.7, 1],
                                scale : 0.3,
                                src   : '/imgs/marker.png',
                            }),
                            text : new Text({
                                offsetY: 5,
                                text   : (size === 1 ? '' : size) + '',
                                font   : '14px sans-serif',
                                fill   : new Fill({
                                    color: '#000000',
                                }),
                            }),
                        });
                    },
                })
                this.layers[regionCode] = layer;
                if (regionCode !== this.initialRegion) {
                    continue;
                }
                this.currentLayer = layer;
                map.addLayer(layer);
            }
            this.map = map;
            this.map.on('click', e => {
                this.map.forEachFeatureAtPixel(e.pixel, baseFeature => {
                    let length = baseFeature.getProperties().features.length;
                    if (length === 0) {
                        return;
                    }
                    if (length === 1) {
                        window.location = '/court/' + baseFeature.getProperties().features[0].getProperties().id;
                    }
                });
            });
            map.setView(
                updatedView
            );
        }, 1000)

    },
}
</script>
<style>
.map {
    width: 100%;
    height: 100%;
}

a.skiplink {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0;
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
}

a.skiplink:focus {
    clip: auto;
    height: auto;
    width: auto;
    background-color: #fff;
    padding: 0.3em;
}

#map:focus {
    outline: #4A74A8 solid 0.15em;
}
</style>

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
import {Icon, Style/*, Fill, Text*/} from "ol/style";
import {fromLonLat}              from "ol/proj";
import courts                    from './../../data/courts_location.json'
import Feature                   from "ol/Feature";
import Point                     from "ol/geom/Point";

export default {
    data() {
        return {
            currentLayer: null,
            layers      : {},
            map         : null,
        }
    },
    props  : {
        initialRegion: String
    },
    methods: {
        changeLayer(regionCode) {
            this.map.removeLayer(this.currentLayer);
            this.currentLayer = this.layers[regionCode];
            this.map.addLayer(this.layers[regionCode]);
        }
    },
    mounted() {
        setTimeout(() => {
            let map           = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    })],
                target: 'map',
                view  : new View({
                    zoom  : 7,
                    center: fromLonLat([27.9534, 53.7098])
                }),
            });
            const updatedView = map.getView();
            for (let regionCode in courts) {
                let array = [];
                for (let courtCode in courts[regionCode]) {
                    array.push(
                        new Feature({
                            name    : courts[regionCode][courtCode].name,
                            geometry: new Point(fromLonLat([
                                courts[regionCode][courtCode].longitude,
                                courts[regionCode][courtCode].latitude,
                            ])),
                        })
                    )
                }
                let styleCache          = {};
                const layer             = new VectorLayer({
                    source: new Cluster({
                        distance: 55,
                        source  : new VectorSource({features: array})
                    }),
                    style(feature) {
                        // console.log(feature.getProperties());
                        const size = feature.get('features').length;
                        let style  = styleCache[size];

                        if (!style) {
                            style      = new Style({
                                    image: new Icon({
                                        anchor: [0.7, 1],
                                        scale : 0.3,
                                        src   : '/imgs/marker.png',
                                    })
                                }
                            );
                            if (size === 1) {
                                style = new Style({
                                    image: new Icon({
                                        anchor: [0.7, 1],
                                        scale : 0.3,
                                        src   : '/imgs/marker.png',
                                    }),

                                });
                            }

                            styleCache[size] = style;

                        }

                        return style;
                    },
                })
                this.layers[regionCode] = layer;
                if (regionCode !== (this.initialRegion ? this.initialRegion : '07')) {
                    continue;
                }
                this.currentLayer = layer;
                map.addLayer(layer);
            }
            this.map = map;
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

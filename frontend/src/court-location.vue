<template>
    <div id="court-location" class="location"></div>
</template>

<script>
import 'ol/ol.css';
import Map               from 'ol/Map';
import OSM               from 'ol/source/OSM';
import TileLayer         from 'ol/layer/Tile';
import View              from 'ol/View';
import {fromLonLat}      from 'ol/proj';
import Feature           from 'ol/Feature';
import Point             from 'ol/geom/Point'
import VectorLayer       from 'ol/layer/Vector';
import VectorSource      from 'ol/source/Vector';
import {Icon, Style}     from 'ol/style';
import {defineComponent} from 'vue'

export default defineComponent({
    name : "location",
    props: {
        longitude: Number,
        latitude : Number
    },
    mounted() {
        setTimeout(() => {
            let map      = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    })],
                target: 'court-location',
                view  : new View({
                    center: fromLonLat([this.longitude, this.latitude]),
                    zoom  : 15.5,
                }),
            });
            const marker = new VectorLayer({
                source: new VectorSource({
                    features: [
                        new Feature({
                            geometry: new Point(fromLonLat([
                                this.longitude, this.latitude,
                            ])),
                        }),
                    ],
                }),
                style : new Style({
                    image: new Icon({
                        anchor: [0.7, 1],
                        scale : 0.3,
                        src   : '/imgs/marker.png',
                    }),
                }),
            });

            map.addLayer(marker);
        }, 1000)

    },
    data() {
        return {
            features: []
        }
    }
})
</script>

<style>
.location {
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

#location:focus {
    outline: #4A74A8 solid 0.15em;
}
</style>

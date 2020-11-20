<template>
    <div id="map" class="map"></div>
</template>

<script>
import 'ol/ol.css';
import Map           from "ol/Map";
import TileLayer     from "ol/layer/Tile";
import OSM           from "ol/source/OSM";
import View          from "ol/View";
import VectorLayer   from "ol/layer/Vector";
import VectorSource  from "ol/source/Vector";
// import Feature       from "ol/Feature";
// import Point         from "ol/geom/Point";
import {Icon, Style} from "ol/style";
import {fromLonLat}  from "ol/proj";
import courts        from './../../data/courts_location.json'
import Feature       from "ol/Feature";
import Point         from "ol/geom/Point";

export default {
    mounted() {
        setTimeout(() => {
            let map           = new Map({
                layers      : [
                    new TileLayer({
                        source: new OSM(),
                    })],
                target      : 'map',
                view        : new View({
                    zoom  : 7,
                    center: fromLonLat([27.9534, 53.7098])
                }),
            });
            const updatedView = map.getView();
            for(let regionCode in courts){
                let array = [];
                for (let courtCode in courts[regionCode]) {
                    array.push(
                        new Feature({
                            geometry: new Point(fromLonLat([
                                courts[regionCode][courtCode].longitude,
                                courts[regionCode][courtCode].latitude,
                            ])),
                        })
                    )
                }
                console.log(array);
                const layer      = new VectorLayer({
                    source: new VectorSource({features: array}),
                    style : new Style({
                        image: new Icon({
                            anchor: [0.7, 1],
                            scale  : 0.3,
                            src: '/imgs/marker.png',
                        }),
                    }),
                });

                map.addLayer(layer);
            }

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

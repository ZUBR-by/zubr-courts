<template>
    <div id="map" class="map">
        <el-card id="popup" v-show="isVisible">
            <div slot="header" class="clearfix">
                <span style="color: #fff">Суды</span>
                <el-button style="float: right;"
                           circle
                           @click="hide"
                           icon="el-icon-close"></el-button>
            </div>
            <div v-for="feature of selectedFeature" :key="feature.id">
                <p class="padding">
                    <a :href="'/court/' + feature.getProperties().id">
                        {{ feature.getProperties().name }}
                    </a>
                </p>
            </div>
        </el-card>
    </div>
</template>

<script>
import 'ol/ol.css';
import Map                       from "ol/Map";
import TileLayer                 from "ol/layer/Tile";
import {OSM, Cluster}            from "ol/source";
import View                      from "ol/View";
import VectorLayer               from "ol/layer/Vector";
import VectorSource              from "ol/source/Vector";
import Overlay                   from 'ol/Overlay';
import {Icon, Style, Fill, Text} from "ol/style";
import {fromLonLat}              from "ol/proj";
import courts                    from './../../data/courts_location.json'
import Feature                   from "ol/Feature";
import Point                     from "ol/geom/Point";
import {ElCard, ElButton}        from 'element-plus'
import {defineComponent}         from 'vue'

const centers = {
    '01': [25.408217, 52.472241],
    '02': [28.730089, 55.237508],
    '03': [29.453430, 52.411738],
    '04': [25.078919, 53.866871],
    '05': [27.747928, 53.752841],
    '06': [30.424774, 53.564610],
    '07': [27.551411, 53.895710]
};

export default defineComponent({
    components: {
        ElCard,
        ElButton
    },
    data() {
        return {
            currentLayer   : null,
            layers         : {},
            map            : null,
            view           : null,
            selectedFeature: null,
            isVisible      : false,
        }
    },
    props     : {
        initialRegion: {
            type   : String,
            default: '07'
        }
    },
    methods   : {
        hide() {
            this.isVisible       = false;
            this.selectedFeature = null;
        },
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
            this.map  = map;
            let popup = new Overlay({
                positioning: 'center-center',
                element    : document.getElementById('popup'),
            });
            map.addOverlay(popup);
            this.map.on('click', e => {
                this.map.forEachFeatureAtPixel(e.pixel, baseFeature => {
                    setTimeout(
                        () => {
                            let coordinate = e.coordinate;
                            popup.setPosition(coordinate);
                            this.isVisible       = true;
                            this.selectedFeature = baseFeature.getProperties().features;
                        },
                        150
                    )

                });
            });
            map.setView(
                updatedView
            );
        }, 1000)

    },
})
</script>
<style>
@media (max-width: 820px) {
    #popup {
        font-size: 14px;
    }

    .padding {
        padding-top: 6px;
    }
}

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


.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.el-card__header {
    padding: 5px 18px 16px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
}

@font-face {
    font-family: element-icons;
    src: url(/fonts/element-icons.woff) format("woff"), url(/fonts/element-icons.ttf) format("truetype");
    font-weight: 400;
    font-display: "auto";
    font-style: normal
}

[class*=" el-icon-"], [class^=el-icon-] {
    font-family: element-icons !important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}

.el-icon-ice-cream-round:before {
    content: ""
}


.el-icon-question:before {
    content: ""
}


.el-icon-eleme:before {
    content: ""
}

.el-icon-platform-eleme:before {
    content: ""
}

.el-icon-close:before {
    content: ""
}

.el-icon-loading {
    -webkit-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite
}

.el-icon--right {
    margin-left: 5px
}

.el-icon--left {
    margin-right: 5px
}
</style>

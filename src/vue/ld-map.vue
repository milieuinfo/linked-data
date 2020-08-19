<template>
    <div class="ld-map" v-if="coordinates">
        <div class="ol-map"></div>
    </div>
</template>

<script>
    import proj4 from "proj4";
    import * as proj from "ol/proj";
    import { register as olProj4Register } from "ol/proj/proj4";
    import * as extent from "ol/extent";
    import { Map, View, Feature } from "ol";
    import * as interaction from "ol/interaction";
    import * as control from "ol/control";
    import * as layer from "ol/layer";
    import * as source from "ol/source";
    import * as geom from "ol/geom";
    import { Style, Icon } from "ol/style";
    import WMTSTileGrid from "ol/tilegrid/WMTS";
    import WMTS from "ol/source/WMTS";
    import "ol/ol.css";

    export default {
        props: ['x', 'y', 'lon', 'lat'],
        data() {
            return {
                projection: null,
                coordinates: null,
                /** Extent of Flanders */
                mapExtent: [9928.000000, 66928.000000, 272072.000000, 329072.000000],
                resolutions: [],
                matrixIds: [],
                map: null,
                tilesLayer: null,
                markerLayer: null
            }
        },
        computed: {
        },
        mounted() {
            this.initProjection();
            this.initCoordinates();

        },
        watch: {
            coordinates() {
                if (!this.coordinates) {
                    return;
                }

                this.$nextTick(() => {
                    this.initResolutions();
                    this.initMatrixIds();
                    this.initMap();
                    this.initTilesLayer();
                    this.triggerResize();
                    this.initMarkerLayer();
                    this.addMarker();
                    setTimeout(this.triggerResize, 5000);
                });
            }
        },
        methods: {
            initProjection() {
                const code = 'EPSG:31370';
                if (!proj.get(code)) {
                    const definition = '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs';
                    proj4.defs(code, definition);
                    olProj4Register(proj4);
                }
                this.projection = proj.get(code);
            },

            initCoordinates() {
                if (this.x && this.y) {
                    this.coordinates = [parseFloat(this.x), parseFloat(this.y)];
                }

                if (this.lat && this.lon) {
                    this.coordinates = proj.transform([parseFloat(this.lon), parseFloat(this.lat)], 'EPSG:4326', 'EPSG:31370');
                }
            },

            initResolutions() {
                const maxResolution = extent.getHeight(this.mapExtent) / 256;
                for (let i = 0; i < 12; i++) {
                    this.resolutions[i] = maxResolution / Math.pow(2, i);
                }
            },

            initMatrixIds() {
                for (let i = 0; i < 12; i++) {
                    this.matrixIds[i] = i.toString();
                }
            },

            initMap() {
                this.map = new Map({
                    target: this.$el,
                    loadTilesWhileAnimating: false,
                    interactions: interaction.defaults({
                        mouseWheelZoom: false
                    }),
                    controls: [
                        new control.ScaleLine(),
                        new control.Zoom(),
                        new control.ZoomSlider()
                    ],
                    view: new View({
                        center: [140860.69299028325, 190532.7165957574],
                        extent: this.mapExtent,
                        projection: this.projection,
                        resolutions: this.resolutions,
                        zoom: 2
                    })
                });
            },

            initTilesLayer() {
                this.tilesLayer = new layer.Tile({
                    name: 'tiles',
                    source: new WMTS({
                        url: 'https://tile.informatievlaanderen.be/ws/raadpleegdiensten/wmts',
                        layer: 'grb_bsk_grijs',
                        matrixSet: 'BPL72VL',
                        format: 'image/png',
                        projection: 'EPSG:31370',
                        tileGrid: new WMTSTileGrid({
                            extent: this.mapExtent,
                            resolutions: this.resolutions,
                            matrixIds: this.matrixIds
                        }),
                        style: ''
                    })
                });
                this.map.addLayer(this.tilesLayer);
            },

            initMarkerLayer() {
                this.markerLayer = new layer.Vector({
                    name: 'marker',
                    source: new source.Vector({})
                });
                this.map.addLayer(this.markerLayer);
            },

            addMarker() {
                let feature = new Feature({
                    name: 'marker',
                    geometry: new geom.Point(this.coordinates)
                });
                let style = new Style({
                    image: new Icon({
                        anchor: [0.5, 0.9],
                        size: [80, 90],
                        opacity: 1,
                        scale: 0.7,
                        src: '/dist/img/marker-selected.png'
                    })
                });
                feature.setStyle(style);
                this.markerLayer.getSource().clear();
                this.markerLayer.getSource().addFeature(feature);

                // pan/zoom to marker
                setTimeout(() => {
                    this.map.getView().animate({
                        duration: 750,
                        center: this.coordinates,
                        resolution: this.resolutions[5]
                    });
                }, 500);
            },

            /**
             * Triggers a (fake) resize event to fix any map distortions that occasionally occur
             */
            triggerResize() {
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent('resize', true, false);
                window.dispatchEvent(evt);
            }
        }
    }
</script>

<style lang="scss">
    @import "../css/_variables";

    .ld-map {
        @include box-shadow();
        background-color: #fff;
        border: 1px solid #ddd;
        height: 410px;
        position: relative;

        .ol-scale-line {
            background: rgba(255, 255, 255, .4);
            @include box-shadow(2px);
            border-radius: 2px;
            bottom: 8px;
            right: 64px;
            left: auto;

            .ol-scale-line-inner {
                border: 1px solid #4da692;
                border-top: none;
                border-bottom: none;
                color: #333;
                background-color: rgba(255, 255, 255, 0.8);
            }
        }

        .ol-control {
            border-radius: 2px;

            button {
                height: 40px;
                width: 40px;
                line-height: .4em;
                background-color: #4da692;

                &:focus, &:hover {
                    background-color: #42796d;
                }
            }

            &.ol-zoom {
                top: auto;
                left: auto;
                bottom: 8px;
                right: .5em;
                @include box-shadow(2px);
            }

            &.ol-zoomslider {
                top: auto;
                left: auto;
                bottom: 100px;
                right: 8px;
                @include box-shadow(2px);

                button {
                    height: 10px
                }
            }
        }
    }
</style>

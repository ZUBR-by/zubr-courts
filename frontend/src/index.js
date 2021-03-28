import 'vite/dynamic-import-polyfill'
import {createApp} from 'vue'
import regions     from "../../data/regions.json";
import {ElCard}    from "element-plus";

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}


createApp({
    components: {
        ElCard
    },
    data() {
        return {
            regions,
            total    : null,
            maxYear  : 2020,
            maxRegion: '07',
            year     : 2020,
            trials   : [],
        }
    },
    mounted() {
        this.fetchStatistic()
        this.fetchTrials()
        for (let id of ["1293", "1218", "1253", "1166", "36"]) {
            fetch(import.meta.env.VITE_API_URL + '/judge/' + id).then(
                r => r.json()
            ).then(
                r => {
                    document.getElementById(id + '_fines_rub').innerText = r.statistic.fines_rub;
                    document.getElementById(id + '_arrests').innerText   = r.statistic.arrests;
                }
            )
        }
    },
    watch     : {
        year() {
            this.fetchStatistic()
        }
    },
    methods   : {
        fetchTrials() {
            let url      = new URL(
                import.meta.env.VITE_API_URL + '/trial'
            );
            let format   = (input) => {
                let day, month, year;
                [month, day, year] = input.split('/')

                return [year, pad(month), pad(day)].join('-')
            }
            let datetime = (new Date()).toISOString().split('T')[0];
            let params   = {
                'count'           : 3,
                'timestamp[after]': datetime + ' 00:00:00',
                'sort[timestamp]' : 'asc',
                'sort[court]'     : 'asc',
            }
            url.search   = new URLSearchParams(params);

            fetch(url)
                .then(r => r.json())
                .then(r => {
                    this.trials = r['hydra:member']
                });
        },
        calculateHeight(year, region) {
            if (year === this.maxYear && this.maxRegion === region) {
                return '200px'
            }
            let value = Math.round(this.total[year][region] / this.total[this.maxYear][this.maxRegion] * 200)
            return (value === 0 ? 1 : value) + 'px';
        },
        fetchStatistic() {
            fetch(import.meta.env.VITE_API_URL + '/statistic?year=' + this.year).then(
                r => {
                    if (!r.ok) {
                        return null;
                    }
                    return r.json()
                }
            ).then(r => {
                if (!r) {
                    return;
                }
                this.total     = r.data.regions;
                this.maxRegion = r.data.max.region;
                this.maxYear   = r.data.max.year;
                document
                    .getElementById('total_fines_rub')
                    .innerText = parseInt(r.data.total.finesRub).toLocaleString().replace(/,/g, ' ') + ' р.';
                document
                    .getElementById('total_fines')
                    .innerText = parseInt(r.data.total.fines).toLocaleString().replace(/,/g, ' ') + ' базовых величин';

                document
                    .getElementById('total_arrest')
                    .innerText = parseInt(r.data.total.arrests).toLocaleString().replace(/,/g, ' ');
            })
        }
    },
}).mount('#app')

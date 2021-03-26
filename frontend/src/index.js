import 'vite/dynamic-import-polyfill'
import {createApp} from 'vue'
import regions     from "../../data/regions.json";
console.log(import.meta.env.VITE_API_URL)
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

createApp({
    data() {
        return {
            regions,
            total    : null,
            maxYear  : 2020,
            maxRegion: '07',
            year     : 2020,
        }
    },
    mounted() {
        this.fetchStatistic()
    },
    watch  : {
        year() {
            this.fetchStatistic()
        }
    },
    methods: {
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

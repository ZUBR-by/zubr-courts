import 'vite/dynamic-import-polyfill'
import {createApp} from 'vue'
import regions from "../../data/regions.json";
import {ElCard} from "element-plus";

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
            total: null,
            maxYear: 2020,
            maxRegion: '07',
            year: 2022,
            yearsOverall: [2020, 2021, 2022],
            trials: [],
        }
    },
    mounted() {
        this.fetchStatistic()
        this.fetchTrials()
        fetch(import.meta.env.VITE_BACKEND_URL + 'courts/judges/top').then(
            r => r.json()
        ).then(
            r => {
                if (!r.judges || !Array.isArray(r.judges)) {
                    return
                }
                r.judges.forEach((elem) => {
                    document.getElementById(elem.id + '_fines_rub').innerText = elem.fines.aggregate.sum.amount_rub;
                    document.getElementById(elem.id + '_arrests').innerText   = elem.arrests.aggregate.sum.amount;
                })
            }
        )
    },
    watch: {
        year() {
            this.fetchStatistic()
        }
    },
    methods: {
        fetchTrials() {
            let url  = new URL(
                import.meta.env.VITE_BACKEND_URL + 'trials'
            );
            let date = new Date();

            let datetime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
            let params   = {
                limit: 4,
                filter: {
                    timestamp: {
                        _gte: datetime + ' 00:00:00'
                    },
                },
                sort: [{timestamp: 'asc'}, {'house_id': 'asc'}]
            }

            fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                }
            )
                .then(r => r.json())
                .then(r => {
                    this.trials = r['courts_trial']
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
            fetch(import.meta.env.VITE_BACKEND_URL + 'courts/decisions/stat/count?year=' + this.year).then(
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
                const result   = {
                    2019: {},
                    2020: {},
                    2021: {},
                    2022: {},
                }
                this.maxYear   = 2019
                this.maxRegion = '07'
                let maxValue   = 0;
                let value;
                for (let row of r.stat) {
                    value = row['count']
                    if (value > maxValue) {
                        maxValue       = value;
                        this.maxYear   = row['year']
                        this.maxRegion = '0' + row['region']
                    }
                    result[row['year']]['0' + row['region']] = value
                }
                this.total = result;

                document
                    .getElementById('total_fines_rub')
                    .innerText = parseInt(r.sum_fines.aggregate.sum.amount_rub).toLocaleString().replace(/,/g, ' ') + ' р.';
                document
                    .getElementById('total_fines')
                    .innerText = parseInt(r.sum_fines.aggregate.sum.amount).toLocaleString().replace(/,/g, ' ') + ' базовых величин';

                document
                    .getElementById('total_arrest')
                    .innerText = parseInt(r.sum_arrests.aggregate.sum.amount).toLocaleString().replace(/,/g, ' ');
            })
        }
    },
}).mount('#app')

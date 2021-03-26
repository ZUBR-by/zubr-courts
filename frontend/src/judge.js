import 'vite/dynamic-import-polyfill'
import {createApp}       from 'vue'
import decisions from "./decisions.vue";

createApp(
    {
        components: {
            decisions
        },
        mounted() {
            // eslint-disable-next-line
            fetch(import.meta.env.VITE_API_URL + '/judge/' + id ).then(
                r => r.json()
            ).then(
                r => {
                    // eslint-disable-next-line
                    document.getElementById(id + '_fines_rub').innerText = r.statistic.fines_rub;
                    // eslint-disable-next-line
                    document.getElementById(id + '_arrests').innerText = r.statistic.arrests;
                }
            )
        }
    }
).mount('#app');

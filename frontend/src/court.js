import 'vite/dynamic-import-polyfill'
import {createApp} from 'vue'
import decisions   from "./decisions.vue";
import location    from "./court-location.vue";
import trials      from "./trials.vue";

// eslint-disable-next-line
let cid = id;

createApp(
    {
        components: {
            decisions,
            location,
            trials,
        },
        mounted() {
            fetch(import.meta.env.VITE_API_URL + '/court/' + cid).then(
                r => r.json()
            ).then(
                r => {
                    document.getElementById(cid + '_fines_rub').innerText = r.statistic.fines_rub;
                    document.getElementById(cid + '_fines').innerText     = r.statistic.fines;
                    document.getElementById(cid + '_arrests').innerText   = r.statistic.arrests;
                }
            )
        }
    }
).mount('#app');

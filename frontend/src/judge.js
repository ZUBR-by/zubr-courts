import Vue       from 'vue'
import decisions from "./decisions";

new Vue(
    {
        el        : '#app',
        components: {
            decisions
        },
        mounted() {
            // eslint-disable-next-line
            fetch(process.env.VUE_APP_API_URL + '/judge/' + id ).then(
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
);

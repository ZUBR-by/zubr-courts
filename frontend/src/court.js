import Vue       from 'vue'
import decisions from "./decisions";
import map from "./map";

// eslint-disable-next-line
let cid = id;

new Vue(
    {
        el        : '#app',
        components: {
            decisions,
            location: map
        },
        mounted() {
            fetch(process.env.VUE_APP_API_URL + '/court/' + cid ).then(
                r => r.json()
            ).then(
                r => {
                    document.getElementById(cid + '_fines_rub').innerText = r.statistic.fines_rub;
                    document.getElementById(cid + '_fines').innerText = r.statistic.fines;
                    document.getElementById(cid + '_arrests').innerText = r.statistic.arrests;
                }
            )
        }
    }
);

import Vue       from 'vue'
import decisions from "./decisions";

new Vue(
    {
        data() {
            return {
                // eslint-disable-next-line
                id: id,
                career: [],
            }
        },
        el        : '#app',
        components: {
            decisions
        },
        mounted() {
            this.fetchCareer();
        },
        methods   : {
            fetchCareer() {
                let host   = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'https://zubr.club';
                let url    = new URL(
                    host + '/judgecareer'
                );
                url.search = new URLSearchParams({
                    'judge.id'       : this.id,
                    'sort[timestamp]': 'desc',
                    'sort[type]'     : 'asc'
                });

                fetch(url).then(r => r.json()).then(r => {
                    this.career = r['hydra:member'];
                })
            }
        }
    }
);

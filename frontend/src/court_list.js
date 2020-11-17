import Vue from 'vue'

new Vue(
    {
        el: '#app',
        data() {
            return {
                // eslint-disable-next-line
                regions,
                activeTab: '07',
                map      : ['07', '06', '05', '04', '03', '02', '01']
            }
        },
    }
);

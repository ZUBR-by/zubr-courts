import Vue           from 'vue'
import map from './court-map'

new Vue(
    {
        el: '#app',
        components: {
            'court-map' : map
        },
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

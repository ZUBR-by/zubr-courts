import 'vite/dynamic-import-polyfill'
import {createApp} from 'vue'
import decisions from "./decisions.vue";

createApp(
    {
        components: {
            decisions
        },
    }
).mount('#app');

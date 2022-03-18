import 'vite/dynamic-import-polyfill'
import {createApp} from 'vue'
import decisions from "./decisions.vue";
import location from "./court-location.vue";
import trials from "./trials.vue";

createApp(
    {
        components: {
            location,
        },
    }
).mount('#location');
createApp(
    {
        components: {
            decisions,
            trials,
        },
    }
).mount('#app');

import 'vite/dynamic-import-polyfill'
import judges from "./judges.vue";
import {createApp} from 'vue'

createApp({
    components: {
        judges
    }
}).mount('#app')

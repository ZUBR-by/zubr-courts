import {createApp} from 'vue'
import decisions   from "./decisions.vue";
import {ElLoading} from "element-plus";

createApp(
    {
        components: {
            decisions
        },
        directives: {
            loading: ElLoading
        }
    }
).mount('#app');

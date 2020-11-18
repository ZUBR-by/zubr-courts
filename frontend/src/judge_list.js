import Vue       from 'vue'
import judges from "./judges";
import './element-variables.scss'

new Vue(
    {
        el        : '#app',
        components: {
            judges
        }
    }
);

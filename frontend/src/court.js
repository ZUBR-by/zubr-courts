import Vue       from 'vue'
import decisions from "./decisions";
import map from "./map";

new Vue(
    {
        el        : '#app',
        components: {
            decisions,
            location: map
        }
    }
);

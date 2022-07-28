import {createApp} from 'vue'
import map         from './court-map.vue'
import trials      from './trials.vue'

function setCookie(name, value) {
    let options = {
        path     : '/',
        secure   : true,
        'max-age': 36000000,
        SameSite : 'strict'
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

function issetCookie(name) {
    return document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + "=([^;]*)"
    )) !== null;
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca     = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

createApp(
    {
        components: {
            'court-map': map,
            trials
        },
        methods   : {
            changeTab(region) {
                setCookie('region', region);
                this.activeTab = region;
                this.$refs.trials.changeRegion(region);
            }
        },
        data() {
            return {
                // eslint-disable-next-line
                regions,
                activeTab: issetCookie('region') ? getCookie('region') : '07',
                map      : ['07', '06', '05', '04', '03', '02', '01']
            }
        },
    }
).mount('#app');

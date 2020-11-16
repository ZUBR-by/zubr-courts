<template>
    <div class="scene">
        <div class="filter-wrp flex-row txt-algn-c mrgn-b-20px">
            <div class="section size-25 pdng-r-10px">
                <input class="input" placeholder="Имя" v-model.lazy="search" autofocus>
            </div>
            <div class="section size-25 txt-algn-r">
                <button class="button">Найти</button>
            </div>
        </div>
        <div class="table-wrapper pdng-t-20px pdng-20px">
            <table class="zbr-table">
                <tbody>
                <tr v-for="judge of judges" :key="judge.id">
                    <td>
                        <object width="50" height="50" :data="'https://cdn.zubr.ws/courts/judges/' + judge['fullName'] + '.jpg'"  type="image/jpeg">
                            <img alt="photo" width="50" height="50" src="/imgs/icons/svg/user-gray.svg">
                        </object>
                    </td>
                    <td><a :href="'/judge/' + judge.id">{{ judge.fullName }}</a></td>
                    <td>{{ judge.currentCourt ? judge.currentCourt.name : ''}}</td>
                    <td class="zbr-table-longtext">комментарий</td>
                </tr>
                <tr v-if="judges.length === 0">
                    <td colspan="4">
                        Нет данных
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name   : 'judges',
    data() {
        return {
            judges: [],
            search: ''
        }
    },
    methods: {
        loadData() {
            console.log(1);
            let host   = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'https://zubr.club';
            let url    = new URL(
                host + '/judge'
            );
            url.search = new URLSearchParams({
                'search': this.search
            });

            fetch(url).then(r => r.json()).then(r => {
                this.judges = r['hydra:member'];
            })
        }
    },
    watch  : {
        search() {
            this.loadData()
        }
    },
    created() {
        this.loadData()
    }
}
</script>

<style scoped>

</style>

<template>
    <div class="scene">
        <div class="filter-wrp flex-row txt-algn-c mrgn-b-20px">
            <div class="section size-25 pdng-r-10px">
                <input class="input" placeholder="Название" v-model.lazy="search" autofocus>
            </div>
            <div class="section size-25 txt-algn-r">
                <button class="button">Найти</button>
            </div>
        </div>
        <div class="table-wrapper pdng-t-20px pdng-20px">
            <table class="zbr-table">
                <tbody>
                <tr v-for="court of courts" :key="court.id">
                    <td>{{ court.id }}</td>
                    <td>{{ court.name }}</td>
                    <td class="zbr-table-longtext">комментарий</td>
                    <td><a :href="'/court/' + court.id">ссылка</a></td>
                </tr>
                <tr v-if="courts.length === 0">
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
    name   : 'courts',
    data() {
        return {
            courts: [],
            search: ''
        }
    },
    methods: {
        loadData() {
            console.log(1);
            let host   = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'https://zubr.club';
            let url    = new URL(
                host + '/court'
            );
            url.search = new URLSearchParams({
                'search': this.search
            });

            fetch(url).then(r => r.json()).then(r => {
                this.courts = r['hydra:member'];
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

<template>
    <div class="scene">
        <div class="pdng-t-5prc pdng-b-20px">
            <h2 class=" txt-uppercase txt-color-1">
                Вынесенные решения
            </h2>
        </div>
        <div class="filter-wrp flex-row txt-algn-c mrgn-b-20px" v-if="decisions.length !== 0">
            <div class="section size-25 pdng-r-10px">
                <input class="input" placeholder="29.02.2010">
            </div>
            <div class="section size-25 pdng-r-10px">
                <input class="input" placeholder="23.34">
            </div>
            <div class="section size-25 pdng-r-10px">
                <input class="input" placeholder="Введите текст решения">
            </div>
            <div class="section size-25 txt-algn-r">
                <button class="button">Найти</button>
            </div>
        </div>
        <div class="table-wrapper pdng-t-20px pdng-20px">
            <table class="zbr-table">
                <tbody>
                <tr v-for="decision of decisions" :key="decision.id">
                    <td class="txt-nowrap">{{ decision.fullName }}</td>
                    <td class="txt-nowrap">{{ decision.timestamp }}</td>
                    <td class="txt-nowrap">{{ decision.aftermath }}</td>
                    <td class="txt-nowrap">{{ decision.articles }}</td>
                    <td class="zbr-table-longtext"></td>
                </tr>
                <tr v-if="decisions.length === 0">
                    <td colspan="4">
                        {{ error ? error : 'Нет данных' }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name : 'decisions',
    data() {
        return {
            decisions: [],
            error    : ''
        }
    },
    props: {
        court: String,
        judge: String,
    },
    created() {
        let host   = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'https://zubr.club';
        let url    = new URL(
            host + '/decision'
        );
        let params = {
            'sort[timestamp]'     : 'desc',
            'sort[aftermath_type]': 'asc',
        };
        if (this.court) {
            params['court.id'] = this.court;
        }
        if (this.judge) {
            params['judge.id'] = this.judge;
        }
        url.search = new URLSearchParams(params);
        fetch(url).then(r => {
            if (!r.ok) {
                this.error = 'Произошла ошибка'
                return {'hydra:member': []}
            }
            return r.json()
        }).then(r => {
            this.decisions = r['hydra:member'];
        })
    }
}
</script>

<style scoped>

</style>

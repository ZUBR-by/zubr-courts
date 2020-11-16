<template>
    <div class="scene">
        <div class="pdng-b-20px">
            <h1 class="txt-color-1 txt-size-34px txt-">
                Судьи Баларуси
            </h1>
        </div>
        <div class="filter-wrp mrgn-0 mrgn-b-30px">
            <div class="flex-row mil-flex-column">
                <div class="section size-25 mil-size-100 pdng-r-10px mil-pdng-0 mil-pdng-t-10px">
                    <div class="txt-algn-l">
                        ФИО судьи
                    </div>
                    <input class="input mrgn-t-5px"  v-model.lazy="search" autofocus placeholder="" >
                </div>
                <div class="section size-25 mil-size-100 pdng-r-10px mil-pdng-0 mil-pdng-t-10px">
                    <div class="txt-algn-l">
                        Суд
                    </div>
                    <input class="input mrgn-t-5px" placeholder="Минской городской суд">
                </div>
                <div class="section size-25 mil-size-100 pdng-r-10px mil-pdng-0 mil-pdng-t-10px">
                    <div class="txt-algn-l">
                        Метки
                    </div>
                    <input class="input mrgn-t-5px" placeholder="Пособник, коррупционер">
                </div>
                <div class="section size-25 mil-size-100 mil-pdng-t-20px txt-algn-r">
                    <div>&nbsp;</div>
                    <button class="button primary mil-size-100 mil-pdng-t-20px mrgn-t-5px">Найти судью</button>
                </div>
            </div>
            <div class="filter-table-sort mrgn-t-20px flex-row mil-notdisplay">
                <div class="section size-25">
                    ФИО судьи
                    <div class="filter-t-s-arrow down"></div>
                </div>
                <div class="section size-25">
                    Тэги
                    <div class="filter-t-s-arrow up"></div>
                </div>
                <div class="section size-20">
                    Решения
                    <div class="filter-t-s-arrow notdisplay"></div>
                </div>
                <div class="section size-30">Текущее/прошлое место работы</div>
            </div>
        </div>
        <div class="table-wrapper pdng-t-20px pdng-20px">
            <table class="zbr-table">
                <tbody>
                <tr :class="judge.id === 1 ? 'fav' :''" v-for="judge of judges" :key="judge.id">
                    <td class="size-25 min-size-250px valgn-c">
                        <a href="#" class="flex-row flex-algn-itms-c cursor-pointer">
                            <div class="section size-64px flex-noshrink">
                                <div class="judge-unit-photo">
                                    <object width="50" height="50" :data="'https://cdn.zubr.ws/courts/judges/' + judge['fullName'] + '.jpg'" type="image/jpeg">
                                        <img alt="photo" width="50" height="50" src="/imgs/icons/svg/user-gray.svg">
                                    </object>
                                    <div class="judge-u-photo-icon">
                                        <img src="/imgs/icons/svg/star.svg">
                                    </div>
                                </div>
                            </div>
                            <div class="section pdng-l-20px">
                                <h3 class="txt-size-18px txt-color-1 txt-bold valgn-c">
                                    <a :href="'/judge/' + judge.id">{{ judge.fullName }}</a>
                                </h3>
                            </div>
                        </a>
                    </td>
                    <td class="size-25 min-size-250px valgn-c">
                        <div class="tags-wrp">
                            <a class="tag-unit" href="#">Взятки</a>
                            <a class="tag-unit" href="#">Длиный тег</a>
                            <a class="tag-unit" href="#">Политические дела</a>
                            <a class="tag-unit" href="#">Длиный тег</a>
                        </div>
                    </td>
                    <td class="txt-nowrap size-20 valgn-c">
                        <div>230 решений</div>
                        <div class="txt-color-3">35 915 р. / 450 суток</div>
                    </td>
                    <td class="txt-nowrap size-30 pdng-r-10px valgn-c">
                        <div v-if="judge.currentCourt">
                            <a class="txt-color-2" :href="'/court/' + judge.currentCourt.id">
                                {{ judge.currentCourt.name }}
                            </a>
                        </div>
                        <div v-if="judge.previousCourt">
                            <a class="txt-color-3" :href="'/court/' + judge.previousCourt.id">
                                {{ judge.previousCourt.name }}
                            </a>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pdng-t-50px pdng-b-20px txt-algn-c">
            <div class="button large size-50 mil-size-100">Показать больше судей</div>
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

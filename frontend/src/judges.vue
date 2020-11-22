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
                    <input
                        class="input mrgn-t-5px"
                        v-model.lazy="filter.search" autofocus placeholder="">
                </div>
                <!--                <div class="section size-25 mil-size-100 pdng-r-10px mil-pdng-0 mil-pdng-t-10px">-->
                <!--                    <div class="txt-algn-l">-->
                <!--                        Суд-->
                <!--                    </div>-->
                <!--                    <input class="input mrgn-t-5px" placeholder="Минской городской суд">-->
                <!--                </div>-->
                <div class="section size-50 mil-size-100 pdng-r-10px mil-pdng-0 mil-pdng-t-10px">
                    <div class="txt-algn-l">
                        Метки
                    </div>
                    <div style="padding-top: 5px;">
                        <el-checkbox-group v-model="filter.tags" size="large">
                            <el-checkbox-button :label="key" v-for="(item, key) in translations" :key="key" border>{{ item }}</el-checkbox-button>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="section size-25 txt-algn-l" style="padding-top: 35px">
                    <b>Кол-во судей</b>: {{ count }}
                </div>
                <div class="section size-25 mil-size-100 mil-pdng-t-20px txt-algn-r">
                    <div>&nbsp;</div>
                    <button class="button primary mil-size-100 mil-pdng-t-20px mrgn-t-5px" @click="loadData">
                        Найти
                    </button>
                </div>
            </div>
            <div class="filter-table-sort mrgn-t-20px flex-row mil-notdisplay">
                <div @click="setSort('fullName')"
                     class="section size-25">
                    ФИО судьи
                    <div :class="{'filter-t-s-arrow' : this.sort === 'fullName', 'down' : this.order === 'desc', 'up': this.order === 'asc'}"></div>

                </div>
                <div class="section size-25" @click="setSort('tags')">
                    Метки
                    <div :class="{'filter-t-s-arrow' : this.sort === 'tags', 'down' : this.order === 'desc', 'up': this.order === 'asc'}"></div>
                </div>
                <div class="section size-20" @click="setSort('decisions')">
                    Решения
                    <div :class="{'filter-t-s-arrow' : this.sort === 'decisions', 'down' : this.order === 'desc', 'up': this.order === 'asc'}"></div>
                </div>
                <div class="section size-30">
                    Текущее/прошлое место работы
                </div>
            </div>
        </div>
        <div class="table-wrapper pdng-t-20px pdng-20px" v-loading="this.loading">
            <table class="zbr-table">
                <tbody>
                <tr v-for="judge of judges" :key="judge.id">
                    <td class="size-25 min-size-250px valgn-c">
                        <a :href="'/judge/' + judge.id" class="flex-row flex-algn-itms-c cursor-pointer">
                            <div class="section size-64px flex-noshrink">
                                <div class="judge-unit-photo">
                                    <img alt="photo"
                                         :src="'https://cdn.zubr.ws/courts/judges/' + judge['id'] + '.jpg'">
                                    <div class="judge-u-photo-icon" v-if="judge.tags.includes('top')">
                                        <img src="/imgs/icons/svg/star.svg">
                                    </div>
                                </div>
                            </div>
                            <div class="section pdng-l-20px">
                                <h3 class="txt-size-18px txt-color-1 txt-bold valgn-c">
                                    {{ judge.fullName }}
                                </h3>
                            </div>
                        </a>
                    </td>
                    <td class="size-25 min-size-250px valgn-c">
                        <div class="tags-wrp">
                            <a class="tag-unit" v-for="tag of judge.tags" :key="tag">{{ translate(tag) }}</a>
                        </div>
                    </td>
                    <td class="txt-nowrap size-20 valgn-c">
                        <div>{{ judge.statistic.count }} решений</div>
                        <div class="txt-color-3">
                            {{ judge.statistic.fines_rub }} р. / {{ judge.statistic.arrests }} суток адм. ареста
                        </div>
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
                <tr v-if="judges.length === 0 && loading === false">
                    <td colspan="4">
                        Нет данных
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pdng-t-50px pdng-b-20px txt-algn-c" v-if="judges.length !== count">
            <button class="button large size-50 mil-size-100" @click="loadMore">Показать больше судей</button>
        </div>
    </div>
</template>

<script>

import {CheckboxGroup, CheckboxButton, Loading} from 'element-ui'
import Vue                                      from 'vue'
import './styles/element-variables.scss'
import translations                             from './../../data/translations.json'

Vue.use(Loading);
export default {
    name      : 'judges',
    components: {
        [CheckboxGroup.name] : CheckboxGroup,
        [CheckboxButton.name]: CheckboxButton,
    },
    data() {
        return {
            translations,
            judges : [],
            page   : 1,
            count  : 0,
            order  : 'desc',
            sort   : 'decisions',
            filter : {
                tags  : [],
                search: '',
            },
            loading: false
        }
    },
    methods   : {
        loadMore(){
            this.page++;
            this.loadData()
        },
        setSort(column) {
            if (this.sort === column) {
                if (this.order === 'desc') {
                    this.order = 'asc';
                } else {
                    this.order = '';
                    this.sort  = '';
                }
            } else {
                this.sort  = column;
                this.order = 'desc'
            }
            this.page = 1;
            this.loadData();
        },
        translate(value) {
            return this.translations[value];
        },
        loadData() {
            let host   = process.env.VUE_APP_API_URL;
            let url    = new URL(
                host + '/judge'
            );
            let params = {}
            if (this.sort) {
                params['sort[' + this.sort + ']'] = this.order;
            }
            for (let tag of this.filter.tags) {
                params['tag[' + tag + ']'] = 1;
            }
            if (this.filter.search) {
                params['search'] = this.filter.search;
            }
            if (this.page > 1) {
                params['page'] = this.page;
            }

            url.search   = new URLSearchParams(params);
            this.loading = true;
            fetch(url).then(r => {
                    if (!r.ok) {
                        this.loading = false;
                        return null;
                    }
                    return r.json()
                }
            ).then(r => {
                if (r === null) {
                    return;
                }
                if (this.page > 1) {
                    this.judges = this.judges.concat(r['hydra:member']);
                } else {
                    this.count   = r['hydra:totalItems'];
                    this.judges  = r['hydra:member'];
                }

                this.loading = false;
            })
        }
    },
    watch     : {
        filter: {
            deep: true,
            handler() {
                this.page = 1;
                this.loadData()
            }
        }
    },
    created() {
        this.loadData()
    }
}
</script>

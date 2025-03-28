<template>
    <div class="scene">
        <div class="pdng-b-20px">
            <h1 class="txt-color-1 txt-size-34px txt-">
                Судьи Беларуси
            </h1>
        </div>
        <div class="filter-wrp mrgn-0 mrgn-b-30px">
            <div class="flex-row mil-flex-column">
                <div class="section size-25 mil-size-100 pdng-r-10px mil-pdng-0 mil-pdng-t-10px">
                    <div class="txt-algn-l">
                        ФИО судьи
                    </div>
                    <input class="input" style="padding:8px 15px;" v-model.lazy="filter.search" autofocus :placeholder="''">
                </div>
                <div class="section size-25 mil-size-100 pdng-r-10px mil-pdng-0 mil-pdng-t-10px">
                    <div class="txt-algn-l">
                        Метки
                    </div>
                    <el-select v-model="filter.tags"
                               multiple
                               clearable
                               :placeholder="'Метки'"
                               style="width: 100%"
                               :collapse-tags="true">
                        <el-option :value="key"
                                   :label="item" v-for="(item, key) in translations"
                                   :key="key"></el-option>
                    </el-select>
                </div>
                <div class="section size-50 txt-algn-l" style="padding-top: 30px">
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
                <div @click="setSort('full_name')"
                     class="section size-25">
                    ФИО судьи
                    <div
                        :class="{'filter-t-s-arrow' : sort === 'full_name', 'down' : order === 'desc', 'up': order === 'asc'}"></div>

                </div>
                <div class="section size-25" @click="setSort('tags')">
                    Метки
                    <div
                        :class="{'filter-t-s-arrow' : sort === 'tags', 'down' : order === 'desc', 'up': order === 'asc'}"></div>
                </div>
                <div class="section size-20" @click="setSort('administrative_decisions_count')">
                    Адм. Решения
                    <div
                        :class="{'filter-t-s-arrow' : sort === 'administrative_decisions_count', 'down' : order === 'desc', 'up': order === 'asc'}"></div>
                </div>
                <div class="section size-30">
                    Текущее/прошлое место работы
                </div>
            </div>
        </div>
        <div class="table-wrapper pdng-t-20px pdng-20px" v-loading="loading">
            <table class="zbr-table">
                <tbody>
                <tr v-for="judge of judges" :key="judge.id">
                    <td class="size-25 min-size-250px valgn-c">
                        <a :href="'/judge/' + judge.id" class="flex-row flex-algn-itms-c cursor-pointer">
                            <div class="section size-64px flex-noshrink">
                                <div class="judge-unit-photo" style="width: 64px;height: 64px">
                                    <img alt="photo"
                                         :src="judge['photo_url'] || '/imgs/icons/svg/user.svg'">
                                    <div class="judge-u-photo-icon" v-if="Array.isArray(judge.tags) && judge.tags.includes('top')">
                                        <img src="/imgs/icons/svg/star.svg">
                                    </div>
                                </div>
                            </div>
                            <div class="section pdng-l-20px">
                                <h3 class="txt-size-18px txt-color-1 txt-bold valgn-c">
                                    {{ judge.full_name }}
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
                        <div>{{ judge.count }} решений</div>
                        <div class="txt-color-3">
                            {{ judge.fines_rub }} р. / {{ judge.arrests }} суток
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

<script setup>

import translations                from './../../data/translations.json'
import {ref, watch, onBeforeMount} from 'vue'

const judges  = ref([]);
const page    = ref(1);
const count   = ref(0);
const order   = ref('desc');
const sort    = ref('administrative_decisions_count')
const filter  = ref({
    tags  : [],
    search: '',
})
const loading = ref(false)


const loadData  = () => {
    let host   = import.meta.env.VITE_BACKEND_URL;
    let url    = new URL(
        host + 'courts/judges'
    );
    let params = {
        filter: {_and: []}
    }
    if (sort.value) {
        params['sort'] = {[sort.value]: order.value};
    }
    for (let tag of filter.value.tags) {
        params.filter._and.push({tags: {_contains: tag}});
    }
    if (filter.value.search) {
        params.filter._and.push({full_name: {_ilike: '%' + filter.value.search + '%'}});
    }
    if (page.value > 1) {
        params['offset'] = page.value * 30;
    }

    loading.value = true;
    fetch(
        url,
        {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body   : JSON.stringify(params)
        }
    ).then(r => {
            if (!r.ok) {
                loading.value = false;
                return null;
            }
            return r.json()
        }
    ).then(r => {
        if (r === null || !r.judges) {
            return;
        }
        const addYear = (d, a) => {
            d.setFullYear(d.getFullYear() + a)
            return d
        }
        r['judges'].map(elem => {
            elem.currentCourt = ((history) => {
                if (history.length === 0) {
                    return null;
                }
                const [item] = history;

                return item.type !== 'released'
                && (
                    item.term_type === 'indefinitely'
                    || (
                        item.term_type === 'years'
                        && (new Date()) < addYear(new Date(item.timestamp), item.term)
                    )
                    || item.term_type === 'period'
                )
                    ? item.house : null
            })(elem.career)

            elem.previousCourt = ((history) => {
                if (history.length === 0) {
                    return null;
                }
                const [first, second] = history
                if (!second && first.type !== 'released') {
                    return null
                }
                if (!second && first.type === 'released') {
                    return first.house
                }
                if (second) {
                    return second.house
                }
                return null
            })(elem.career)

            return {
                ...elem
            }
        })
        if (page.value > 1) {
            judges.value = judges.value.concat(r['judges']);
        } else {
            count.value  = r['aggregate']['fn']['count'];
            judges.value = r['judges'];
        }

        loading.value = false;
    })
}
const loadMore  = () => {
    page.value++;
    loadData()
}
const setSort   = (column) => {
    if (sort.value === column) {
        if (order.value === 'desc') {
            order.value = 'asc';
        } else {
            order.value = '';
            sort.value  = '';
        }
    } else {
        sort.value  = column;
        order.value = 'desc'
    }
    page.value = 1;
    loadData();
}
const translate = (value) => {
    return translations[value];
}

watch(filter, () => {
    page.value = 1;
    loadData()
}, {
    deep: true
})

onBeforeMount(() => {
    loadData()
})

</script>
<style>
:root {
    --el-border-color: var(--el-color-primary)
}

.el-input__inner {
    height: 40px !important;
}

.el-icon-close:before {
    content: ""
}
</style>

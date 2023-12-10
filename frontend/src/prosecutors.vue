<template>
    <div class="scene">
        <div class="pdng-b-20px">
            <h1 class="txt-color-1 txt-size-34px txt-">
                Список прокуроров
            </h1>
        </div>
        <div class="filter-wrp mrgn-0 mrgn-b-30px">
            <div class="flex-row mil-flex-column">
                <div class="section size-25 mil-size-100 pdng-r-10px mil-pdng-0 mil-pdng-t-10px">
                    <div class="txt-algn-l">
                        Имя
                    </div>
                    <input class="input" style="padding:8px 15px;" v-model.lazy="filter.search" autofocus :placeholder="''">
                </div>
                <div class="section size-50 txt-algn-l" style="padding-top: 30px">
                    <b>Кол-во</b>: {{ count }}
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
                     class="section size-25 min-size-250px">
                    ФИО
                    <div
                        :class="{'filter-t-s-arrow' : sort === 'full_name', 'down' : order === 'desc', 'up': order === 'asc'}"></div>

                </div>
                <div class="section size-20" @click="setSort('decisions_count')">
                    Количество дел
                    <div
                        :class="{'filter-t-s-arrow' : sort === 'decisions_count', 'down' : order === 'desc', 'up': order === 'asc'}"></div>
                </div>
                <div class="section size-30">
                    Текущее/прошлое место работы
                </div>
            </div>
        </div>
        <div class="table-wrapper pdng-t-20px pdng-20px" v-loading="loading">
            <table class="zbr-table">
                <tbody>
                <tr v-for="prosecutor of prosecutors" :key="prosecutor.id">
                    <td class="size-25 min-size-250px valgn-c">
                        <a :href="'/prosecutor/' + prosecutor.id" class="flex-row flex-algn-itms-c cursor-pointer">
                            <div class="section size-64px flex-noshrink">
                                <div class="judge-unit-photo" style="width: 64px;height: 64px">
                                    <img alt="photo"
                                         :src="prosecutor['photo_url'] || '/imgs/icons/svg/user.svg'">
                                </div>
                            </div>
                            <div class="section pdng-l-20px">
                                <h3 class="txt-size-18px txt-color-1 txt-bold valgn-c">
                                    {{ prosecutor.full_name }}
                                </h3>
                            </div>
                        </a>
                    </td>
                    <td class="txt-nowrap size-20 valgn-c txt-algn-c">
                        <div>
                            {{ prosecutor.decisions_count === 0 ? 'Нет данных' : prosecutor.decisions_count }}
                        </div>
                    </td>
                    <td class="txt-nowrap size-30 pdng-r-10px valgn-c">
                        <template v-if="prosecutor.career.length > 0">
                            <div>
                              <a class="txt-color-2">
                                {{ prosecutor.career[0].office.name }}
                              </a>
                            </div>
                            <div v-if="prosecutor.career[1]">
                              <a class="txt-color-3">
                                {{ prosecutor.career[1].office.name}}
                              </a>
                            </div>
                        </template>
                    </td>
                </tr>
                <tr v-if="prosecutors.length === 0 && loading === false">
                    <td colspan="4">
                        Нет данных
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pdng-t-50px pdng-b-20px txt-algn-c" v-if="prosecutors.length !== count">
            <button class="button large size-50 mil-size-100" @click="loadMore">Показать больше судей</button>
        </div>
    </div>
</template>

<script setup>

import translations                from './../../data/translations.json'
import {ref, watch, onBeforeMount} from 'vue'

const prosecutors  = ref([]);
const page    = ref(1);
const count   = ref(0);
const order   = ref('desc');
const sort    = ref('decisions_count')
const filter  = ref({
    tags  : [],
    search: '',
})
const loading = ref(false)


const loadData  = () => {
    let host   = import.meta.env.VITE_BACKEND_URL;
    let url    = new URL(
        host + 'courts/prosecutors'
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
        if (r === null || !r.prosecutors) {
            return;
        }
        const addYear = (d, a) => {
            d.setFullYear(d.getFullYear() + a)
            return d
        }
        r['prosecutors'].map(elem => {
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
            prosecutors.value = prosecutors.value.concat(r['prosecutors']);
        } else {
            count.value  = r['aggregate']['fn']['count'];
            prosecutors.value = r['prosecutors'];
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

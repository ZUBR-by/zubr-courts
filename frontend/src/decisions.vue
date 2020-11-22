<template>
    <div class="scene">
        <div class="pdng-t-5prc pdng-b-20px">
            <h2 class=" txt-uppercase txt-color-1">
                Вынесенные решения
            </h2>
        </div>
        <p v-if="decisions.length !== 0">
            Если вы хотите скрыть вашу фамилию из публичного доступа, напишите в
            <a href="https://t.me/zubr_watch_bot">телеграмм-бот</a>
        </p>
        <div class="filter-wrp flex-row mrgn-b-20px" v-if="decisions.length !== 0">
            <div class="section size-40 pdng-r-10px">
                <input class="input" placeholder="ФИО" v-model.lazy="filter">
            </div>
            <div class="section">
                <button class="button">Найти</button>
            </div>
            <div class="section size-60 txt-algn-r" style="padding-top: 10px">
                <b>Кол-во вынесенных решений</b>: {{ total }}
            </div>
        </div>
        <div class="table-wrapper pdng-t-20px pdng-20px">
            <table class="zbr-table">
                <tbody>
                <tr v-for="decision of decisions" :key="decision.id">
                    <td class="txt-nowrap">{{ decision.fullName }}</td>
                    <td class="txt-nowrap">{{ decision.timestamp }}</td>
                    <td class="txt-nowrap">{{ decision.aftermath }}</td>
                    <td class="txt-nowrap">
                        <div v-for="(article, index) in decision.articles" :key="index">
                            <el-popover width="300" :content="format(article)" placement="bottom">
                                <el-button slot="reference" type="primary"
                                           circle
                                           icon="el-icon-question"
                                           size="mini"></el-button>
                            </el-popover>
                            {{ article.split(' - ')[0] }}
                        </div>
                    </td>
                    <!--                    <td class="zbr-table-longtext"></td>-->
                </tr>
                <tr v-if="decisions.length === 0">
                    <td colspan="4">
                        {{ error ? error : 'Нет данных' }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pdng-t-50px pdng-b-20px txt-algn-c" v-if="decisions.length !== total">
            <button class="button large size-50 mil-size-100" @click="loadMore">Показать больше решений</button>
        </div>
    </div>
</template>

<script>
import {Popover, Button} from 'element-ui'
import './styles/element-variables.scss'

export default {
    name      : 'decisions',
    components: {
        [Popover.name]: Popover,
        [Button.name] : Button,
    },
    data() {
        return {
            decisions: [],
            filter   : '',
            total    : 0,
            error    : '',
            page     : 1,
        }
    },
    props     : {
        court: String,
        judge: String,
    },
    watch     : {
        filter() {
            this.page = 1;
            this.fetchData()
        }
    },
    created() {
        this.fetchData();
    },
    methods   : {
        loadMore() {
            this.page++;
            this.fetchData()
        },
        format(article) {
            return article.split(' - ')[1].replace(/"/g, '');
        },
        fetchData() {
            let host   = process.env.VUE_APP_API_URL;
            let url    = new URL(
                host + '/decision'
            );
            let params = {
                'sort[timestamp]'     : 'desc',
                'sort[aftermath_type]': 'asc',
                'fullName'            : this.filter
            };
            if (this.court) {
                params['court.id'] = this.court;
            }
            if (this.judge) {
                params['judge.id'] = this.judge;
            }
            if (this.page > 1) {
                params['page'] = this.page;
            }
            url.search = new URLSearchParams(params);
            fetch(url).then(r => {
                if (!r.ok) {
                    return null
                }
                return r.json()
            }).then(r => {
                if (r === null) {
                    this.error = 'Произошла ошибка'
                    return;
                }
                if (this.page > 1) {
                    this.decisions = this.decisions.concat(r['hydra:member']);
                } else {
                    this.total  = r['hydra:totalItems'];
                    this.decisions = r['hydra:member'];
                }
            })
        }
    }
}
</script>

<style scoped>
.el-button--mini.is-circle {
    padding: 5px !important;
}
</style>

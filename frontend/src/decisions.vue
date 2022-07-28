<template>
    <Teleport :to="'#stat_fines_rub'" v-if="judge || court">
        {{ fines_rub }}
    </Teleport>
    <Teleport :to="'#stat_fines'" v-if="judge || court">
        {{ fines }}
    </Teleport>
    <Teleport :to="'#stat_arrests'" v-if="judge || court">
        {{ arrests }}
    </Teleport>
    <div>
        <div class="pdng-b-20px">
            <h2 class=" txt-uppercase txt-color-1">
                Вынесенные решения
            </h2>
        </div>
        <div class="inline-notice yellow">
            <p>
                Если вы хотите скрыть вашу фамилию из публичного доступа, напишите в
                <a href="https://t.me/zubr_watch_bot">телеграмм-бот</a>.
                Часть данных по административным решениям взята из базы правозащитного центра
                <a href="https://spring96.org/">"Весна"</a>
            </p>
        </div>
        <div class="filter-wrp flex-row mrgn-b-20px ">
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
            <table class="zbr-table" v-loading="loading">
                <tbody>
                <tr v-for="decision of decisions" :key="decision.id"
                    :class="{'fav' : decision.category === 'criminal'}">
                    <td class="txt-nowrap size-10">{{ decision.full_name }}</td>
                    <td class="txt-nowrap">
                        {{ decision.timestamp.split('T')[0] }}
                    </td>
                    <td class="size-10">
                        {{ decision.outcome_formatted }}
                    </td>
                    <td class="size-25">
                        <p v-for="(article, index) in decision.articles" :key="index">
                            <el-popover width="300" :content="format(decision, article)"
                                        placement="bottom">
                                <template #reference>
                                    <el-button type="primary"
                                               circle
                                               :icon="Question"
                                               size="default"></el-button>
                                </template>
                            </el-popover>
                            <span v-if="hashes[article]"
                                  v-text="hashes[article].name"
                                  style="padding-left: 3px"></span>
                            <span style="padding-left: 3px" v-else>{{ article }}</span>
                        </p>
                    </td>
                    <td>
                        <div v-if="decision.attachments.length > 0">
                            <el-image
                                :ref="'dec' + decision.id"
                                :preview-src-list="decision.attachments.map(i => i.url)">
                                <template #error>
                                    <div class="image-slot">
                                        <a @click="showDialog(decision)">Показать материалы</a>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                        <div v-if="decision.extra.links && decision.extra.links.length > 0">
                            <template v-for="(link,index) of decision.extra.links" :key="index">
                                <a target="_blank" :href="link">
                                    {{ link }}
                                </a>
                                <br>
                            </template>
                        </div>
                        <div>
                            {{ decision.description }}
                        </div>
                    </td>
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
import articlesHashes                from './../../data/articles.json'
import {defineComponent, shallowRef} from "vue";
import {QuestionFilled}              from '@element-plus/icons-vue'

export default defineComponent({
    name      : 'decisions',
    components: {
        QuestionFilled
    },
    data() {
        return {
            decisions: [],
            arrests  : 0,
            fines    : 0,
            fines_rub: 0,
            filter   : '',
            total    : 0,
            error    : '',
            page     : 1,
            current  : null,
            loading  : false,
            hashes   : articlesHashes,
            Question : shallowRef(QuestionFilled)
        }
    },
    props: {
        court: String,
        judge: String,
    },
    watch: {
        filter() {
            this.page = 1;
            this.fetchData()
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        showDialog(decision) {
            this.$refs['dec' + decision.id].clickHandler();
        },
        loadMore() {
            this.page++;
            this.fetchData()
        },
        format(decision, article) {
            return articlesHashes[article] ? articlesHashes[article].description : article;
        },
        fetchData() {
            this.loading = true;
            let url      = new URL(
                import.meta.env.VITE_BACKEND_URL
                + (this.court ? 'house/' + this.court : 'judge/' + this.judge)
                + '/decisions'
            );
            let params   = {};
            if (this.page > 1) {
                params['offset'] = this.page * 30;
            }
            url.search = new URLSearchParams(params);
            fetch(url).then(r => {
                if (!r.ok) {
                    return null
                }
                return r.json()
            }).then(r => {
                this.loading = false;
                if (r === null) {
                    this.error = 'Произошла ошибка'
                    return;
                }
                let prop = this.court ? 'house' : 'judge';
                if (this.page > 1) {
                    this.decisions = this.decisions.concat(r[prop]['decisions']);
                } else {
                    this.total     = r[prop]['aggregate']['data']['count'];
                    this.decisions = r[prop]['decisions'];
                    if (r[prop]['fines']['aggregate']['sum']['amount']) {
                        this.fines = r[prop]['fines']['aggregate']['sum']['amount'];
                    }
                    if (r[prop]['fines']['aggregate']['sum']['amount_rub']) {
                        this.fines_rub = r[prop]['fines']['aggregate']['sum']['amount_rub'];
                    }
                    if (r[prop]['arrests']['aggregate']['sum']['amount']) {
                        this.arrests = r[prop]['arrests']['aggregate']['sum']['amount'];
                    }
                }
            })
        }
    }
})
</script>
<style>
.zbr-table {
    --el-color-primary: #ff5c01;
    --el-button-hover-bg-color: rgba(255,92,1,0.3);
}
</style>


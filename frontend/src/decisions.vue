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
                    <td class="txt-nowrap">
                        <div v-if="decision.category !== 'criminal'">
                            <div v-for="(article, index) in decision.articles" :key="index">
                                <template v-if="index !== decision.articles.length && index !== 0">,</template>
                                <el-popover width="300" :content="format(decision, article)"
                                            placement="bottom">
                                    <template #reference>
                                        <el-button type="primary"
                                                   circle
                                                   icon="el-icon-question"
                                                   size="mini"></el-button>
                                    </template>
                                </el-popover>
                                <span v-if="hashes[article]" v-text="hashes[article].split(' - ')[0]"
                                      style="padding-left: 3px"></span>
                                <span style="padding-left: 3px" v-else>{{ article }}</span>
                            </div>
                        </div>
                        <div v-else>
                            <span v-for="(article, index) in decision.articles" :key="index">
                                <template
                                    v-if="index !== decision.articles.length && index !== 0">,</template>
                                {{ article }}
                            </span>
                        </div>
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
import {ElPopover, ElButton, ElImage, ElLoading} from 'element-plus'
import articlesHashes from './../../data/articles.json'
import {defineComponent} from "vue";

export default defineComponent({
    name: 'decisions',
    components: {
        ElPopover,
        ElImage,
        ElButton,
    },
    data() {
        return {
            decisions: [],
            arrests: 0,
            fines: 0,
            fines_rub: 0,
            filter: '',
            total: 0,
            error: '',
            page: 1,
            current: null,
            loading: false,
            hashes: articlesHashes,
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
    directives: {
        loading: ElLoading.directive
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
            let text = articlesHashes[article] ? articlesHashes[article] : article;
            if (!text.includes(' - ')) {
                return article;
            }
            return text.split(' - ')[1].replace(/"/g, '');
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

@font-face {
    font-family: element-icons;
    src: url(/fonts/element-icons.woff) format("woff"), url(/fonts/element-icons.ttf) format("truetype");
    font-weight: 400;
    font-display: "auto";
    font-style: normal
}

[class*=" el-icon-"], [class^=el-icon-] {
    font-family: element-icons !important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}

.el-icon-ice-cream-round:before {
    content: ""
}


.el-icon-question:before {
    content: ""
}


.el-icon-eleme:before {
    content: ""
}

.el-icon-platform-eleme:before {
    content: ""
}

.el-icon-loading {
    -webkit-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite
}

.el-icon--right {
    margin-left: 5px
}

.el-icon--left {
    margin-right: 5px
}

@-webkit-keyframes rotating {
    0% {
        -webkit-transform: rotateZ(0);
        transform: rotateZ(0)
    }
    100% {
        -webkit-transform: rotateZ(360deg);
        transform: rotateZ(360deg)
    }
}

@keyframes rotating {
    0% {
        -webkit-transform: rotateZ(0);
        transform: rotateZ(0)
    }
    100% {
        -webkit-transform: rotateZ(360deg);
        transform: rotateZ(360deg)
    }
}

</style>


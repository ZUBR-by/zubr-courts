<template>
    <div class="calendar" v-loading="this.loading">
        <h4 v-if="initialRegion">Расписание слушаний по области:</h4>
        <div class="pdng-b-20px">
            <label style="float: left;padding-top: 14px;padding-right: 5px">Выберите дату:</label>
            <datepicker v-model="date"
                        class="input"
                        :locale="locale" style="width: 140px"></datepicker>
        </div>

        <el-timeline v-if="trials.length > 0">
            <el-timeline-item v-for="trial of trials" :key="trial.id">
                <el-card>
                    <h4>{{ trial.timestampFormatted }}
                        <template v-if="trial.court">
                            - <a :href="'/court/' + trial.court.id">
                            {{ trial.court.name }}
                        </a>
                        </template>
                    </h4>
                    <p>{{ trial.person }}</p>
                    <template v-if="trial.judge">
                        <span>Судья: {{ trial.judge.fullName }}</span>
                    </template>
                    <span style="word-wrap: break-word;" v-if="trial.comment">
                        {{ trial.comment}}
                    </span>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <el-card v-else>
            {{ loading ? 'Загрузка...' : 'Нет информации о заседаниях на этот день' }}
        </el-card>
    </div>

</template>

<script>
import {defineComponent}                               from "vue";
import {ElTimeline, ElCard, ElTimelineItem, ElLoading} from 'element-plus'
import datepicker                                      from 'vue3-datepicker'
import locale                                          from 'date-fns/locale/ru'

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

export default defineComponent({
    name      : "trials",
    props     : {
        initialRegion: {
            type: String
        },
        initialCourt : {
            type: String
        }
    },
    directives: {
        loading: ElLoading.directive
    },
    methods   : {
        changeRegion(regionCode) {
            this.region = regionCode;
        },
        fetchData() {
            this.loading = true;
            let url      = new URL(
                import.meta.env.VITE_API_URL + '/trial'
            );
            let datetime = this.date
                ? new Date( this.date.getTime() - this.date.getTimezoneOffset() * 60000 ).toISOString().split('T')[0]
                : null;
            let params   = {
                'court.id'         : this.court ? this.court : this.region,
                'timestamp[after]' : datetime ? datetime + ' 00:00:00' : '',
                'timestamp[before]': datetime ? datetime + ' 23:59:00' : '',
                'sort[timestamp]'  : 'asc'
            }
            url.search   = new URLSearchParams(params);

            fetch(url)
                .then(r => r.json())
                .then(r => {

                    this.trials = r['hydra:member']
                }).finally(() => {
                this.loading = false;
            });
        }
    },
    components: {
        ElCard,
        ElTimeline,
        ElTimelineItem,
        datepicker
    },
    mounted() {
        this.fetchData()
    },
    watch     : {
        region() {
            this.fetchData()
        },
        date() {
            this.fetchData()
        }
    },
    data() {
        return {
            locale,
            region : this.initialRegion,
            court  : this.initialCourt,
            date   : new Date(),
            trials : [],
            loading: false
        };
    }
})
</script>

<style>
.calendar {
    --vdp-hover-bg-color: #FF5C01;
    --vdp-selected-bg-color: #FF5C01;
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

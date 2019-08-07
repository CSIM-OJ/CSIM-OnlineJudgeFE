<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row>
    <el-col :span="20" :offset="2" class="box">
      <h1 class="course-title">{{ this.$store.state.course.courseInfo.courseName }}
        <span class="course-semester">{{ this.$store.state.course.courseInfo.semester }}</span>
      </h1>
      <section id="mainProblems-section">
        <div class="undo-problems">
          <div class="items-nav">
            <div class="item">可作答</div>
            <i class="fas fa-pencil-alt"></i> {{ undoNum }}
            <el-select class="select-custom" v-model="undoSelectValue" placeholder="選擇類型" @change="undoChange">
              <el-option v-for="item in studIndexProblemType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select class="select-custom" v-model="undoSortValue" placeholder="排序方式" @change="undoSortChange" clearable @clear="undoSortClear" style="margin-right: 10px;">
              <el-option label="難易度" value="rate"></el-option>
              <el-option label="繳交期限" value="deadline"></el-option>
            </el-select>
          </div>
          <el-row>
            <el-col class="undoCol" :span="24" v-loading="undoLoading">
              <el-carousel :autoplay="false" :loop="false" :height="undoCarHeight" ref="undoCarousel" @change="undoCarChange">
                <el-carousel-item v-for="index in undoCarItemNum" :key="index" :name="'car'+index">
                  <transition-group name="slide-fade">
                    <el-col v-for="problem in undoProblemsFiltered.slice((index-1)*20, (index-1)*20+20)" :xs="24" :sm="12" :md="8" :lg="6" :key="problem.problemId" style="padding-right: 23px;">
                      <a href="javascript:void(0);" @click="doProblem(problem.problemId)">
                        <el-card :body-style="{ padding: '5px' }" shadow="hover">
                          <div style="padding: 14px;">
                            <span class="title ellipsis">{{ problem.name }}
                              <el-tooltip class="item" effect="dark" :content="'繳交期限: '+problem.deadline" placement="top"><i class="el-icon-time time"></i></el-tooltip>
                            </span>
                            <div class="bottom clearfix">
                              <el-rate disabled :value="parseInt(problem.rate)"></el-rate>
                              <Countdown v-if="dateDiff(todayDate, problem.deadline)<1" :deadline="deadlineParse(problem.deadline)"></Countdown>
                              <el-button v-if="dateDiff(todayDate, problem.deadline)>=1" type="text" class="button"><a href="javascript:void(0);" @click="doProblem(problem.problemId)">來去做題</a></el-button>
                            </div>
                            <div class="type">{{ problem.type }}</div>
                          </div>
                        </el-card>
                      </a>
                    </el-col>
                  </transition-group>
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </div>
        <div class="done-problems">
          <div class="items-nav">
            <div class="item">已作答</div>
            <i class="fas fa-paperclip"></i> {{ doneNum }}
            <el-select class="select-custom" v-model="doneSelectValue" placeholder="選擇類型" @change="doneChange">
              <el-option v-for="item in studIndexProblemType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select class="select-custom" v-model="doneSortValue" placeholder="排序方式" @change="doneSortChange" clearable @clear="doneSortClear" style="margin-right: 10px;">
              <el-option label="難易度" value="rate"></el-option>
              <el-option label="繳交日期" value="handDate"></el-option>
            </el-select>
          </div>
          <el-row>
            <el-col class="doneCol" :span="24" v-loading="doneLoading">
              <el-carousel :autoplay="false" :loop="false" :height="doneCarHeight" ref="doneCarousel" @change="doneCarChange">
                <el-carousel-item v-for="index in doneCarItemNum" :key="index" :name="'car'+index">
                  <transition-group name="slide-fade">
                    <el-col v-for="problem in doneProblemsFiltered.slice((index-1)*20, (index-1)*20+20)" :xs="24" :sm="12" :md="8" :lg="6" :key="problem.problemId" style="padding-right: 23px;">
                      <a href="javascript:void(0);" @click="doProblem(problem.problemId)">
                        <el-card :body-style="{ padding: '5px' }" shadow="hover">
                          <div style="padding: 14px;">
                            <span class="title ellipsis">{{ problem.name }}
                              <el-tooltip class="item" effect="dark" :content="'繳交期限: '+problem.deadline" placement="top"><i class="el-icon-time time"></i></el-tooltip>
                            </span>
                            <div class="bottom clearfix">
                              <el-rate disabled :value="parseInt(problem.rate)"></el-rate>
                              <Countdown v-if="dateDiff(todayDate, problem.deadline)<1" :deadline="deadlineParse(problem.deadline)"></Countdown>
                              <el-button v-if="dateDiff(todayDate, problem.deadline)>=1" type="text" class="button"><a href="javascript:void(0);" @click="doProblem(problem.problemId)">來去做題</a></el-button>
                            </div>
                            <div class="type">{{ problem.type }}</div>
                          </div>
                        </el-card>
                      </a>
                    </el-col>
                  </transition-group>
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </div>
      </section>
    </el-col>
  </el-row>
  <fab-rank></fab-rank>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import {studentCheckLogin} from '@/apis/_checkLogin.js'
import {apiProblemInfo} from '@/apis/student.js'

import Countdown from 'vuejs-countdown'
import DateUtil from '@/utils/DateUtil.js'
import problemStateMixin from '@/mixins/problemState.mixin.js'

import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'
import FabRank from '@/components/FabRank.vue'

import '@/assets/css/student-index.css'
import '@/assets/css/transition.css'

export default {
  components: {
    NavHeaderStudent,
    NavFooter,
    Countdown,
    FabRank
  },
  mixins: [problemStateMixin],
  data() {
    return {
      // select
      undoSelectValue: '',
      doneSelectValue: '',
      // sort
      undoProblemsStarFilter: false,
      undoProblemshandDateFilter: false,
      undoSortValue: '',
      doneProblemsStarFilter: false,
      doneProblemshandDateFilter: false,
      doneSortValue: '',
      // main
      undoProblems: [],
      doneProblems: [],
      // loading
      undoLoading: false,
      doneLoading: false,
      // carousel
      undoCarShowIndex: 0,
      doneCarShowIndex: 0
    }
  },
  computed: {
    // panel
    undoNum() {
      return this.undoProblems.length;
    },
    doneNum() {
      return this.doneProblems.length;
    },
    // problems
    undoProblemsFiltered() {
      let undoProblems = this.undoProblems;

      if(undoProblems.length === 0) {
        return undoProblems
      } else {
        if (this.undoProblemsStarFilter == true) {
          let rateList = undoProblems.sort((a, b) => {
            return a.rate > b.rate ? 1 : -1;
          });
          return rateList
        } else if (this.undoProblemshandDateFilter == true) {
          let deadlineList = undoProblems.sort((a, b) => {
            return (Date.parse(a.deadline)).valueOf() > (Date.parse(b.deadline)).valueOf() ? 1 : -1;
          });
          return deadlineList
        } else {
          return undoProblems
        }
      }
    },
    doneProblemsFiltered() {
      let doneProblems = this.doneProblems;

      if(doneProblems.length == 0) {
        return doneProblems
      } else {
        if (this.doneProblemsStarFilter == true) {
          let rateList = doneProblems.sort((a, b) => {
            return a.rate > b.rate ? 1 : -1;
          });
          return rateList
        } else if (this.doneProblemshandDateFilter == true) {
          let handDateList = doneProblems.sort((a, b) => {
            return (Date.parse(a.handDate)).valueOf() > (Date.parse(b.handDate)).valueOf() ? 1 : -1;
          });
          return handDateList
        } else {
          return doneProblems
        }
      }
    },
    todayDate() {
      return DateUtil.getTodayDate()
    },
    // carousel
    undoCarItemNum() {
      return Math.ceil(this.undoProblems.length/20);
    },
    undoCarHeight() {
      let page = this.undoCarShowIndex+1;
      let carItemNum = Math.ceil(this.undoProblems.length/20);
      let vh = window.screen.width*12/100; // 每個格子的高度

      if (page<carItemNum) {
        return 5*(vh+28)+'px';
      } else {
        let last = this.undoProblems.length%20;
        let h = Math.ceil(last/4);
        return h*(vh+28)+'px';
      }
    },
    doneCarItemNum() {
      return Math.ceil(this.doneProblems.length/20);
    },
    doneCarHeight() {
      let page = this.doneCarShowIndex+1;
      let carItemNum = Math.ceil(this.doneProblems.length/20);
      let vh = window.screen.width*12/100; // 每個格子的高度

      if (page<carItemNum) {
        console.log(5*(vh+28)+'px');
        return 5*(vh+28)+'px';
      } else {
        let last = this.doneProblems.length%20;
        let h = Math.ceil(last/4);
        return h*(vh+28)+'px';
      }
    }
  },
  mounted() {
    studentCheckLogin();
    this.initUndoProblems();
    this.initDoneProblems();
  },
  methods: {
    initUndoProblems() {
      this.undoLoading = true;

      apiProblemInfo({
        courseId: this.$store.state.course.courseInfo.courseId,
        type: '全部',
        isJudge: false
      }).then((response) => {
        let res = response.data;
        if (res.status=='200') {
          this.undoLoading = false;
          this.undoProblems = res.result;
        }
      });
    },
    initDoneProblems() {
      this.doneLoading = true;

      apiProblemInfo({
        courseId: this.$store.state.course.courseInfo.courseId,
        type: '全部',
        isJudge: true
      }).then((response) => {
        let res = response.data;
        if (res.status=='200') {
          this.doneLoading = false;
          this.doneProblems = res.result;
        }
      });
    },
    // select
    undoChange(val) {
      if (val == '全部') {
        this.initUndoProblems();
      } else {
        this.undoLoading = true;

        apiProblemInfo({
          courseId: this.$store.state.course.courseInfo.courseId,
          type: val,
          isJudge: false
        }).then((response) => {
          let res = response.data;
          if (res.status=='200') {
            this.undoLoading = false;
            this.undoProblems = res.result;
          }
        });
      }
    },
    doneChange(val) {
      if (val == '全部') {
        this.initDoneProblems();
      } else {
        this.doneLoading = true;

        apiProblemInfo({
          courseId: this.$store.state.course.courseInfo.courseId,
          type: val,
          isJudge: true
        }).then((response) => {
          let res = response.data;
          if (res.status=='200') {
            this.doneLoading = false;
            this.doneProblems = res.result;
          }
        });
      }
    },
    // sort
    undoSortChange(val) {
      if (val == 'rate') {
        this.undoProblemsStarFilter = true;
        this.undoProblemshandDateFilter = false;
        this.undoSortValue = '難易度';
      } else if (val == 'deadline') {
        this.undoProblemsStarFilter = false;
        this.undoProblemshandDateFilter = true;
        this.undoSortValue = '繳交期限';
      }
    },
    undoSortClear() {
      this.undoProblemsStarFilter = false;
      this.undoProblemshandDateFilter = false;

      if (this.undoSelectValue == '') {
        this.undoChange('全部');
      } else if (this.undoSelectValue == '作業') {
        this.undoChange('作業');
      } else if (this.undoSelectValue == 'practice') {
        this.undoChange('practice');
      } else {
        this.undoChange('all');
      }
    },
    doneSortChange(val) {
      if (val == 'rate') {
        this.doneProblemsStarFilter = true;
        this.doneProblemshandDateFilter = false;
        this.doneSortValue = '難易度';
      } else if (val == 'handDate') {
        this.doneProblemsStarFilter = false;
        this.doneProblemshandDateFilter = true;
        this.doneSortValue = '繳交日期';
      }
    },
    doneSortClear() {
      this.doneProblemsStarFilter = false;
      this.doneProblemshandDateFilter = false;

      if (this.doneSelectValue == 'all') {
        this.doneChange('all');
      } else if (this.doneSelectValue == 'homework') {
        this.doneChange('homework');
      } else if (this.doneSelectValue == 'practice') {
        this.doneChange('practice');
      } else {
        this.doneChange('all');
      }
    },
    // go to problem
    doProblem(problemId) {
      this.$router.push('/student/'+ this.$store.state.course.courseInfo.courseName +'/coding?problemId=' + problemId);
    },
    // 兩日期天數差
    dateDiff(sDate1, sDate2) {
      return DateUtil.dateDiff(sDate1, sDate2)
    },
    // 把deadline+1天
    deadlineParse(deadline) {
      return DateUtil.nextDayDate(deadline)
    },
    // carousel
    undoCarChange(index) {
      this.undoCarShowIndex = index;
    },
    doneCarChange(index) {
      this.doneCarShowIndex = index;
    }
  }
}
</script>

<style>
.select-custom {
  width: 100px !important;
  margin: 0px;
}

.select-custom .el-input__inner {
  border: 0px !important;
}

.select-custom .el-input {
  width: 105px;
}

/* count down */

.el-card .vuejs-countdown {
  position: absolute;
  bottom: 18px;
  right: 15px;
}

.vuejs-countdown li::after {
  font-size: 10px !important;
  color: #F56C6C;
  margin-right: 0px;
}

.vuejs-countdown p.digit {
  font-size: 10px;
  color: #F56C6C;
}

.vuejs-countdown p.text {
  font-size: 10px;
  color: #F56C6C;
  transform: scale(.7);
}
</style>

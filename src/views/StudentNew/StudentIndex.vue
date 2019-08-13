<template>
<div>
<el-container>
  <el-header>
    <nav-header-student></nav-header-student>
  </el-header>

  <el-container style="height: calc(100vh - 60px); overflow: initial;">
    <el-aside width="200px" style="height: calc(100vh - 60px); overflow: initial;">
      <side-nav-student></side-nav-student>
    </el-aside>

    <el-container style="height: calc(100vh - 60px); overflow: initial;" id="studentIndex-section">
      <el-row class="header">
        <el-col :span="24">
          <div class="left-action-bar" style="display:inline-block;">
            <el-select v-model="modeValue" @change="changeMode">
              <el-option label="可作答" value="cando"></el-option>
              <el-option label="未作答" value="undo"></el-option>
            </el-select>
            <el-input v-model="nameFilterValue" class="filterInput" placeholder='請輸入題目名稱' clearable style=""><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
          </div>
          <div class="right-action-bar" style="float: right;">
            <el-button type="primary" plain icon="el-icon-s-operation" size="small" style="margin-top:8px;" @click="showFilterSection">filter</el-button>
          </div>

          <transition name="el-zoom-in-top" @leave="leaveTransition">
            <el-row class="filter-section" v-if="isFilterShow">
              <el-col :span="8" class="item">
                <span class="item-title">題目標籤</span>
                <el-select v-model="problemTagValue" multiple filterable allow-create default-first-option style="width:80%;">
                  <el-option-group
                    v-for="group in quesTagOptions"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-col>
              <el-col :span="8" class="item">
                <span class="item-title">選擇題型</span>
                <el-select v-model="typeValue" style="width:80%;">
                  <el-option v-for="item in studIndexProblemType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8" class="item">
                <span class="item-title">排序方式</span>
                <el-select v-model="sortValue" clearable style="width:80%;">
                  <el-option label="難易度" value="rate"></el-option>
                  <el-option label="繳交期限" value="deadline"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </transition>
        </el-col>
      </el-row>

      <el-main style="padding-top: 0px;">
        <el-row class="problem-card-section">
          <el-col class="problemCol" :span="24" v-loading="problemSectionLoading">
            <el-col v-for="problem in problemsFiltered" :key="problem.problemId" :xs="24" :sm="12" :md="8" :lg="6" style="padding-right: 23px;">
              <a href="javascript:void(0);" @click="doProblem(problem.problemId)">
                <el-card :body-style="{ padding: '5px' }" shadow="hover">
                  <div style="padding: 14px;">
                    <span class="title ellipsis">{{ problem.name }}
                      {{problem.tag}}
                      <!-- TODO: tag -->
                      <!-- <el-tag v-for="(tag, index) in problem.tag" :key="index" effect="plain" style="height:16px; line-height:16px; padding:0 3px; font-size:10px; margin-left:5px;">{{tag}}</el-tag> -->
                      <el-tag effect="plain" style="height:16px; line-height:16px; padding:0 3px; font-size:10px; margin-left:5px;">Java</el-tag>
                    </span>
                    <div class="bottom clearfix">
                      <el-rate disabled :value="parseInt(problem.rate)"></el-rate>
                      <Countdown v-if="dateDiff(todayDate, problem.deadline)<1" :deadline="deadlineParse(problem.deadline)"></Countdown>
                      <div v-if="dateDiff(todayDate, problem.deadline)>=1" class="time">{{ problem.deadline }}</div>
                    </div>
                    <div class="type">{{ problem.type }}</div>
                  </div>
                </el-card>
              </a>
            </el-col>
          </el-col>
        </el-row>
      </el-main>
      <el-footer><p style="text-align:center; background-color:#f5f5f5; color:rgba(0, 0, 0, 0.87);">penguin coco @ 2019</p></el-footer>
    </el-container>
    
  </el-container>
</el-container>
</div>
</template>

<script>
import {apiProblemInfo} from '@/apis/student.js'

import Countdown from 'vuejs-countdown'
import DateUtil from '@/utils/DateUtil.js'
import problemStateMixin from '@/mixins/problemState.mixin.js'

import NavHeaderStudent from '@/components/student/NavHeaderStudent.vue'
import SideNavStudent from '@/components/student/SideNavStudent.vue'
import NavFooter from '@/components/NavFooter.vue'

export default {
  components: {
    NavHeaderStudent,
    SideNavStudent,
    NavFooter,
    Countdown
  },
  mixins: [problemStateMixin],
  mounted() {
    this.getProblemData();
  },
  data() {
    return {
      // 可作答&已作答 selector
      modeValue: 'cando',
      nameFilterValue: '', // 題目id或題目名稱搜索
      // filter-section(filter題目的區塊)
      isFilterShow: false,
      problemTagValue: [], // 題目標籤
      typeValue: '全部',
      sortValue: '',
      // problem card section
      problemSectionLoading: true,
      problemData: [],
    }
  },
  computed: {
    problemsFiltered() {
      let problemData = this.problemData;

      // 過濾輸入題目名稱
      if (this.nameFilterValue == '' ) {
        // pass
      } else {
        let filteredTable = [];
        for (let i = 0; i < problemData.length; i++) {
          if (problemData[i].name.includes(this.nameFilterValue)) {
            filteredTable.push(problemData[i]);
          }
        }
        return filteredTable; // 題目名稱的過濾最優先return
      }

      // TODO: 過濾tag
      if (this.problemTagValue.length==0) {
        // pass
      } else {
        for (let i=0; i<problemData.length; i++) {
          // or關係
          let filteredTable = [];
          let theSet = new Set(problemData[i].tag); // 此題tag的set
          let intersect = this.problemTagValue.filter(x => theSet.has(x)); // problemTagValue與theSet的交集
          if (intersect.length > 0) {
            filteredTable.push(oriTable[i]);
          }
        }
        this.problemData = filteredTable;
      }

      // 過濾題目類型(type)
      if (this.typeValue == '全部') {
        // pass
      } else {
        let templist = [];
        problemData.forEach((item) => {
          if (item.type == this.typeValue) templist.push(item);
        });
        problemData = templist;
      }

      // 過濾排序方式
      if (this.sortValue == '') {
        // pass
      } else if (this.sortValue == '難易度') {
        let rateList = problemData.sort((a, b) => {
          return a.rate > b.rate ? 1 : -1;
        });
        problemData = rateList;
      } else if (this.sortValue == '繳交日期') {
        let deadlineList = problemData.sort((a, b) => {
          return (Date.parse(a.deadline)).valueOf() > (Date.parse(b.deadline)).valueOf() ? 1 : -1;
        });
        problemData = rateList;
      }
          
      return problemData;
    },
    todayDate() {
      return DateUtil.getTodayDate()
    },
  },
  methods: {
    getProblemData() {
      let isJudge = false;
      if (this.modeValue == 'cando') {
        isJudge = false;
      } else if (this.modeValue == 'undo') {
        isJudge = true;
      }

      this.problemSectionLoading = true;
      apiProblemInfo({
        courseId: this.$store.state.course.courseInfo.courseId,
        type: this.typeValue,
        isJudge: isJudge
      }).then((response) => {
        let res = response.data;
        if (res.status=='200') {
          this.problemSectionLoading = false;
          this.problemData = res.result;
        }
      });
    },
    // header mode
    changeMode() {
      this.getProblemData();
    },
    // filter-section
    leaveTransition(el, done) { // leave transition
      done();
    },
    showFilterSection() {
      this.isFilterShow = !this.isFilterShow;
    },
    // problem card section
    dateDiff(sDate1, sDate2) { // 兩日期天數差
      return DateUtil.dateDiff(sDate1, sDate2)
    },
    deadlineParse(deadline) { // 把deadline+1天
      return DateUtil.nextDayDate(deadline)
    },
  }
}
</script>

<style>
#studentIndex-section .header {
  padding: 20px;
  padding-bottom: 0px;
}

#studentIndex-section .header .course-name {
  font-size: 30px;
  color: #3F51B5;
}

#studentIndex-section .header .left-action-bar {
  height: 60px;
}

#studentIndex-section .header .left-action-bar .el-select {
  width: 110px;
  margin-right: 20px;
}

#studentIndex-section .header .left-action-bar .el-select .el-input { 
  font-size: 25px;
}

#studentIndex-section .header .left-action-bar .el-select .el-input__inner {
  border: rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
  color: #1565C0;
  padding-left: 0px;
}

#studentIndex-section .header .left-action-bar .filterInput {
  width: 250px;
}

#studentIndex-section .header .left-action-bar .filterInput .el-input__inner {
  border: rgba(0,0,0,0);
  background-color: #EFF0F3;
  color: #909399;
}

/* #studentIndex-section .header .right-action-bar .el-select {
  width: 100px !important;
  margin-top: 7px;
  margin-left: 20px;
}

#studentIndex-section .header .right-action-bar .el-input {
  width: 110px;
  font-size: 16px;
}

#studentIndex-section .header .right-action-bar .el-input .el-input__inner {
  border: 0px !important;
  background-color: rgba(0,0,0,0);
} */

#studentIndex-section .header .filter-section {
  background-color: white;
  border-radius: 5px;
  margin-bottom: 18px;
}

#studentIndex-section .header .filter-section .item {
  padding-top:20px;
  padding-left:20px;
}

#studentIndex-section .header .filter-section .item .item-title {
  display:block;
  font-size:14px;
  color:#909399;
  margin-bottom: 10px;
}

/* mainProblems-section */

#studentIndex-section .problem-card-section .el-col {
  padding-bottom: 30px;
}

#studentIndex-section .problem-card-section .count-label {
  color: #909399;
  height: 52px;
  padding-left: 20px !important;
  padding-bottom: 0px;
  line-height: 52px;
}

/* problem col */
#studentIndex-section .problem-card-section .el-loading-mask {
  background-color: rgba(0, 0, 0, 0);
}

#studentIndex-section .problem-card-section .problemCol {
  min-height: 200px;
}

#studentIndex-section .problem-card-section .problemCol a {
  min-height: 200px;
  text-decoration: none;
}

/* problem cards */

#studentIndex-section .problem-card-section .el-card {
  height: 9vw;
  position: relative;
  transition: all ease 0.3s;
}

#studentIndex-section .problem-card-section .el-card .title {
  height: 22px;
  line-height: 22px;
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  outline: none;
}

#studentIndex-section .problem-card-section .el-card .time {
  position: absolute;
  right: 15px;
  bottom: 19px;
  color: #888888;
  font-size: 10px;
}

#studentIndex-section .problem-card-section .el-card button {
  position: absolute;
  bottom: 5px;
  right: 15px;
}

#studentIndex-section .problem-card-section .el-card .type {
  position: absolute;
  bottom: 19px;
  left: 20px;
  color: #888888;
  font-size: 12px;
}

#studentIndex-section .problem-card-section .el-card .button a {
  text-decoration: none;
  color: #409EFF;
}

/* count down */

#studentIndex-section .problem-card-section .el-card .vuejs-countdown {
  position: absolute;
  bottom: 10px;
  right: 15px;
}

#studentIndex-section .problem-card-section .el-card .vuejs-countdown li::after {
  font-size: 10px !important;
  color: #F56C6C;
  margin-right: 0px;
}

#studentIndex-section .problem-card-section .el-card .vuejs-countdown p.digit {
  font-size: 10px;
  color: #F56C6C;
}

#studentIndex-section .problem-card-section .el-card .vuejs-countdown p.text {
  font-size: 10px;
  color: #F56C6C;
  transform: scale(.7);
}

</style>
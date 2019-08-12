<template>
<div>
<el-container>
  <el-header>
    <navbar @onChangeMenuCollapse="onChangeMenuCollapse"></navbar>
  </el-header>

  <el-container style="height: calc(100vh - 60px); overflow: initial;">
    <el-aside width="200px" style="height: calc(100vh - 60px); overflow: initial;">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" style="height: calc(100vh - 60px); overflow: initial;">
        <el-menu-item index="1">
          <i class="el-icon-location"></i>
            <span slot="title">課程列表</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">題目列表</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">成績面板</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">個人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container style="height: calc(100vh - 60px); overflow: initial;">
      <el-main>
        <el-row>
          <el-col :span="24" id="newStudentIndex-section">
            <div class="header">
              <div class="left-action-bar" style="display:inline-block;">
                <el-select value="可作答" placeholder="">
                  <el-option key="0" label="可作答"></el-option>
                  <el-option key="1" label="未作答"></el-option>
                </el-select>
                <el-input v-model='filterQuery' placeholder='請輸入題目ID或名稱' clearable style="width:200px;"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
              </div>
              

              <div class="right-action-bar" style="float: right;">
                <el-select v-model="undoSelectValue" placeholder="選擇類型" @change="undoChange">
                  <el-option v-for="item in studIndexProblemType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="undoSortValue" placeholder="排序方式" @change="undoSortChange" clearable @clear="undoSortClear" style="margin-right: 10px;">
                  <el-option label="難易度" value="rate"></el-option>
                  <el-option label="繳交期限" value="deadline"></el-option>
                </el-select>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row id="mainProblems-section">
          <el-col class="undoCol" :span="24" v-loading="undoLoading">
            
              <el-col :xs="24" :sm="12" :md="8" :lg="5" style="padding-right: 23px;">
                <a href="javascript:void(0);" @click="doProblem(problem.problemId)">
                  <el-card :body-style="{ padding: '5px' }" shadow="hover">
                    <div style="padding: 14px;">
                      <span class="title ellipsis">考古題
                        <el-tooltip class="item" effect="dark" content="'繳交期限: '" placement="top"><i class="el-icon-time time"></i></el-tooltip>
                      </span>
                      <div class="bottom clearfix">
                        <el-rate disabled value="4"></el-rate>
                        <!-- <Countdown :deadline="deadlineParse(problem.deadline)"></Countdown> -->
                        <el-button type="text" class="button"><a href="javascript:void(0);" @click="doProblem(problem.problemId)">來去做題</a></el-button>
                      </div>
                      <div class="type">討論題</div>
                    </div>
                  </el-card>
                </a>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8" :lg="5" style="padding-right: 23px;">
                <a href="javascript:void(0);" @click="doProblem(problem.problemId)">
                  <el-card :body-style="{ padding: '5px' }" shadow="hover">
                    <div style="padding: 14px;">
                      <span class="title ellipsis">程式設計討論
                        <el-tooltip class="item" effect="dark" content="'繳交期限: '" placement="top"><i class="el-icon-time time"></i></el-tooltip>
                      </span>
                      <div class="bottom clearfix">
                        <el-rate disabled value="4"></el-rate>
                        <!-- <Countdown :deadline="deadlineParse(problem.deadline)"></Countdown> -->
                        <el-button type="text" class="button"><a href="javascript:void(0);" @click="doProblem(problem.problemId)">來去做題</a></el-button>
                      </div>
                      <div class="type">討論題</div>
                    </div>
                  </el-card>
                </a>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8" :lg="5" style="padding-right: 23px;">
                <a href="javascript:void(0);" @click="doProblem(problem.problemId)">
                  <el-card :body-style="{ padding: '5px' }" shadow="hover">
                    <div style="padding: 14px;">
                      <span class="title ellipsis">油價計算
                        <el-tooltip class="item" effect="dark" content="'繳交期限: '" placement="top"><i class="el-icon-time time"></i></el-tooltip>
                      </span>
                      <div class="bottom clearfix">
                        <el-rate disabled value="4"></el-rate>
                        <!-- <Countdown :deadline="deadlineParse(problem.deadline)"></Countdown> -->
                        <el-button type="text" class="button"><a href="javascript:void(0);" @click="doProblem(problem.problemId)">來去做題</a></el-button>
                      </div>
                      <div class="type">討論題</div>
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



  
  <!-- <nav-header-student></nav-header-student> -->
  
</div>
</template>

<script>
import {apiProblemInfo} from '@/apis/student.js'

import problemStateMixin from '@/mixins/problemState.mixin.js'

import NavHeaderStudent from '@/components/student/NavHeaderStudent.vue'
import navbar from '@/views/StudentNew/navbar'
import NavFooter from '@/components/NavFooter.vue'

export default {
  components: {
    NavHeaderStudent,
    navbar,
    NavFooter
  },
  mixins: [problemStateMixin],
  mounted() {
    this.getUndoProblemData();
  },
  data() {
    return {
      // select
      undoSelectValue: '',
      doneSelectValue: '',
      // table
      tableLoading: false,
      undoProblems: [],
    }
  },
  computed: {
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
  },
  methods: {
    getUndoProblemData() {
      this.tableLoading = true;
      apiProblemInfo({
        courseId: this.$store.state.course.courseInfo.courseId,
        type: '全部',
        isJudge: false
      }).then((response) => {
        let res = response.data;
        if (res.status=='200') {
          this.tableLoading = false;
          this.undoProblems = res.result;
        }
      });
    },
  }
}
</script>

<style>
#newStudentIndex-section .header {
  margin-bottom: 10px;
}

#newStudentIndex-section .header .course-name {
  font-size: 30px;
  color: #3F51B5;
}

/* #newStudentIndex-section .header .el-tabs__item {
  font-size: 18px;
}

#newStudentIndex-section .header .el-tabs__active-bar.is-top {
  width: 54px;
} */

#newStudentIndex-section .header .left-action-bar .el-select {
  width: 130px;
}

#newStudentIndex-section .header .left-action-bar .el-select .el-input { 
  font-size: 25px;
}

#newStudentIndex-section .header .left-action-bar .el-select .el-input__inner {
  border: rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
  color: #1565C0;
  padding-left: 0px;
}

#newStudentIndex-section .header .right-action-bar .el-select{
  width: 100px !important;
  margin-top: 7px;
  margin-left: 20px;
}

#newStudentIndex-section .header .right-action-bar .el-input .el-input__inner {
  border: 0px !important;
  background-color: rgba(0,0,0,0);
}

#newStudentIndex-section .header .right-action-bar .el-input {
  width: 110px;
  font-size: 16px;
}


</style>
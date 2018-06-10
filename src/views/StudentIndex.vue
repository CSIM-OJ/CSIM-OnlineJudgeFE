<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row>
    <el-col :span="20" :offset="2" class="box">
      <section id="mainProblems-section">
        <div class="undo-problems">
          <div class="items-nav">
            <div class="item">可作答</div>
            <i class="fas fa-pencil-alt"></i> {{ undoNum }}
            <el-select v-model="undoSelectValue" placeholder="選擇類型" @change="undoChange">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="undoSortValue" placeholder="排序方式" @change="undoSortChange" clearable @clear="undoSortClear" style="margin-right: 10px;">
              <el-option label="難易度" value="rate"></el-option>
              <el-option label="繳交期限" value="deadline"></el-option>
            </el-select>
          </div>
          <el-row>
            <el-col class="undoCol" :span="24" v-loading="undoLoading">
              <transition-group name="slide-fade">
                <el-col v-for="problem in undoProblemsFiltered" :xs="24" :sm="12" :md="6" :key="problem.problemID" style="padding-right: 23px;">
                  <a href="javascript:void(0);" @click="doProblem(problem.problemID)">
                    <el-card :body-style="{ padding: '5px' }">
                      <div style="padding: 14px;">
                        <span class="title ellipsis">{{ problem.name }}
                          <el-tooltip class="item" effect="dark" :content="'繳交期限: '+problem.deadline" placement="top"><i class="el-icon-time time"></i></el-tooltip>
                        </span>
                        <div class="bottom clearfix">
                          <el-rate disabled v-model="problem.rate"></el-rate>
                          <el-button type="text" class="button"><a href="javascript:void(0);" @click="doProblem(problem.problemID)">來去做題</a></el-button>
                        </div>
                        <div class="type">{{ problem.type }}</div>
                      </div>
                    </el-card>
                  </a>
                </el-col>
              </transition-group>
            </el-col>
          </el-row>
        </div>
        <div class="done-problems">
          <div class="items-nav">
            <div class="item">已作答</div>
            <i class="fas fa-paperclip"></i> {{ doneNum }}
            <el-select v-model="doneSelectValue" placeholder="選擇類型" @change="doneChange">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="doneSortValue" placeholder="排序方式" @change="doneSortChange" clearable @clear="doneSortClear" style="margin-right: 10px;">
              <el-option label="難易度" value="rate"></el-option>
              <el-option label="繳交日期" value="handDate"></el-option>
            </el-select>
          </div>
          <el-row>
            <el-col class="doneCol" :span="24" v-loading="doneLoading">
              <transition-group name="slide-fade">
                <el-col v-for="problem in doneProblemsFiltered" :xs="24" :sm="12" :md="6" :key="problem.problemID" style="padding-right: 23px;">
                  <a href="javascript:void(0);" @click="doProblem(problem.problemID)">
                    <el-card :body-style="{ padding: '5px' }">
                      <div style="padding: 14px;">
                        <span class="title ellipsis">{{ problem.name }}
                          <el-tooltip class="item" effect="dark" :content="'繳交日期: '+problem.handDate" placement="top"><i class="el-icon-time time"></i></el-tooltip>
                        </span>
                        <div class="bottom clearfix">
                          <el-rate disabled v-model="problem.rate"></el-rate>
                          <el-button type="text" class="button" @click="doProblem(problem.problemID)">回顧題目</el-button>
                        </div>
                        <div class="type">{{ problem.type }}</div>
                      </div>
                    </el-card>
                  </a>
                </el-col>
              </transition-group>
            </el-col>
          </el-row>
        </div>
      </section>
    </el-col>
  </el-row>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'
import fab from 'vue-fab'

import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'

import '@/assets/css/student-index.css'
import '@/assets/css/transition.css'

export default {
  components: {
    NavHeaderStudent,
    NavFooter,
    fab
  },
  data() {
    return {
      // select
      undoSelectValue: '',
      doneSelectValue: '',
      options: [{
        'value': 'all',
        'label': '全部'
      }, {
        'value': 'homework',
        'label': '作業'
      }, {
        'value': 'practice',
        'label': '練習題'
      }],
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
      doneLoading: false
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
    },
    doneProblemsFiltered() {
      let doneProblems = this.doneProblems;

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
  mounted() {
    this.checkLogin();
    this.initUndoProblems();
    this.initDoneProblems();
  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            // pass
          } else if (res.result.authority == 'admin') {
            this.$router.push('/admin/index');
          }
        } else {
          this.$router.push('/login');
        }
      });
    },
    initUndoProblems() {
      this.undoLoading = true;
      axios.get('/api/student/undoAllList').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.undoLoading = false;
          this.undoProblems = res.result;
        }
      });
    },
    initDoneProblems() {
      this.doneLoading = true;
      axios.get('/api/student/doneAllList').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.doneLoading = false;
          this.doneProblems = res.result;
        }
      });
    },
    // select
    undoChange(val) {
      if (val == 'all') {
        this.initUndoProblems();
      } else if (val == 'homework') {
        this.undoLoading = true;
        axios.get('/api/student/undoHwList').then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.undoLoading = false;
            this.undoProblems = res.result;
          }
        });
      } else if (val == 'practice') {
        this.undoLoading = true;
        axios.get('/api/student/undoPraList').then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.undoLoading = false;
            this.undoProblems = res.result;
          }
        });
      }
    },
    doneChange(val) {
      if (val == 'all') {
        this.initDoneProblems();
      } else if (val == 'homework') {
        this.doneLoading = true;
        axios.get('/api/student/doneHwList').then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.doneLoading = false;
            this.doneProblems = res.result;
          }
        });
      } else if (val == 'practice') {
        this.doneLoading = true;
        axios.get('/api/student/donePraList').then((response) => {
          let res = response.data;
          if (res.status == '200') {
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

      if (this.undoSelectValue == 'all') {
        this.undoChange('all');
      } else if (this.undoSelectValue == 'homework') {
        this.undoChange('homework');
      } else if (this.undoSelectValue == 'practice') {
        this.undoChange('practice');
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
      }
    },
    // go to problem
    doProblem(problemID) {
      this.$router.push('/student/coding?problemID=' + problemID);
    }
  }
}
</script>

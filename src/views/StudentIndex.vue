<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row>
    <el-col :span="20" :offset="2">
      <section id="mainProblems-section">
        <div class="undo box" style="margin-bottom: 30px;">
          <div id="title">可作答題目</div>
          <el-row :gutter="20">
            <el-col :span="6" :offset="1" class="count-label">
              可做題目：{{ undoNum }}
            </el-col>
            <el-col :span="6" :offset="11">
              <el-select v-model="undoSelectValue" placeholder="選擇類型" @change="undoChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col class="undoCol" :span="22" :offset="1" v-loading="undoLoading">
              <transition-group name="slide-fade">
                <el-col v-for="problem in undoProblems" :span="6" :key="problem.problemID">
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
        <div class="done box">
          <div id="title">已作答題目</div>
          <el-row :gutter="20">
            <el-col :span="6" :offset="1" class="count-label">
              已做題目：{{ doneNum }}
            </el-col>
            <el-col :span="6" :offset="11">
              <el-select v-model="doneSelectValue" placeholder="選擇類型" @change="doneChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col class="doneCol" :span="22" :offset="1" v-loading="doneLoading" v-if="this.doneProblems.length!=0">
              <transition-group name="slide-fade">
                <el-col v-for="problem in doneProblems" :span="6" :key="problem.problemID">
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

import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'

import '@/assets/css/student-index.css'
import '@/assets/css/transition.css'

export default {
  components: {
    NavHeaderStudent,
    NavFooter
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
    }
  },
  mounted() {
    this.checkLogin();
    this.initUndoProblems();
    this.initDoneProblems();
  },
  methods: {
    checkLogin() {
      axios.get('/api/student/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          // pass
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
    doProblem(problemID) {
      this.$router.push('/student/coding?problemID=' + problemID);
    }
  }
}
</script>

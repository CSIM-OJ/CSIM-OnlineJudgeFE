<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row>
    <el-col :span="20" :offset="2">
      <section id="mainProblems-section">
        <div class="undo box" style="margin-bottom: 30px;">
          <div id="title">可作答題目</div>
          <el-row :gutter="20">
            <el-col :span="6" :offset="1" class="count-label hidden-xs-only">
              <i class="fas fa-pencil-alt"></i> {{ undoNum }}
            </el-col>
            <el-col :xs="13" :md="6" :offset="11">
              <el-select v-model="undoSelectValue" placeholder="選擇類型" @change="undoChange" style="width: 77%;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col class="undoCol" :span="22" :offset="1" v-loading="undoLoading">
              <transition-group name="slide-fade">
                <el-col v-for="problem in undoProblems" :xs="24" :md="6" :key="problem.problemID">
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
            <el-col :span="6" :offset="1" class="count-label hidden-xs-only">
              <i class="fas fa-paperclip"></i> {{ doneNum }}
            </el-col>
            <el-col :xs="13" :md="6" :offset="11">
              <el-select v-model="doneSelectValue" placeholder="選擇類型" @change="doneChange" style="width: 77%;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col class="doneCol" :span="22" :offset="1" v-loading="doneLoading">
              <transition-group name="slide-fade">
                <el-col v-for="problem in doneProblems" :xs="24" :md="6" :key="problem.problemID">
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
  <!-- feedback block start -->
  <div class="feedback" @click="sendFeedback">
    <i class="el-icon-edit-outline"></i>
  </div>
  <!-- feedback block end -->
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'

import '@/assets/css/student-index.css'
import '@/assets/css/transition.css'
import '@/assets/css/feedback-block.css'

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
    doProblem(problemID) {
      this.$router.push('/student/coding?problemID=' + problemID);
    },
    sendFeedback() {
      this.$prompt('請輸入對系統的建議', '系統回饋', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        inputType: 'textarea'
      }).then(({
        value
      }) => {
        axios.post('/api/student/sendFeedback', {
          feedback: value
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '已經收到您的回饋！'
            });
          } else {
            this.$message({
              type: 'error',
              message: '傳送回饋失敗 :('
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消輸入'
        });
      });
    }
  }
}
</script>

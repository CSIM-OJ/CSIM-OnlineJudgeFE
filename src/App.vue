<template>
<div id="app">
  <router-view/>
  <!-- set progressbar -->
  <vue-progress-bar></vue-progress-bar>
  <!-- fab start -->
  <fab v-if="this.$route.path!='/login'" :position="position" :bg-color="bgColor" :actions="fabActions" :icon-size="size" @rank="rank" @feedback="feedback"></fab>
  <!-- fab end -->
  <!-- rank dialog start -->
  <el-dialog :visible.sync="rankDialogVisible">
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="radio-button-container" style="width: 100%; text-align: center;">
          <el-radio-group v-model="radio" style="margin-bottom: 20px" @change="radioChangeHandler">
            <el-radio-button label="正確題數"></el-radio-button>
            <el-radio-button label="最佳解答"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="correctRank-block" v-if="correctRankFlag">
          <div class="items-nav">
            <div class="item">正確題數排行</div>
          </div>
          <el-table max-height="350" :data="correctRankData" style="width: 100%; margin-bottom: 60px;">
            <el-table-column prop="rank" label="名次" width="80%">
            </el-table-column>
            <el-table-column prop="studentID" label="學生學號">
            </el-table-column>
            <el-table-column prop="studentName" label="學生姓名"></el-table-column>
            <el-table-column prop="correctNum" label="正確題數"></el-table-column>
          </el-table>
        </div>
        <div class="bestCodeRank-block" v-if="bestCodeRankFlag">
          <div class="items-nav">
            <div class="item">最佳解答數排行</div>
          </div>
          <el-table max-height="350" :data="bestCodeRankData" style="width: 100%; margin-bottom: 60px;">
            <el-table-column prop="rank" label="名次" width="80%">
            </el-table-column>
            <el-table-column prop="studentID" label="學生學號">
            </el-table-column>
            <el-table-column prop="studentName" label="學生姓名"></el-table-column>
            <el-table-column prop="bestCodeNum" label="最佳題數"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
  <!-- rank dialog end -->
</div>
</template>

<script>
import axios from 'axios'
import fab from 'vue-fab'

import '@/assets/css/basic.css'
import '@/assets/fontawesome-free-5.0.13/web-fonts-with-css/css/fontawesome-all.min.css'
import '@/assets/css/material-icon.css'

export default {
  name: 'App',
  components: {
    fab
  },
  data() {
    return {
      // fabActions
      bgColor: '#E6A23C',
      position: 'bottom-right',
      size: 'small',
      fabActions: [{
          name: 'rank',
          icon: 'bar_chart',
          color: '#F56C6C'
        },
        {
          name: 'feedback',
          icon: 'create',
          color: '#409EFF'
        }
      ],
      // rank dialog
      radio: '正確題數',
      rankDialogVisible: false,
      correctRankFlag: true,
      bestCodeRankFlag: false,
      correctRankData: [],
      bestCodeRankData: []
    }
  },
  // vue progressbar
  mounted () {
    this.$Progress.finish();
    this.getCorrectRank();
    this.getBestCodeRank();
  },
  created () {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
  },
  methods: {
    // fabActions
    rank() {
      this.rankDialogVisible = true;
      this.getCorrectRank();
      this.getBestCodeRank();
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
    },
    feedback() {
      this.sendFeedback();
    },
    // rank dialog
    radioChangeHandler(label) {
      if(label=='正確題數') {
        this.correctRankFlag = true;
        this.bestCodeRankFlag = false;
      } else if(label=='最佳解答') {
        this.correctRankFlag = false;
        this.bestCodeRankFlag = true;
      }
    },
    getCorrectRank() {
      axios.get('/api/rank/getCorrectRank').then((response)=> {
        let res = response.data;
        if(res.status=='200') {
          this.correctRankData = res.result;
        }
      });
    },
    getBestCodeRank() {
      axios.get('/api/rank/getBestCodeRank').then((response)=> {
        let res = response.data;
        if(res.status=='200') {
          this.bestCodeRankData = res.result;
        }
      });
    }
  }
}
</script>

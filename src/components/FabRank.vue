<template>
<div>
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
            <el-table-column prop="account" label="學生學號">
            </el-table-column>
            <el-table-column prop="name" label="學生姓名"></el-table-column>
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
            <el-table-column prop="account" label="學生學號">
            </el-table-column>
            <el-table-column prop="name" label="學生姓名"></el-table-column>
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

export default {
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
  mounted() {
    this.getCorrectRank();
    this.getBestCodeRank();
  },
  methods: {
    // fabActions
    rank() {
      this.getCorrectRank();
      this.getBestCodeRank();
      this.rankDialogVisible = true;
    },
    sendFeedback() {
      this.$prompt('請輸入對系統的建議', '系統回饋', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        inputType: 'textarea'
      }).then(({
        value
      }) => {
        axios.post('/api/feedback/addFeedback', {
          courseId: this.$store.state.course.courseInfo.courseId,
          content: value
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
      axios.get('/api/rank/getCorrectRank', {
        params: {
          courseId: this.$store.state.course.courseInfo.courseId
        }
      }).then((response)=> {
        let res = response.data;
        if(res.status=='200') {
          this.correctRankData = res.result;
        }
      });
    },
    getBestCodeRank() {
      axios.get('/api/rank/getBestCodeRank', {
        params: {
          courseId: this.$store.state.course.courseInfo.courseId
        }
      }).then((response)=> {
        let res = response.data;
        if(res.status=='200') {
          this.bestCodeRankData = res.result;
        }
      });
    }
  }
}
</script>
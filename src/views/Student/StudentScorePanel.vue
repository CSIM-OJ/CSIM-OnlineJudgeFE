<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row>
    <el-col :span="20" :offset="2">
      <div class="box">
        <el-row>
          <el-col :xs="24" :sm="12">
            <div class="items-nav" style="width: 95%;">
              <div class="item">正確率</div>
            </div>
            <ve-pie :data="pieData" :colors="pieColors" :settings="pieSettings">
              <div class="data-empty" v-if="hasRecordFlag">沒有數據 &#x1F61D;</div>
            </ve-pie>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="items-nav" style="width: 95%;">
              <div class="item">成績圖表</div>
            </div>
            <ve-line :data="lineData" :settings="lineSettings">
              <div class="data-empty" v-if="hasRecordFlag">沒有數據 &#x1F61D;</div>
            </ve-line>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div class="items-nav">
          <div class="item">歷史成績</div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="題目名稱">
                    <span>{{ props.row.problemName }}</span>
                  </el-form-item>
                  <el-form-item label="運行時間">
                    <span>{{ props.row.historyCode.slice(-1)[0].runTime }} ms</span>
                  </el-form-item>
                  <el-form-item label="題目 ID">
                    <span>{{ props.row.problemId }}</span>
                  </el-form-item>
                  <el-form-item label="難易度">
                    <span><el-rate v-model="props.row.rate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></span>
                  </el-form-item>
                  <el-form-item label="正確率">
                    <span>{{ props.row.correctRate }}%</span>
                  </el-form-item>
                  <el-form-item label="繳交日期">
                    <span>{{ props.row.historyCode.slice(-1)[0].handDate }}</span>
                  </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="題目ID" prop="problemId"></el-table-column>
          <el-table-column label="題目名稱">
            <template slot-scope="scope">
              <a class="id-hyperlink" href="javascript:void(0)" @click="doProblem(scope.row)">{{ scope.row.problemName }}</a>
              <el-tooltip class="item" effect="dark" content="最佳代碼！" placement="top">
                <span v-if="scope.row.isBestCode" class="bestCode">&nbsp;<i class="fas fa-crown"></i></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="類型">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type === '作業' ? 'danger' : 'success'" close-transition>{{scope.row.type}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="分數">
            <template slot-scope="scope">
              {{ scope.row.historyCode.slice(-1)[0].score }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
  <fab-rank></fab-rank>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import {studentCheckLogin} from '@/apis/_checkLogin.js'
import {apiStudInfo, apiHistoryScore} from '@/apis/student.js'

import NavHeaderStudent from '@/components/student/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'
import FabRank from '@/components/FabRank.vue'

import '@/assets/css/table.css'

export default {
  components: {
    NavHeaderStudent,
    NavFooter,
    FabRank
  },
  created() {
    // chart
    this.pieColors = ['#67C23A', '#F56C6C'];
    this.pieSettings = {}
    // line
    this.lineSettings = {
      metrics: ['分數'],
      dimension: ['題目']
    }
  },
  data() {
    return {
      user: {
        'name': '',
        'studentId': '',
        'class': '',
        'bestNum': '',
        'undoNum': '',
        'doneNum': '',
        'correctNum': '',
        'errorNum': ''
      },
      // table
      tableData: [],
      // line's data
      transformedLineData: []
    }
  },
  computed: {
    pieData() {
      let pieData = {
        columns: ['狀態', '數量'],
        rows: [{
            '狀態': '正確',
            '數量': this.user.correctNum
          },
          {
            '狀態': '錯誤',
            '數量': this.user.errorNum
          }
        ]
      }
      return pieData
    },
    lineData() {
      let lineData = {
        columns: ['題目', '分數'],
        rows: this.transformedLineData
      }
      return lineData
    },
    hasRecordFlag() {
      if (this.user.correctNum == '0' && this.user.errorNum == '0') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    studentCheckLogin();
    this.getStudentInfo();
    this.getHistoryScore();
  },
  methods: {
    getStudentInfo() {
      apiStudInfo({
        courseId: this.$store.state.course.courseInfo.courseId
      }).then((response) => {
        let res = response.data;
        if(res.status=='200') {
          this.user.name = res.result.name;
          this.user.studentId = res.result.account;
          this.user.class = res.result.studentClass;
          this.user.bestNum = res.result.bestCodeNum;
          this.user.undoNum = res.result.undoNum;
          this.user.doneNum = res.result.doneNum;
          this.user.correctNum = res.result.correctNum;
          this.user.errorNum = res.result.incorrectNum;
        }
      });
    },
    getHistoryScore() {
      apiHistoryScore({
        courseId: this.$store.state.course.courseInfo.courseId
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.tableData = res.result;

          // transform to line data
          let data = [];
          this.tableData.forEach((element) => {
            data.push({
              '分數': element.historyCode[element.historyCode.length-1].score,
              '題目': element.problemName
            });
          })
          this.transformedLineData = data;
        }
      });
    },
    doProblem(data) {
      this.$router.push('/student/'+ this.$store.state.course.courseInfo.courseName +'/coding?problemId=' + data.problemId);
    }
  }
}
</script>

<style>
.data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, .7);
  color: #888;
  font-size: 14px;
}

.bestCode {
  color: #E6A23C;
}
</style>

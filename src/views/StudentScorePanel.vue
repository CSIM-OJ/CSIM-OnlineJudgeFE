<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row>
    <el-col :span="20" :offset="2">
      <div class="box">
        <el-row>
          <el-col :span="12">
            <div id="title">正確率</div>
            <ve-pie :data="pieData" :colors="pieColors" :settings="pieSettings">
              <div class="data-empty" v-if="user.correctNum=='0' && user.errorNum=='0'">沒有數據 &#x1F61D;</div>
            </ve-pie>
          </el-col>
          <el-col :span="12">
            <div id="title">成績圖表</div>
            <ve-line :data="lineData" :settings="lineSettings">
              <div class="data-empty" v-if="user.correctNum=='0' && user.errorNum=='0'">沒有數據 &#x1F61D;</div>
            </ve-line>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div id="title">歷史成績</div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="題目名稱">
                      <span>{{ props.row.problemName }}</span>
                  </el-form-item>
                  <el-form-item label="運行時間">
                      <span>{{ props.row.runTime }} ms</span>
                  </el-form-item>
                  <el-form-item label="題目 ID">
                      <span>{{ props.row.problemID }}</span>
                  </el-form-item>
                  <el-form-item label="難易度">
                      <span><el-rate v-model="props.row.rate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></span>
                  </el-form-item>
                  <el-form-item label="正確率">
                      <span>{{ props.row.correctRate }}%</span>
                  </el-form-item>
                  <el-form-item label="繳交日期">
                      <span>{{ props.row.handDate }}</span>
                  </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="題目 ID" prop="problemID"></el-table-column>
          <el-table-column label="題目名稱" prop="problemName"></el-table-column>
          <el-table-column label="類型">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type === '作業' ? 'danger' : 'success'" close-transition>{{scope.row.type}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="分數" prop="score"></el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
  <!-- TODO -->
  <!--
  <el-row v-else>
    <el-col :span="20" :offset="2" class="box">
      <div style="color: #909399; height: 60vh; text-align: center; line-height: 60vh;">還沒有紀錄呦～ 趕快去做題吧！！</div>
    </el-col>
  </el-row>
-->
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'
import '@/assets/css/ta-index.css'

export default {
  components: {
    NavHeaderStudent,
    NavFooter
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
        'studentID': '',
        'class': '',
        'bestNum': '',
        'undoNum': '',
        'doneNum': '',
        'correctNum': '',
        'errorNum': ''
      },
      // table
      tableData: []
    }
  },
  computed: {
    problemsData() {
      if(this.user.correctNum!='0'&&this.user.errorNum!='0') {
        let data = [];
        this.tableData.forEach((element) => {
          data.push({
            '分數': element.score,
            '題目': element.problemName
          });
        })
        return data
      } else {
        return null
      }
    },
    // pie and line
    // TODO
    // transDataCorrectNum() {
    //   if(this.user.correctNum=='0') {
    //     return null
    //   }
    // },
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
        rows: this.problemsData
      }
      return lineData
    }

  },
  mounted() {
    this.checkLogin();
    this.getStudentInfo();
    this.getHistoryScore();
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
    getStudentInfo() {
      axios.get('/api/student/info').then((response) => {
        let res = response.data;
        console.log(res.result);
        if (res.status == '200') {
          this.user.name = res.result.name;
          this.user.studentID = res.result.studentID;
          this.user.class = res.result.student_class;
          this.user.bestNum = res.result.bestCodeNum;
          this.user.undoNum = res.result.undoNum;
          this.user.doneNum = res.result.doneNum;
          this.user.correctNum = res.result.correctNum;
          this.user.errorNum = res.result.incorrectNum;
        }
      });
    },
    getHistoryScore() {
      axios.get('/api/student/historyScore').then((response) => {
        let res = response.data;
        console.log(res.result);
        if (res.status == '200') {
          this.tableData = res.result;
        }
      });
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
</style>

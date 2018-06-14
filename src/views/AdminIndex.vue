<template>
<div>
  <el-container>
    <el-header>
      <nav-header-admin></nav-header-admin>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-admin></side-nav-admin>
      </el-aside>
      <el-container>
        <el-main>
          <!-- 相關數據 start -->
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="box-square dashboard-square" style="background-color: #9B59B6;">
                <div class="num">53</div>
                <div class="desc">在線人數</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="box-square dashboard-square" style="background-color: #2874A6;">
                <div class="num">24</div>
                <div class="desc">活躍人數</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="box-square dashboard-square" style="background-color: #229954;">
                <div class="num">67</div>
                <div class="desc">今日做題次數</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="box-square dashboard-square" style="background-color: #F39C12;">
                <div class="num">213</div>
                <div class="desc">本週做題次數</div>
              </div>
            </el-col>
          </el-row>
          <!-- 相關數據 end -->
          <!-- 圖表數據 start -->
          <el-row :gutter="15">
            <el-col :span="12">
              <div class="box-square chart-square">
                <div class="chart-title"><i class="fas fa-user-circle"></i> 在線與活躍人數</div>
                <ve-line :data="onlineChartData" :settings="onlineChartSettings"></ve-line>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="box-square chart-square">
                <div class="chart-title"><i class="fas fa-pencil-alt"></i> 每日做題次數</div>
                <ve-line :data="doPerDayChartData" :settings="doPerDayChartSettings"></ve-line>
              </div>
            </el-col>
          </el-row>
          <!-- 圖表數據 end -->
          <!-- 做題實況 start -->
          <el-row>
            <el-col :span="24" class="box-square">
              <div class="chart-title"><i class="fas fa-stream"></i> 即時批改實況</div>
              <el-table :data="judgeLiveTable" style="width: 100%; margin-bottom: 25px;" height="288">
                <el-table-column prop="time" label="時間" width="180">
                </el-table-column>
                <el-table-column prop="studentID" label="學號" width="120">
                </el-table-column>
                <el-table-column prop="studentName" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="problemID" label="題目ID" width="120">
                </el-table-column>
                <el-table-column prop="problemName" label="題目名稱" width="130">
                </el-table-column>
                <el-table-column prop="score" label="分數" width="100">
                </el-table-column>
                <el-table-column prop="errorMsg" label="錯誤訊息">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!-- 做題實況 end -->
        </el-main>
        <el-footer>
          <nav-footer-admin></nav-footer-admin>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import SideNavAdmin from '@/components/SideNavAdmin'
import NavFooterAdmin from '@/components/NavFooterAdmin'

export default {
  components: {
    NavHeaderAdmin,
    SideNavAdmin,
    NavFooterAdmin
  },
  data() {
    // 活躍人數 line chart
    this.onlineChartSettings = {
      stack: {
        '用戶': ['在線人數', '活躍人數']
      },
      area: true
    }
    this.doPerDayChartSettings = {
      metrics: ['做題次數'],
      dimension: ['日期']
    }
    return {
      // 基本統計
      onlineNum: '53',
      activeNum: '27',
      todayDoNum: '43',
      weekDoNum: '124',
      // line chart
      onlineChartData: {
        columns: ['日期', '在線人數', '活躍人數'],
        rows: [{
            '日期': '1/1',
            '在線人數': 1393,
            '活躍人數': 1093
          },
          {
            '日期': '1/2',
            '在線人數': 3530,
            '活躍人數': 3230
          },
          {
            '日期': '1/3',
            '在線人數': 2923,
            '活躍人數': 2623
          },
          {
            '日期': '1/4',
            '在線人數': 1723,
            '活躍人數': 1423
          },
          {
            '日期': '1/5',
            '在線人數': 3792,
            '活躍人數': 3492
          },
          {
            '日期': '1/6',
            '在線人數': 4593,
            '活躍人數': 4293
          }
        ]
      },
      doPerDayChartData: {
        columns: ['日期', '做題次數'],
        rows: [{
            '日期': '1/1',
            '做題次數': 1393
          },
          {
            '日期': '1/2',
            '做題次數': 3530
          },
          {
            '日期': '1/3',
            '做題次數': 2923
          },
          {
            '日期': '1/4',
            '做題次數': 1723
          },
          {
            '日期': '1/5',
            '做題次數': 3792
          },
          {
            '日期': '1/6',
            '做題次數': 4593
          }
        ]
      },
      // 即時批改實況
      judgeLiveTable: [{
        time: '2018-05-02 20:25:00',
        studentID: '06156125',
        studentName: '蘇靖軒',
        problemID: 'P0003',
        problemName: '計算複利',
        score: '100'
      }, {
        time: '2018-05-04 12:35:24',
        studentID: '04156147',
        studentName: '波波',
        problemID: 'P0005',
        problemName: '計算成績',
        score: '0'
      }, {
        time: '2018-05-01 15:40:03',
        studentID: '06156130',
        studentName: '皮皮',
        problemID: 'P0011',
        problemName: '計算複利',
        score: '100'
      }, {
        time: '2018-05-03 20:10:02',
        studentID: '06156158',
        studentName: '張小明',
        problemID: 'P0017',
        problemName: '計算英文名詞',
        score: '100'
      }, {
        time: '2018-05-04 12:35:24',
        studentID: '04156147',
        studentName: '波波',
        problemID: 'P0005',
        problemName: '計算成績',
        score: '0'
      }]
    }
  },
  computed: {

  },
  mounted() {
    this.checkLogin();

  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            this.$router.push('/student/index');
          } else if (res.result.authority == 'admin') {
            // pass
          }
        } else {
          this.$router.push('/login');
        }
      });
    },
    getBasicData() {
      axios.get('/api/data/getBasicData').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.onlineNum = res.result.onlineNum;
          this.activeNum = res.result.activeNum;
          this.todayDoNum = res.result.todayDoNum;
          this.weekDoNum = res.result.weekDoNum;
        } else {
          console.log(res.msg);
        }
      });
    },
    getOnlineData() {
      axios.get('/api/data/getOnlineData').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          let rawOnlineData = res.result;
          let transOnlineData = [];
          for (let i = 0; i < rawOnlineData.length; i++) {
            let obj = {
              '日期': rawOnlineData[i].date,
              '在線人數': rawOnlineData[i].onlineNum,
              '活躍人數': rawOnlineData[i].activeNum
            }
            transOnlineData.push(obj);
          }
          this.onlineChartData.rows = transOnlineData;
        } else {
          console.log(res.msg);
        }
      });
    },
    getDoPerDayData() {
      axios.get('/api/data/getDoPerDayData').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          let rawDoPerDayData = res.result;
          let transDoPerDayData = [];
          for (let i = 0; i < rawDoPerDayData.length; i++) {
            let obj = {
              '日期': rawDoPerDayData[i].date,
              '做題次數': rawDoPerDayData[i].doPerDayNum
            }
            transDoPerDayData.push(obj);
          }
          this.doPerDayChartData.rows = transDoPerDayData;
        } else {
          console.log(res.msg);
        }
      });
    },
    getJudgeLiveData() {
      axios.get('/api/data/getJudgeLiveData').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.judgeLiveTable = res.result;
        } else {
          console.log(res.msg);
        }
      });
    }
  }
}
</script>

<style>
.dashboard-square {
  border: 0px;
  color: white;
}

.dashboard-square .num {
  text-align: center;
  font-size: 40px;
}

.dashboard-square .desc {
  margin-top: 15px;
  text-align: center;
}

/* line chart */

.chart-square {
  padding-bottom: 0px;
}

.chart-title {
  color: #303133;
  margin-bottom: 30px;
  font-weight: bold;
}
</style>

<template>
<div>
  <nav-header-admin></nav-header-admin>
  <el-row>
    <el-col :span="20" :offset="2">
      <!-- <div id="title">圖表總覽</div> -->
      <el-row>
        <el-col :span="6" v-for="(item, index) in allData" style="padding-right: 20px; padding-bottom: 20px;" key="index">
          <div class="pie-box">
            <div class="problem-name">{{ item.name }}</div>
            <div class="problem-id">{{ item.problemID }}</div>
            <div class="problem-pie">
              <ve-pie :data="pieData[index]" :colors="chartColors" :settings="chartSettings" :legend-visible="false"></ve-pie>
            </div>
          </div>
        </el-col>
      </el-row>

    </el-col>
  </el-row>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import NavFooter from '@/components/NavFooter'

export default {
  components: {
    NavHeaderAdmin,
    NavFooter
  },
  data() {
    return {
      allData: [],
    }
  },
  mounted() {
    this.checkLogin();
    this.getStudentsData();
  },
  created() {
    // pie
    this.chartColors = ['#67C23A', '#F56C6C'];
    this.chartSettings = {
      radius: 70,
      offsetY: 120
    }
  },
  computed: {
    pieData() {
      let list = [];
      for(let i=0 ; i<this.allData.length ; i++) {
        let chartData = {
          columns: ['狀態', '數量'],
          rows: [{
              '狀態': '已作答',
              '數量': this.allData[i].doneStudentNum
            },
            {
              '狀態': '未作答',
              '數量': this.allData[i].undoStudentNum
            }
          ]
        }
        list.push(chartData);
      }
      console.log(list);
      return list
    }
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
    getStudentsData() {
      // this.loading = true;
      axios.get('/api/ta/getProblems').then((response) => {
        let res = response.data;
        // console.log(res.result);
        if (res.status == '200') {
          this.allData = res.result;
          // this.loading = false;
        }
      });
    },
  }
}
</script>

<style>
.pie-box {
  height: 300px;
  text-align: center;
  border: solid 1px #DDDDDD;
  border-radius: 5px;
  background-color: #FFF;
  box-shadow: 4px 4px 3px rgba(20%, 20%, 40%, 0.2);
}

.pie-box .problem-name {
  font-size: 20px;
  color: #303133;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
}

.pie-box .problem-id {
  color: #909399;
}

</style>

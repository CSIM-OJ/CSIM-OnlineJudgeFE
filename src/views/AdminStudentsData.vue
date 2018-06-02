<template>
<div>
  <nav-header-admin></nav-header-admin>
  <el-row>
    <el-col :span="20" :offset="2" class="box">
      <div id="title">學生資訊</div>
      <!-- <div class="manageClassGroup">
          <el-tag>{{ manageClassGroup }}</el-tag>
        </div> -->
      搜尋:
      <el-input class='filterInput' v-model='filterQuery' placeholder='請輸入想查找的學號'></el-input>
      <el-button plain size="mini" @click="changeTableWidth" class="ctbtn hidden-xs-only"><i class="fas fa-arrows-alt"></i></el-button>
      <el-table :data="tableFiltered" border style="width: 100%" ref="studentsTable" v-loading="loading" height="70vh">
        <el-table-column fixed prop="studentID" label="學號" width="120"></el-table-column>
        <el-table-column fixed label="姓名" width="120">
          <template slot-scope="scope">
            <a class="id-hyperlink" href="javascript:void(0)" @click="studentInfo(scope.row.studentID, scope.row.name)">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column fixed prop="class" label="系級" width="120"></el-table-column>
        <el-table-column :key="problem" v-for="(problem, index) in formThead " :label="problem" width="120">
          <template slot-scope="scope">
              <span>{{ scope.row.problems[index].score }}</span>
            </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="4" :offset="20">
          <el-button id="tocsv-btn" type="success" @click="exportCsv">匯出成績 <i class="fas fa-file-excel"></i></el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <el-dialog :visible.sync="dialogFormVisible" @close="clearFilter">
    <el-row id="student-dialog">
      <el-col :span="20" :offset="2">
        <div class="items-nav">
          <div class="item">{{ dialogStudentName }}</div>{{ dialogStudentID }}
        </div>
        <el-row>
          <el-col :span="11" class="statistic-block" style="background-color: #3498DB;">
            <div class="statistic">{{ dialogStudentDoRate }}%</div>
            <div class="title">作答率</div>
          </el-col>
          <el-col :span="11" :offset="1" class="statistic-block" style="background-color: #A569BD;">
            <div class="statistic">{{ dialogStudentCorrectRate }}%</div>
            <div class="title">正確率</div>
          </el-col>
        </el-row>
        <el-table max-height="250" :data="dialogStudentData" @filter-change="handleFilterChange" ref="table" style="width: 100%; margin-top: 20px; margin-bottom: 20px;">
          <el-table-column prop="name" label="題目名稱">
          </el-table-column>
          <el-table-column prop="type" label="題目類型" :filters="[{text: '作業', value: '作業'}, {text: '練習題', value: '練習題'}]" :filter-method="typeFilterHandler">
          </el-table-column>
          <el-table-column prop="score" label="成績" :filters="[{text: '100', value: '100.0'}, {text: '0', value: '0.0'}, {text: '未作答', value: '未作答'}]" :filter-method="scoreFilterHandler">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible=false">確 定</el-button>
    </div>
  </el-dialog>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import NavFooter from '@/components/NavFooter'

import '@/assets/css/ta-studentsdata.css'

import {
  CsvExport
} from '@/utils/CsvExport.js'

export default {
  components: {
    NavHeaderAdmin,
    NavFooter
  },
  data() {
    return {
      // manageClassGroup
      manageClassGroup: '106資一A',
      // table
      loading: false,
      tableData: [],
      // changeTableWidth
      tableFlag: 1,
      filterQuery: '',
      // dialogForm
      filterList: [],
      dialogFormVisible: false,
      dialogStudentID: '',
      dialogStudentName: '',
      dialogStudentDoRate: '0',
      dialogStudentCorrectRate: '0'
    }
  },
  mounted() {
    this.checkLogin();
    this.getStudentsData();
  },
  computed: {
    //form
    formThead() {
      return this.tableData[0].problems.map(v => {
        return v.name
      })
    },
    tableFiltered() {
      let oriTable = this.tableData;
      let filteredTable = [];

      if (this.filterQuery == '') {
        return oriTable
      } else {
        for (let i = 0; i < oriTable.length; i++) {
          if (oriTable[i].studentID.includes(this.filterQuery)) {
            filteredTable.push(oriTable[i]);
          }
        }
        return filteredTable
      }
    },
    // TODO
    dialogStudentData() {
      let list = [];
      let data = this.tableData;
      for (let i = 0; i < data.length; i++) {
        if (this.dialogStudentID == data[i].studentID) {
          list = data[i].problems;

          // 計算 dialogStudentCorrectRate
          let correct = 0;
          let incorrect = 0;
          for (let j = 0; j < list.length; j++) {
            if (list[j].score == 100) {
              correct++;
            } else if (list[j].score == 0) {
              incorrect++;
            }
          }
          this.dialogStudentCorrectRate = ((correct / (correct + incorrect)) * 100).toFixed(1);

          // 計算 dialogStudentDoRate
          let done = 0;
          let undo = 0;
          for (let j = 0; j < list.length; j++) {
            if (list[j].score == '未作答') {
              undo++;
            } else {
              done++;
            }
          }
          this.dialogStudentDoRate = ((done / (done + undo)) * 100).toFixed(1);
          break;
        }
      }
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
    // TODO
    getManageClassGroup() {
      // this.manageClassGroup =
    },
    getStudentsData() {
      this.loading = true;
      axios.get('/api/ta/getStudentsData').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          // console.log(res.result);
          this.tableData = res.result;
          this.loading = false;
        }
      });
    },
    exportCsv() {
      // 取fields
      let fields = [];
      let table = this.$refs['studentsTable'].$children;
      table.forEach((el) => {
        fields.push(el.label);
      });

      // 取data
      let data = [];
      this.tableData.forEach((el) => {
        var temp = {
          "學號": el.studentID,
          "姓名": el.name,
          "班級": el.class
        }

        let len = el.problems.length;
        for (var i = 0; i < len; i++) {
          temp[el.problems[i].name] = el.problems[i].score;
        }

        data.push(temp);
      });

      let Today = new Date();
      let filename = Today.getFullYear() + "-" + Today.getMonth() + "-" + Today.getDate();
      CsvExport(fields, data, filename);
    },
    changeTableWidth() {
      this.tableFlag++;
      var box = document.getElementsByClassName("box")[0];
      var ctbtn = document.getElementsByClassName("ctbtn")[0];

      if (this.tableFlag % 2 == 0) {
        box.style.marginLeft = '0px';
        box.style.width = '100%';
        ctbtn.style.color = '#409EFF';
      } else {
        box.style.marginLeft = '8.33%';
        box.style.width = '83%';
        ctbtn.style.color = '#303133';
      }
    },
    studentInfo(studentID, studentName) {
      this.dialogStudentID = studentID;
      this.dialogStudentName = studentName;
      this.dialogFormVisible = true;
    },
    typeFilterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    scoreFilterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleFilterChange(val) {
      console.log(val);
      this.filterList = val;
    },
    clearFilter() {
      this.$refs.table.clearFilter(this.filterList);
    }
  }
}
</script>

<style>
#student-dialog .statistic-block {
  height: 100px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#student-dialog .statistic-block .title {
  color: white;
}

#student-dialog .statistic-block .statistic {
  color: white;
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 30px;
}
</style>

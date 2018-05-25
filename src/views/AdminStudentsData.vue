<template>
<div>
  <nav-header-admin></nav-header-admin>
  <div id="title">學生資訊</div>
  <el-row>
    <el-col :span="20" :offset="2">
      <div class="box">
        <div class="manageClassGroup">
          <el-tag>{{ manageClassGroup }}</el-tag>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="studentsTable">
          <el-table-column fixed prop="studentID" label="學號" width="120"></el-table-column>
          <el-table-column fixed prop="name" label="姓名" width="120"></el-table-column>
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
      </div>
    </el-col>
  </el-row>
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
      tableData: [{
        studentID: '04156101',
        name: '王小明',
        class: '資三A',
        problems: [{
          'name': 'A+B Problem',
          'score': '90'
        }, {
          'name': '猜拳',
          'score': '100'
        }, {
          'name': '聖誕樹',
          'score': '80'
        }]
      }, {
        studentID: '04156102',
        name: '林小美',
        class: '資三A',
        problems: [{
          'name': 'A+B Problem',
          'score': '100'
        }, {
          'name': '猜拳',
          'score': '100'
        }, {
          'name': '聖誕樹',
          'score': '100'
        }]
      }]
    }
  },
  mounted() {
    // this.checkLogin();
    // this.getStudentsData();
  },
  computed: {
    //form
    formThead() {
      return this.tableData[0].problems.map(v => {
        return v.name
      })
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
      axios.get('/ta/getStudentsData').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.tableData = res.result;
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
    }
  }
}
</script>

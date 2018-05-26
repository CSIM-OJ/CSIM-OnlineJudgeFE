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
        <el-table :data="tableData" border style="width: 100%" ref="studentsTable" v-loading="loading">
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
      loading: false,
      tableData: []
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
    }
  }
}
</script>

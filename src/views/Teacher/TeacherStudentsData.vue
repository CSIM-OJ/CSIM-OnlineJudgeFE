<template>
<div>
  <el-container>
    <el-header>
      <nav-header-teacher></nav-header-teacher>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-course-index-teacher></side-nav-course-index-teacher>
      </el-aside>
      <el-container>
        <el-main>
          <el-row class="admin-page">
            <span class="title">學生資訊</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/teacher/'+ courseInfo.courseName +'/index' }">{{courseInfo.courseName}}</el-breadcrumb-item>
                <el-breadcrumb-item>學生資訊</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <div class="box-square">
            <el-input class='filterInput' v-model='filterQuery' placeholder='請輸入學號或姓名' clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
            <!-- <el-button plain size="mini" @click="changeTableWidth" class="ctbtn hidden-xs-only"><i class="fas fa-arrows-alt"></i></el-button> -->
            <el-table :data="tableFiltered.slice((currentPage-1)*pagesize, currentPage*pagesize)" border style="width: 100%" ref="studentsTable" v-loading="loading" height="80vh">
              <el-table-column fixed prop="studentId" label="學號" width="120"></el-table-column>
              <el-table-column fixed label="姓名" width="120">
                <template slot-scope="scope">
                  <a class="id-hyperlink" href="javascript:void(0)" @click="studentInfo(scope.row.studentId, scope.row.studentName)">{{ scope.row.studentName }}</a>
                </template>
              </el-table-column>
              <el-table-column fixed prop="studentClass" label="系級" width="120"></el-table-column>
              <el-table-column :key="index" v-for="(problem, index) in formThead " :label="problem" width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.problems[index].historyCode.length!=0?scope.row.problems[index].historyCode.slice(-1)[0].score:'未作答' }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: center;margin-top: 30px;">
              <el-pagination background layout="prev, pager, next" :total="total" @current-change="currentChange" :page-size="pagesize"></el-pagination>
            </div>
            <el-row>
              <el-col :span="4" :offset="20">
                <el-button id="tocsv-btn" type="success" @click="exportCsv">匯出成績 <i class="fas fa-file-excel"></i></el-button>
              </el-col>
            </el-row>
          </div>
          <!-- <div style="text-align: center;margin-top: 30px;">
            <el-pagination background layout="prev, pager, next" :total="total" @current-change="currentChange"></el-pagination>
          </div> -->
        </el-main>
        <el-footer>
          <nav-footer-admin></nav-footer-admin>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
  <!-- 學生做題資訊 dialog start -->
  <el-dialog :visible.sync="dialogFormVisible" @close="clearFilter">
    <el-row id="student-dialog">
      <el-col :span="20" :offset="2">
        <div class="items-nav">
          <div class="item">{{ dialogStudentName }}</div>{{ dialogStudentId }}
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
          <el-table-column prop="type" label="題目類型" :filters="[{text: '作業', value: '作業'}, {text: '練習題', value: '練習題'}, {text: '討論題', value: '討論題'}]" :filter-method="typeFilterHandler">
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
  <!-- 學生做題資訊 dialog end -->
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderTeacher from '@/components/Teacher/NavHeaderTeacher'
import SideNavCourseIndexTeacher from '@/components/Teacher/SideNavCourseIndexTeacher'
import NavFooterAdmin from '@/components/NavFooterAdmin'

import '@/assets/css/ta-studentsdata.css'

import {
  CsvExport
} from '@/utils/CsvExport.js'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseIndexTeacher,
    NavFooterAdmin
  },
  data() {
    return {
      courseInfo: {
        'courseId': '',
        'courseName': '',
        'semester': ''
      },
      // formThead
      formThead: '',
      // pagination
      total: 0,
      tableHeight: null,
      pagesize: 10,
      currentPage:1,
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
      dialogStudentId: '',
      dialogStudentName: '',
      dialogStudentDoRate: '0',
      dialogStudentCorrectRate: '0'
    }
  },
  mounted() {
    this.checkLogin();
    this.getCourses();
    // this.getStudentsData();
  },
  computed: {
    tableFiltered() {
      let oriTable = this.tableData;
      let filteredTable = [];

      if (this.filterQuery == '') {
        // pagination
        this.total = oriTable.length;
        return oriTable
      } else {
        for (let i = 0; i < oriTable.length; i++) {
          if (oriTable[i].studentId.includes(this.filterQuery) || oriTable[i].studentName.includes(this.filterQuery)) {
            filteredTable.push(oriTable[i]);
          }
        }
        // pagination
        this.total = filteredTable.length;
        this.currentPage = 1;
        return filteredTable
      }
    },
    dialogStudentData() {
      let problemsList = [];
      let resultList = [];
      let data = this.tableData;
      for (let i = 0; i < data.length; i++) {
        if (this.dialogStudentId == data[i].studentId) {
          problemsList = data[i].problems;

          // 計算 dialogStudentCorrectRate
          let correct = 0;
          let incorrect = 0;
          for (let j = 0; j < problemsList.length; j++) {
            if (problemsList[j].historyCode.length > 0) {
              if (problemsList[j].historyCode.slice(-1)[0].score == 100) {
                correct++;
              } else if (problemsList[j].historyCode.slice(-1)[0].score == 0) {
                incorrect++;
              }
            }
            
          }
          this.dialogStudentCorrectRate = ((correct / (correct + incorrect)) * 100).toFixed(1);

          // 計算 dialogStudentDoRate
          let done = 0;
          let undo = 0;
          for (let j = 0; j < problemsList.length; j++) {
            if (problemsList[j].historyCode.length == 0) {
              undo++;
            } else {
              done++;
            }
          }
          this.dialogStudentDoRate = ((done / (done + undo)) * 100).toFixed(1);

          // 處理score
          for(let i=0; i<problemsList.length; i++) {
            let obj = {
              'name': problemsList[i].name,
              'type': problemsList[i].type,
              'score': problemsList[i].historyCode.length!=0?problemsList[i].historyCode.slice(-1)[0].score:'未作答'
            }
            resultList.push(obj);
          }
          break;
        }
      }
      return resultList
    }
  },
  methods: {
    countTableHeight() {
      this.tableHeight = parseInt(this.$refs.studentsTable.bodyHeight.height.replace('px', ''));
      this.pagesize = this.tableHeight/47;
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
    },
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            this.$router.push('/student/courseList')
          } else if (res.result.authority == 'teacher') {
            // pass
          } else if (res.result.authority == 'assistant') {
            this.$router.push('/assistant/index');
          } else if (res.result.authority == 'admin') {
            this.$router.push('/admin/index');
          }  
        } else {
          this.$router.push('/login');
        }
      });
    },
    getCourses() {
      axios.get("/api/teacher/courseList").then((response)=> {
        let res = response.data;
        if(res.status=="200") {
          res.result.forEach((element) => {
            if(element.courseName == this.$route.params.courseName) {
              this.courseInfo = element;
            }
          });
          this.getStudentsData();
          this.countTableHeight();
        }
      });
    },
    // TODO:
    getManageClassGroup() {
      // this.manageClassGroup =
    },
    getStudentsData() {
      this.loading = true;

      axios.get('/api/course/getStudentsData', {
        params: {
          courseId: this.courseInfo.courseId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.tableData = res.result;
          this.loading = false;
          
          // formThead
          this.formThead = this.tableData[0].problems.map(v => {
            return v.name
          });
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
          "學號": el.studentId,
          "姓名": el.studentName,
          "班級": el.studentClass
        }

        let len = el.problems.length;
        for (var i = 0; i < len; i++) {
          if (el.problems[i].historyCode.length > 0) {
            temp[el.problems[i].name] = el.problems[i].historyCode.slice(-1)[0].score;
          } else {
            temp[el.problems[i].name] = '未作答';
          }
        }

        data.push(temp);
      });

      let Today = new Date();
      let filename = Today.getFullYear() + "-" + (Today.getMonth()+1) + "-" + Today.getDate();
      CsvExport(fields, data, filename);
    },
    changeTableWidth() {
      this.tableFlag++;
      var box = document.getElementsByClassName("box-square")[0];
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
    studentInfo(studentId, studentName) {
      this.dialogStudentId = studentId;
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

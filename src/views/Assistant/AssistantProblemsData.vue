<template>
<div>
  <el-container>
    <el-header>
      <nav-header-assistant></nav-header-assistant>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-course-index-assistant></side-nav-course-index-assistant>
      </el-aside>
      <el-container>
        <el-main>
          <el-row class="admin-page">
            <span class="title">題目列表</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/assistant/'+ this.$store.state.course.courseInfo.courseName +'/index' }">{{ this.$store.state.course.courseInfo.courseName }}</el-breadcrumb-item>
                <el-breadcrumb-item>題目列表</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <!-- TODO: table problem data -->
          <table-problem-data :problemData="tableData" :tableLoading='loading' @refreshProblemsData="refreshProblemsData" @showViewProblemDialog="showViewProblemDialog" @showEditProblemDialog="showEditProblemDialog" @showDoStatusDialog="showDoStatusDialog" ></table-problem-data>
        </el-main>
        <el-footer>
          <nav-footer-admin></nav-footer-admin>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
  
  <!-- view problem dialog -->
  <view-problem-dialog :viewProblemDialogVisible="viewProblemDialogVisible" :viewProblemLoading="viewProblemLoading" :problemData="problemData" @onChangeViewProblemDialogVisible="onChangeViewProblemDialogVisible"></view-problem-dialog>

  <!-- TODO: edit problem dialog -->
  <edit-problem-dialog :editProblemDialogVisible="editProblemDialogVisible" :editProblemData="editProblemData" @onChangeEditProblemDialogVisible="onChangeEditProblemDialogVisible" @refreshProblemsData="refreshProblemsData">
  </edit-problem-dialog>

  <!-- TODO: do status dialog -->
  <do-status-problem-dialog :doStatusDialogVisible="doStatusDialogVisible" :doInfoDialogStatus="doInfoDialogStatus" :doStatusData="doStatusData" @onChangeDoStatusDialogVisible="onChangeDoStatusDialogVisible" :doInfoDialogPName="doInfoDialogPName"></do-status-problem-dialog>
  
</div>
</template>

<script>
import axios from 'axios'
import DateUtil from '@/utils/DateUtil.js'
import problemStateMixin from '@/mixins/problemState.mixin.js'

import NavHeaderAssistant from '@/components/Assistant/NavHeaderAssistant'
import SideNavCourseIndexAssistant from '@/components/Assistant/SideNavCourseIndexAssistant'
import NavFooterAdmin from '@/components/NavFooterAdmin'
import TableProblemData from '@/components/MgmtProblem/TableProblemData'
import ViewProblemDialog from '@/components/MgmtProblem/ViewProblemDialog'
import EditProblemDialog from '@/components/MgmtProblem/EditProblemDialog'
import DoStatusProblemDialog from '@/components/MgmtProblem/DoStatusProblemDialog'

import '@/assets/css/table.css'

export default {
  components: {
    NavHeaderAssistant,
    SideNavCourseIndexAssistant,
    NavFooterAdmin,
    TableProblemData,
    ViewProblemDialog,
    EditProblemDialog,
    DoStatusProblemDialog
  },
  data() {
    return {
      // table
      tableData: [],
      loading: false,
      // viewProblem dialog
      viewProblemDialogVisible: false,
      problemData: {
        'id': '',
        'judged': null,
        'name': '',
        'rate': null,
        'type': '',
        'category': '',
        'tag': [],
        'deadline': '',
        'description': '',
        'inputDesc': '',
        'outputDesc': '',
        'testCases': [],
        'correctNum': null,
        'incorrectNum': null
      },
      // edit problem dialog
      editProblemDialogVisible: false,
      editProblemData: {
        'id': '',
        'name': '',
        'type': '',
        'category': '',
        'tag': [],
        'deadline': '',
        'description': '',
        'inputDesc': '',
        'outputDesc': '',
        'testCases': [],
        'keyword': [],
        'pattern': []
      },
      // do status dialog
      studentData: [], // getStudentsData
      doStatusDialogVisible: false,
      doInfoDialogPName: '',
      doInfoDialogStatus: '',
      viewProblemLoading: false
    }
  },
  computed: {
    doStatusData() {
      // TODO 使用PID判別
      let data = this.studentData;
      let flag = this.doInfoDialogStatus;
      let tempTableData = [];
      for (let i = 0; i < data.length; i++) {
        let id = data[i].studentId;
        let name = data[i].studentName;
        let problems = data[i].problems;
        // 已作答的狀況
        if (flag == 'done') {
          for (let j = 0; j < problems.length; j++) {
            if (problems[j].historyCode!=0) {
              if (problems[j].name==this.doInfoDialogPName && problems[j].historyCode.slice(-1)[0].score!='未作答') {
                let obj = {
                  studentId: id,
                  studentName: name,
                  score: problems[j].historyCode.slice(-1)[0].score,
                  code: problems[j].historyCode.slice(-1)[0].code
                };
                tempTableData.push(obj)
              }
            }
          }
        } else if (flag == 'undo') { // 未作答的狀況
          for (let j = 0; j < problems.length; j++) {
            if (problems[j].name==this.doInfoDialogPName && problems[j].historyCode.length==0) {
              let obj = {
                studentId: id,
                studentName: name,
                score: '未作答'
              };
              tempTableData.push(obj)
            }
          }
        }
      }
      return tempTableData
    }
  },
  mounted() {
    this.checkLogin();
    this.getProblemsData();
    this.getStudentsData();
  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            this.$router.push('/student/courseList')
          } else if (res.result.authority == 'teacher') {
            this.$router.push('/teacher/courseList');
          } else if (res.result.authority == 'assistant') {
            // pass
          } else if (res.result.authority == 'admin') {
            this.$router.push('/admin/index');
          }  
        } else {
          this.$router.push('/login');
        }
      });
    },
    getProblemsData() {
      this.loading = true;
      axios.get('/api/problem/getProblems', {
        params: {
          courseId: this.$store.state.course.courseInfo.courseId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.tableData = res.result;
          this.loading = false;
        }
      });
    },
    getStudentsData() {
      axios.get('/api/course/getStudentsData', {
        params: {
          courseId: this.$store.state.course.courseInfo.courseId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.studentData = res.result;
        }
      });
    },
    // ProblemTableData component
    showViewProblemDialog(problemId) {
      this.viewProblemLoading = true;
      axios.get('/api/problem/getInfo', {
        params: {
          problemId: problemId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.problemData.id = problemId;
          this.problemData.name = res.result.name;
          this.problemData.type = res.result.type;
          this.problemData.category = res.result.category;
          this.problemData.tag = res.result.tag;
          this.problemData.deadline = res.result.deadline;
          this.problemData.description = res.result.description;
          this.problemData.inputDesc = res.result.inputDesc;
          this.problemData.outputDesc = res.result.outputDesc;
          this.problemData.testCases = res.result.testCases;
          this.problemData.correctNum = parseInt(res.result.correctNum);
          this.problemData.incorrectNum = parseInt(res.result.incorrectNum);
        }
      });
      this.viewProblemLoading = false;
      this.viewProblemDialogVisible = true;
    },
    onChangeViewProblemDialogVisible(val) {
      this.viewProblemDialogVisible = val;
    },
    refreshProblemsData() {
      this.getProblemsData();
    },
    // TODO: EditTableData component
    showEditProblemDialog(editProblemData) {
      this.editProblemData = editProblemData;
      this.editProblemDialogVisible = true;
    },
    onChangeEditProblemDialogVisible(val) {
      this.editProblemDialogVisible = val;
    },
    // do status
    onChangeDoStatusDialogVisible(val) {
      this.doStatusDialogVisible = val;
    },
    showDoStatusDialog(problemName, status) {
      this.doInfoDialogPName = problemName;
      this.doInfoDialogStatus = status;
      this.doStatusDialogVisible = true;
    }
  }
}
</script>

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
            <span class="title">意見回饋</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/teacher/'+ this.$store.state.course.courseInfo.courseName +'/index' }">{{this.$store.state.course.courseInfo.courseName}}</el-breadcrumb-item>
                <el-breadcrumb-item>意見回饋</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <el-row class="box-square">
            <el-col :span="20" :offset="2">
              <el-table :data="feedbackTableData" height="70vh" style="width: 100%;">
                <el-table-column prop="account" label="學號" width="180">
                </el-table-column>
                <el-table-column prop="date" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="content" label="意見回饋">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
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
import {teacherCheckLogin} from '@/apis/_checkLogin.js'

import NavHeaderTeacher from '@/components/Teacher/NavHeaderTeacher'
import SideNavCourseIndexTeacher from '@/components/Teacher/SideNavCourseIndexTeacher'
import NavFooterAdmin from '@/components/NavFooterAdmin'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseIndexTeacher,
    NavFooterAdmin
  },
  data() {
    return {
      feedbackTableData: []
    }
  },
  mounted() {
    teacherCheckLogin();
    this.getStudentFeedback();
  },
  methods: {
    getStudentFeedback() {
      axios.get('/api/feedback/getCourseFeedbacks', {
        params: {
          courseId: this.$store.state.course.courseInfo.courseId
        }
      }).then((response)=> {
        let res = response.data;
        if(res.status=='200') {
          this.feedbackTableData = res.result;
        } else {
          console.log(res.msg);
        }
      });
    }
  }
}
</script>

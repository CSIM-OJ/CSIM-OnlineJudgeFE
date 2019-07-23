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
            <span class="title">意見回饋</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/assistant/'+ courseInfo.courseName +'/index' }">{{courseInfo.courseName}}</el-breadcrumb-item>
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

import NavHeaderAssistant from '@/components/Assistant/NavHeaderAssistant'
import SideNavCourseIndexAssistant from '@/components/Assistant/SideNavCourseIndexAssistant'
import NavFooterAdmin from '@/components/NavFooterAdmin'

export default {
  components: {
    NavHeaderAssistant,
    SideNavCourseIndexAssistant,
    NavFooterAdmin
  },
  data() {
    return {
      courseInfo: {
        'courseId': '',
        'courseName': '',
        'semester': ''
      },
      feedbackTableData: []
    }
  },
  mounted() {
    this.checkLogin();
    this.getCourses();
  },
  methods: {
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

          this.getStudentFeedback();
        }
      });
    },
    getStudentFeedback() {
      axios.get('/api/feedback/getCourseFeedbacks', {
        params: {
          courseId: this.courseInfo.courseId
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

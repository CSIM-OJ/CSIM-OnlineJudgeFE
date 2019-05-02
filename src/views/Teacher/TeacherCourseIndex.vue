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
            <span class="title">{{ this.courseInfo.courseName }}</span>
          </el-row>
          <el-row class="box-square">
            <el-row :gutter="25">
              <el-col :span="8" v-for="item in oprateList" :key="item" style="margin-bottom: 15px;">
                <a href="javascript:void(0);" @click="toProblemsData(item)" style="text-decoration: none;">
                  <el-card shadow="hover">{{ item }}</el-card>
                </a>
              </el-col>
            </el-row>
          </el-row>
        </el-main>
        <el-footer>
          <nav-footer></nav-footer>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderTeacher from '@/components/Teacher/NavHeaderTeacher'
import SideNavCourseIndexTeacher from '@/components/Teacher/SideNavCourseIndexTeacher'
import NavFooter from '@/components/NavFooter'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseIndexTeacher,
    NavFooter
  },
  data() {
    return {
      courseInfo: {
        'courseId': '',
        'courseName': '',
        'semester': ''
      },
      oprateList: ['題目列表', '新增題目', '學生管理', '學生資訊', '意見回饋']
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
        }
      });
    },
    toProblemsData(item) {
      let baseLink = '/teacher/'+this.courseInfo.courseName+'/';

      if(item=='題目列表') {
        this.$router.push(baseLink+'problemsData');
      } else if (item=='新增題目') {
        this.$router.push(baseLink+'newProblem');
      } else if (item=='學生管理') {
        this.$router.push(baseLink+'studentManage');
      } else if (item=='學生資訊') {
        this.$router.push(baseLink+'studentsData');
      } else if (item=='意見回饋') {
        this.$router.push(baseLink+'feedback');
      }
    }
  }
}
</script>

<style>

</style>

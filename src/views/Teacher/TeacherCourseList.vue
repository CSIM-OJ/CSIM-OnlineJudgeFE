<template>
<div>
  <el-container>
    <el-header>
      <nav-header-teacher></nav-header-teacher>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-course-list-teacher></side-nav-course-list-teacher>
      </el-aside>
      <el-container>
        <el-main>
          <el-row class="admin-page">
            <span class="title">課程列表</span>
            <!-- <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin/index' }">首頁</el-breadcrumb-item>
                <el-breadcrumb-item>新增題目</el-breadcrumb-item>
              </el-breadcrumb>
            </div> -->
          </el-row>
          <el-row class="box-square">
            <!-- 列出課程 start -->
            <el-col :span="20" :offset="2" v-for="course in courseList" :key="course.id" style="padding-bottom: 30px;">
              <a href="javascript:void(0);" @click="goCourse(course.courseName)" style="text-decoration: none;">
                <el-card shadow="hover">
                  <div slot="header" class="clearfix">
                    <span style="font-size: 20px;"> {{course.courseName}} </span>
                  </div>
                  <div style="padding: 5px;">
                    <div class="bottom clearfix">
                      <time class="time"> {{course.semester}} </time>
                      <el-button type="text" class="button">
                        前往課程<i class="el-icon-caret-right"></i>
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </a> 
            </el-col>
            <!-- 列出課程 end -->
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
import SideNavCourseListTeacher from '@/components/Teacher/SideNavCourseListTeacher'
import NavFooter from '@/components/NavFooter'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseListTeacher,
    NavFooter
  },
  data() {
    return {
      courseList: []
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
            // this.$router.push('/admin/index');
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
          this.courseList = res.result;
        }
      });
    },
    // TODO: 前往課程
    goCourse(courseName) {
      // this.$router.push('/teacher/course/index/' + courseId);
      this.$router.push('/teacher/'+ courseName +'/index');
    }
  }
}
</script>

<style>

</style>

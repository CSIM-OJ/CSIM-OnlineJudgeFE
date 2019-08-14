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
          </el-row>
          <el-row class="box-square">
            <course-list :data="courseList"></course-list>
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
import {teacherCheckLogin} from '@/apis/_checkLogin.js'
import {apiTrCourseList} from '@/apis/teacher.js'

import NavHeaderTeacher from '@/components/Teacher/NavHeaderTeacher'
import SideNavCourseListTeacher from '@/components/Teacher/SideNavCourseListTeacher'
import NavFooter from '@/components/NavFooter'
import CourseList from '@/components/MgmtContent/CourseList.vue'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseListTeacher,
    NavFooter,
    CourseList
  },
  data() {
    return {
      courseList: []
    }
  },
  mounted() {
    teacherCheckLogin();
    this.getCourses();
  },
  methods: {
    getCourses() {
      apiTrCourseList().then((response)=> {
        let res = response.data;
        if(res.status=="200") {
          this.courseList = res.result;
        }
      });
    }
  }
}
</script>

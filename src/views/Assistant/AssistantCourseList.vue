<template>
<div>
  <el-container>
    <el-header>
      <nav-header-assistant></nav-header-assistant>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-course-list-assistant></side-nav-course-list-assistant>
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
import axios from 'axios'
import {assistantCheckLogin} from '@/apis/_checkLogin.js'
import {apiAsstCourseList} from '@/apis/assistant.js'

import NavHeaderAssistant from '@/components/Assistant/NavHeaderAssistant'
import SideNavCourseListAssistant from '@/components/Assistant/SideNavCourseListAssistant'
import NavFooter from '@/components/NavFooter'
import CourseList from '@/components/MgmtContent/CourseList.vue'

export default {
  components: {
    NavHeaderAssistant,
    SideNavCourseListAssistant,
    NavFooter,
    CourseList
  },
  data() {
    return {
      courseList: []
    }
  },
  mounted() {
    assistantCheckLogin();
    this.getCourses();
  },
  methods: {
    getCourses() {
      apiAsstCourseList().then((response)=> {
        let res = response.data;
        if(res.status=="200") {
          this.courseList = res.result;
        }
      });
    }
  }
}
</script>
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
      <!-- TODO: 編輯課程 -->
      <el-container>
        <el-main>
          <el-row class="admin-page">
            <span class="title">課程列表</span>
          </el-row>
          <el-row class="box-square">
            
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
      
    }
  },
  mounted() {
    this.checkLogin();
    
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
    }
  }
}
</script>

<style>

</style>

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
          <el-row class="box-square" id="teacherCourseList-section">
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
import {assistantCheckLogin} from '@/apis/_checkLogin.js'

import NavHeaderAssistant from '@/components/Assistant/NavHeaderAssistant'
import SideNavCourseListAssistant from '@/components/Assistant/SideNavCourseListAssistant'
import NavFooter from '@/components/NavFooter'

export default {
  components: {
    NavHeaderAssistant,
    SideNavCourseListAssistant,
    NavFooter
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
      axios.get("/api/assistant/courseList").then((response)=> {
        let res = response.data;
        if(res.status=="200") {
          this.courseList = res.result;
        }
      });
    },
    goCourse(courseName) {
      this.courseList.forEach((element) => {
        if(element.courseName == courseName) {
          this.$store.commit('initCourseInfo', element);
        }
      });
      
      this.$router.push('/assistant/'+ courseName +'/index');
    }
  }
}
</script>

<style>
#teacherCourseList-section .el-card {
  /* height: 130px; */
  height: 12vw;
  position: relative;
  transition: all ease 0.3s;
}

#teacherCourseList-section .el-card i.time {
  position: absolute;
  top: 21px;
  right: 15px;
}

#teacherCourseList-section .el-card i.time:hover {
  color: #F56C6C;
}

#teacherCourseList-section .el-card .title {
  height: 22px;
  line-height: 22px;
  display: block;
  margin-bottom: 15px;
  text-decoration: none;
  outline: none;
}

#teacherCourseList-section .el-card .time {
  font-size: 13px;
  color: #999;
}

#teacherCourseList-section .el-card button {
  position: absolute;
  bottom: 5px;
  right: 15px;
}

#teacherCourseList-section .el-card .type {
  position: absolute;
  bottom: 19px;
  left: 20px;
  color: #888888;
  font-size: 10px;
}

#teacherCourseList-section .el-card .button a {
  text-decoration: none;
  color: #409EFF;
}
</style>

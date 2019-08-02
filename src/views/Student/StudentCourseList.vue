<template>
<div>
  <nav-header></nav-header>
  <el-row>
    <el-col :span="20" :offset="2" class="box">
      <div class="items-nav">
        <div class="item">我的課程</div>
      </div>
      <!-- 列出課程 start -->
      <el-row id="studentCourseList-section">
        <el-col :span="20" :offset="2" v-for="course in courseList" :key="course.id" style="padding-bottom: 30px;">
          <a href="javascript:void(0);" @click="goCourse(course.courseName)" style="text-decoration: none;">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;"> {{course.courseName}} </span>
              </div>
              <div style="padding: 5px;">
                <span style="padding-bottom: 5px;">Teacher：{{course.teacherName}} </span>
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
      </el-row>
      <!-- 列出課程 end -->
    </el-col>
  </el-row>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'

export default {
  components: {
    NavHeader,
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
            // pass
          } else if (res.result.authority == 'teacher') {
            this.$router.push('/teacher/courseList');
          } else if (res.result.authority == 'assistant') {
            this.$router.push('/assistant/courseList');
          } else if (res.result.authority == 'admin') {
            this.$router.push('/admin/index');
          }  
        } else {
          this.$router.push('/login');
        }
      });
    },
    getCourses() {
      axios.get("/api/student/courseList").then((response)=> {
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

      this.$router.push('/student/'+ courseName +'/index');
    }
  }
}
</script>

<style>
#studentCourseList-section .el-card {
  /* height: 130px; */
  height: 12vw;
  position: relative;
  transition: all ease 0.3s;
}

#studentCourseList-section .el-card i.time {
  position: absolute;
  top: 21px;
  right: 15px;
}

#studentCourseList-section .el-card i.time:hover {
  color: #F56C6C;
}

#studentCourseList-section .el-card .title {
  height: 22px;
  line-height: 22px;
  display: block;
  margin-bottom: 15px;
  text-decoration: none;
  outline: none;
}

#studentCourseList-section .el-card .time {
  font-size: 13px;
  color: #999;
}

#studentCourseList-section .el-card button {
  position: absolute;
  bottom: 5px;
  right: 15px;
}

#studentCourseList-section .el-card .type {
  position: absolute;
  bottom: 19px;
  left: 20px;
  color: #888888;
  font-size: 10px;
}

#studentCourseList-section .el-card .button a {
  text-decoration: none;
  color: #409EFF;
}
</style>

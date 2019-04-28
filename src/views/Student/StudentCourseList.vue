<template>
<div>
  <nav-header></nav-header>
  <el-row>
    <el-col :span="20" :offset="2" class="box">
      <div class="items-nav">
        <div class="item">我的課程</div>
      </div>
      <!-- 列出課程 start -->
      <el-row>
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
      axios.get("/api/student/courseList").then((response)=> {
        let res = response.data;
        if(res.status=="200") {
          this.courseList = res.result;
        }
      });
    },
    goCourse(courseName) {
      this.$router.push('/student/'+ courseName +'/index');
    }
  }
}
</script>
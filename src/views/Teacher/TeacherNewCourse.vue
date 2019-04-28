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
            <span class="title">新增課程</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/teacher/index' }">首頁</el-breadcrumb-item>
                <el-breadcrumb-item>新增課程</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <el-row class="box-square">
            <!-- 步驟條 start -->
            <el-steps :active="step" align-center>
              <el-step title="步驟 1" description="新增課程內容"></el-step>
              <el-step title="步驟 2" description="加入學生進課程"></el-step>
              <el-step title="步驟 3" description="加入助教進課程"></el-step>
            </el-steps>
            <!-- 步驟條 end -->
            <el-col :span="20" :offset="2">
              <!-- 步驟欄位 start -->
              <teacher-new-course-step1 v-if="step==1" @goNext1To2="getNext1To2"></teacher-new-course-step1>
              <teacher-new-course-step2 v-if="step==2" @goLast2To1="getLast2to1" @goNext2To3="getNext2To3"></teacher-new-course-step2>
              <teacher-new-course-step3 v-if="step==3" @goLast3To2="getLast3to2" @submit="submit"></teacher-new-course-step3>
              <!-- <transition name="slide-left">
                <teacher-new-course-step1 v-if="step==1" class="child-view" @sendValueToParent="getValueFromStep1"></teacher-new-course-step1>
              </transition>
              <transition name="slide-left">
                <teacher-new-course-step2 v-if="step==2" class="child-view" ></teacher-new-course-step2>
              </transition> -->
              
              <!-- 步驟欄位 end -->
              <!-- <el-button-group style="float: right;">
                <el-button type="primary" icon="el-icon-arrow-left" v-if="step!=1">上一步</el-button>
                <el-button type="primary">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-button-group> -->
              
            </el-col>
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
import TeacherNewCourseStep1 from '@/components/Teacher/TeacherNewCourseStep1'
import TeacherNewCourseStep2 from '@/components/Teacher/TeacherNewCourseStep2'
import TeacherNewCourseStep3 from '@/components/Teacher/TeacherNewCourseStep3'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseListTeacher,
    NavFooter,
    TeacherNewCourseStep1,
    TeacherNewCourseStep2,
    TeacherNewCourseStep3
  },
  data() {
    return {
      step: 1,
      courseData: {
        courseName: '',
        semester: '',
        studentClass: '',
        taList: [] 
      }
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
            // this.$router.push('/admin/index');
          }  
        } else {
          this.$router.push('/login');
        }
      });
    },
    // step1 to step2
    getNext1To2(data, step) {
      this.courseData.courseName = data.courseName;
      this.courseData.semester = data.semester;
      this.step = step+1;
    },
    // step2 to step1
    getLast2to1(step) {
      this.step = step-1;
    },
    // step2 to step3
    getNext2To3(data, step) {
      this.step = step+1;
      this.courseData.studentClass = data[0];
    },
    // step3 to step2
    getLast3to2(step) {
      this.step = step-1;
    },
    submit(data) {
      this.courseData.taList = data;
      // TODO: axios 
      axios.post('/api/teacher/createCourse', {
        courseName: this.courseData.courseName,
        semester: this.courseData.semester,
        studentClass: this.courseData.studentClass,
        taList: this.courseData.taList
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.$message({
            type: 'success',
            message: '新增課程成功!'
          });
        }
        this.step = 1;
        this.courseData = {
          courseName: '',
          semester: '',
          studentClass: '',
          taList: [] 
        }
      });
      
    }
  }
}
</script>

<style>
.child-view {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(50px, 0);
  transform: translate(50px, 0);
}
.slide-right-enter,
.slide-left-leave-active
 {
  opacity: 0;
  -webkit-transform: translate(-50px, 0);
  transform: translate(-50px, 0);
}

</style>

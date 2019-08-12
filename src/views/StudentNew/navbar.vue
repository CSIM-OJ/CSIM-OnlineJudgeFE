<template>
<div>
  <header id="navbar" :style="{'background-color': navbarBGC}" >
    <!-- <a href="javascript:void(0)" style="float:left; margin-left: 2%;" @click="onChangeMenuCollapse"><i class="fas fa-bars" style="display:inline-block; height:60px; line-height:60px; font-size: 20px; color:black;"></i></a> -->
    
    <div class="logo" style="width:200px; height:60px; margin-left:0px; text-align:center; border-right:solid 1px #e6e6e6; line-height:none;">
      <router-link :to="courseIndex"><img src="/static/logo/main.png" alt=""></router-link>
    </div>
    <div class="courseName" style="display:inline-block; height:60px; line-height:60px; font-size:20px; margin-left: 35px;">{{ this.$store.state.course.courseInfo.courseName }}</div>
    <el-menu :default-active="$route.path" class="oj-menu" mode="horizontal" @select="handleSelect" :style="{'background-color': navbarBGC}" router>
      <!-- <el-menu-item index="/student/courseList" @click="cleanCourseInfo">課程列表</el-menu-item>
      <el-menu-item :index="scorePanelIndex">成績面板</el-menu-item>
      <el-menu-item :index="myPageIndex">個人中心</el-menu-item> -->
      <el-button @click="logout" type="primary" round size="small" class="hidden-xs-only">Logout</el-button>
      <el-button @click="logout" type="primary" round size="small" class="hidden-sm-only"><i class="fas fa-sign-out-alt"></i></el-button>
    </el-menu>
  </header>
  <div class="space"></div>
</div>
</template>

<script>
import {apiLogout} from '@/apis/base.js'

import '@/assets/css/navbar.css'

export default {
  data() {
    return {
      navbarBoxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
      navbarBGC: '#FFF',
      activeIndex: '0',
      scroll: '',
      courseInfo: {},
      courseIndex: '',
      scorePanelIndex: '',
      myPageIndex: ''
    }
  },
  mounted() {
    // navbar
    // this.navController();
    // window.addEventListener('scroll', this.navController);

    this.courseIndex = '/student/'+this.$route.params.courseName+'/index';
    this.scorePanelIndex = '/student/'+this.$route.params.courseName+'/scorePanel';
    this.myPageIndex = '/student/'+this.$route.params.courseName+'/mypage';
    // this.getCourses();
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    navController() {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop;

      if (this.scroll == '0') {
        this.navbarBoxShadow = '';
        this.navbarBGC = 'rgba(0,0,0,0)';
      } else {
        this.navbarBoxShadow = "0 1px 5px 0 rgba(0, 0, 0, 0.1)";
        this.navbarBGC = '#FFF';
      }
    },
    logout() {
      apiLogout().then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.$router.push('/login');
          this.$store.commit('cleanUserInfo'); // 清空vuex userInfo
        }
      });
    },
    cleanCourseInfo() {
      this.$store.commit('cleanCouseInfo');
    },
    // onChangeMenuCollapse() {
    // this.$emit('onChangeMenuCollapse');
    // },
  }
}
</script>

<style>
#navbar .oj-menu.el-menu--horizontal.el-menu {
  border-bottom: none;
}
</style>
<template>
<div>
  <header id="navbar" :style="{'box-shadow': navbarBoxShadow, 'background-color': navbarBGC}" >
    <div class="logo">
      <router-link :to="courseIndex"><img src="/static/logo/main.png" alt=""></router-link>
    </div>
    <el-menu :default-active="$route.path" class="oj-menu" mode="horizontal" @select="handleSelect" :style="{'background-color': navbarBGC}" router>
      <el-menu-item index="/student/courseList">課程列表</el-menu-item>
      <el-menu-item :index="scorePanelIndex">成績面板</el-menu-item>
      <el-menu-item :index="myPageIndex">個人中心</el-menu-item>
      <el-button @click="logout" type="primary" round size="small" class="hidden-xs-only">Logout</el-button>
      <el-button @click="logout" type="primary" round size="small" class="hidden-sm-only"><i class="fas fa-sign-out-alt"></i></el-button>
    </el-menu>
  </header>
  <div class="space"></div>
</div>
</template>

<script>
import axios from 'axios'

import '@/assets/css/navbar.css'

export default {
  data() {
    return {
      navbarBoxShadow: '',
      navbarBGC: 'rgba(0,0,0,0)',
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
    this.navController();
    window.addEventListener('scroll', this.navController);

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
    // getCourses() {
    //   axios.get("/fake/student/courseList").then((response)=> {
    //     let res = response.data;
    //     if(res.status=="200") {
    //       res.result.forEach((element) => {
    //         if(element.courseName == this.$route.params.courseName) {
    //           this.courseInfo = element;
    //         }
    //       });
    //       this.courseIndex = '/student/'+this.courseInfo.courseName+'/index';
    //       this.scorePanelIndex = '/student/'+this.courseInfo.courseName+'/scorePanel';
    //       this.myPageIndex = '/student/'+this.courseInfo.courseName+'/mypage';
    //     }
    //   });
    // },
    logout() {
      axios.post('/api/logout').then((response) => {
        let res = response.data;
        if(res.status=='200') {
          this.$router.push('/login');
        }
      });
    }
  }
}
</script>

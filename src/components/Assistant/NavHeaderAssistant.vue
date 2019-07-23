<template>
<div>
  <header id="navbar" style="background-color: white; box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);">
    <div class="logo" style="background-color: #545c64; width: 15vw; margin-left:0px;">
      <router-link :to="courseIndex">
        <div style="height: 60px; display: flex; flex-direction: column; justify-content: center;">
          <img id="admin-logo" src="/static/logo/teacher.png" style="width:100%; margin-top:15px; display: block; margin: 0 auto;">
        </div>
      </router-link>
    </div>
    <el-menu class="oj-menu" mode="horizontal" style="border-bottom: none;" router>
      <el-menu-item index="/assistant/courseList">課程列表</el-menu-item>
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
      courseInfo: {
        'courseId': '',
        'courseName': '',
        'semester': ''
      },
      courseIndex: ''
    }
  },
  mounted() {
    this.getCourses();
    // navbar
    // this.navController();
    // window.addEventListener('scroll', this.navController);
  },
  methods: {
    // navController() {
    //   this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
    //
    //   if (this.scroll == '0') {
    //     this.navbarBoxShadow = '';
    //     this.navbarBGC = 'rgba(0,0,0,0)';
    //   } else {
    //     this.navbarBoxShadow = "0 1px 5px 0 rgba(0, 0, 0, 0.1)";
    //     this.navbarBGC = '#FFF';
    //   }
    // },
    getCourses() {
      axios.get("/api/teacher/courseList").then((response)=> {
        let res = response.data;
        if(res.status=="200") {
          res.result.forEach((element) => {
            if(element.courseName == this.$route.params.courseName) {
              this.courseInfo = element;
            }
          });
          if(this.courseInfo.courseName!=''){
            this.courseIndex = '/assistant/'+this.courseInfo.courseName+'/index';
          } else {
            this.courseIndex = '/assistant/courseList';
          }
        }
      });
    },
    logout() {
      axios.post('/api/logout').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.$router.push('/login');
        }
      });
    }
  }
}
</script>

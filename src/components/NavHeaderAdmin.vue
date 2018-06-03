<template>
<div>
  <!-- new design start -->
  <header id="navbar" style="background-color: white; box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);">
    <div class="logo" style="background-color: #545c64; width: 15vw; margin-left:0px;">
      <!-- <router-link to="/admin/index"><img src="/static/logo.png" alt=""></router-link> -->
      <router-link to="/admin/index">
        <div style="height: 60px; display: flex; flex-direction: column; justify-content: center;">
          <img id="admin-logo" src="/static/adminLogo.png" style="width:100%; margin-top:15px; display: block; margin: 0 auto;">
        </div>
      </router-link>
    </div>
    <el-menu class="oj-menu" mode="horizontal" style="border-bottom: none;">
      <el-button @click="logout" type="primary" round size="small" class="hidden-xs-only">Logout</el-button>
      <el-button @click="logout" type="primary" round size="small" class="hidden-sm-only"><i class="fas fa-sign-out-alt"></i></el-button>
    </el-menu>
  </header>
  <!-- new design end -->
  <!-- <header id="navbar" :style="{'box-shadow': navbarBoxShadow, 'background-color': navbarBGC}" >
    <div class="logo">
      <router-link to="/admin/index"><img src="/static/logo.png" alt=""></router-link>
    </div>
    <el-menu :default-active="$route.path" class="oj-menu" mode="horizontal" @select="handleSelect" :style="{'background-color': navbarBGC}" router>
      <el-menu-item index="/admin/newProblem">新增題目</el-menu-item>
      <el-menu-item index="/admin/studentsData">學生資訊</el-menu-item>
      <el-button @click="logout" type="primary" round size="small" class="hidden-xs-only">Logout</el-button>
      <el-button @click="logout" type="primary" round size="small" class="hidden-sm-only"><i class="fas fa-sign-out-alt"></i></el-button>
    </el-menu>
  </header> -->
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
    }
  },
  mounted() {
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

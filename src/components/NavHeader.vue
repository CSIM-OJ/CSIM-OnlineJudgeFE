<template>
<div>
  <header id="login-navbar" :style="{'box-shadow': navbarBoxShadow}">
    <el-menu class="oj-menu" mode="horizontal" :style="{'background-color': navbarBGC}">
      <div class="logo">
        <img src="/static/logo/main.png" alt="">
        <!-- <span>CSIM OJ</span> -->
      </div>
      <div class="right-item">
        <el-button @click="logout" type="primary" round size="small" class="hidden-xs-only">Logout</el-button>
        <el-button @click="logout" type="primary" round size="small" class="hidden-sm-only"><i class="fas fa-sign-out-alt"></i></el-button>
      </div>
    </el-menu>
  </header>
  <div class="space"></div>
</div>
</template>

<script>
  import {apiLogout} from '@/apis/base.js'
  
  export default {
    components: {},
    data() {
      return {
        navbarBoxShadow: '',
        navbarBGC: 'rgba(0,0,0,0)',
        activeIndex: '0',
        scroll: ''
      }
    },
    methods: {
      logout() {
          apiLogout().then((response) => {
            let res = response.data;
            if (res.status == '200') {
              this.$router.push('/login');
            }
          });
        }
      }
  }
</script>
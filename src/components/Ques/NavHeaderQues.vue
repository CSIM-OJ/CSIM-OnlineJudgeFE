<template>
<div>
  <header id="navbar" style="background-color: white; box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);">
    <div class="logo" style="background-color: #303133; width: 15vw; margin-left:0px;">
      <router-link to="/ques/index">
        <div style="height: 60px; display: flex; flex-direction: column; justify-content: center;">
          <img id="admin-logo" src="/static/logo/quesbank.png" style="width:100%; margin-top:15px; display: block; margin: 0 auto;">
        </div>
      </router-link>
    </div>
    <!-- <el-menu class="oj-menu" mode="horizontal" style="border-bottom: none;">
      <el-button @click="logout" type="primary" round size="small" class="hidden-xs-only">Logout</el-button>
      <el-button @click="logout" type="primary" round size="small" class="hidden-sm-only"><i class="fas fa-sign-out-alt"></i></el-button>
    </el-menu> -->
  </header>
  <div class="space"></div>
</div>
</template>

<script>
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
  },
  methods: {
    
  }
}
</script>

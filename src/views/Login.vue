<template>
<div @keyup.enter="login">
  <header id="login-navbar" :style="{'box-shadow': navbarBoxShadow}">
    <el-menu class="oj-menu" mode="horizontal" :style="{'background-color': navbarBGC}">
      <div class="logo">
        <img src="/static/logo.png" alt="">
        <!-- <span>CSIM OJ</span> -->
      </div>
      <!-- <div class="right-item">
        <el-button type="primary" size="small" @click="dialogFormVisible=true">登入</el-button>
      </div> -->
    </el-menu>
  </header>
  <el-row id="login-card">
    <el-col :span="10" :offset="7" class="least-shadow-box login-block">
      <el-row style="height: 100%;">
        <!-- <el-col :span="9" class="left">
          <p style="text-align: center; font-weight: bold;">東吳資管線上評測系統</p>
        </el-col> -->
        <el-col :span="24" class="right">
          <el-form :model="loginForm" status-icon label-width="40px" class="loginForm" v-loading="loading" element-loading-text="登入中" label-position="top">
            <el-row>
              <el-col :span="18" :offset="3">
                <p style="margin-bottom: 35px; font-size: 30px; text-align: center;">東吳資管線上評測系統</p>
                <el-form-item label="帳號" prop="account">
                  <el-input v-model="loginForm.account"></el-input>
                </el-form-item>
                <el-form-item label="密碼" prop="password">
                  <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-row style="padding-bottom: 30px;">
                  <el-col :span="24">
                    <el-button type="primary" @click="login" style="width: 100%;">登入</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            
          </el-form>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <!-- <div class="banner">
    <div class="block box">
      <p>東吳資管線上評測系統</p>
      <div class="icon">
        <span>CSIM OJ</span>
      </div>
    </div>
  </div> -->
  <div class="programmer">
    <i class="fas fa-code"></i>&nbsp; 陳冠億、蘇靖軒
  </div>
  <!-- <el-dialog :visible.sync="dialogFormVisible" @close="loginCancel">
    <el-form :model="loginForm" status-icon label-width="40px" class="loginForm" v-loading="loading" element-loading-text="登入中">
      <div id="title">登入</div>
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form-item label="帳號" prop="account" style="margin-bottom: 0px !important;">
            <el-input v-model="loginForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密碼" prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="padding-bottom: 30px;">
        <el-col :xs="5" :sm="14" :offset="5">
          <el-button type="primary" @click="login" style="float: right;">ＧＯ</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog> -->
</div>
</template>

<script>
import axios from 'axios'

import NavFooter from '@/components/NavFooter.vue'

import '@/assets/css/login.css'
import '@/assets/css/login-navbar.css'
import '@/assets/css/rwd.css'

export default {
  components: {
    NavFooter
  },
  data() {
    // login-form
    return {
      // navbar
      navbarBoxShadow: '',
      navbarBGC: 'rgba(0,0,0,0)',
      scroll: '',
      // login-form
      dialogFormVisible: false,
      loginForm: {
        account: '',
        password: ''
      },
      loading: false
    }
  },
  mounted() {
    // navbar
    window.addEventListener('scroll', this.navController);
    // checkLogin
    this.checkLogin();
  },
  methods: {
    // navbar
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
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
    // login-form
    login() {
      if (this.loginForm.account == '') {
        this.$message.error('請填寫帳號！');
      } else if (this.loginForm.password == '') {
        this.$message.error('請填寫密碼！');
      } else {
        this.loading = true;
        let self = this;
        axios.post('/api/login', {
          account: this.loginForm.account,
          password: this.loginForm.password
        }).then((response) => {
          let res = response.data;
          // console.log(res);
          if (res.status == "200") {
            // console.log(res.result);
            if (res.result == 'student') {
              this.$router.push("/student/index");
            } else if (res.result == 'admin') {
              this.$router.push("/admin/index");
            }
          } else {
            this.loading = false;
            this.$message.error('帳號或密碼錯誤！');
          }
        }).catch(function(error) {
          self.loading = false;
          self.$message.error('登入失敗');
        });;
      }
    },
    loginCancel() {
      this.dialogFormVisible = false;
      this.loginForm = {
        account: '',
        password: ''
      }
    },
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            this.$router.push("/student/index");
          } else if (res.result.authority == 'admin') {
            this.$router.push("/admin/index");
          }
        }
      });
    }
  }
}
</script>

<style>
#login-card {
  /* background-color: #909399; */
  height: 100vh;
  width: 100vw;
  position: relative;
  /* background: url('/static/background.png');
  background-repeat: repeat; */
  background: url('/static/458653.jpg');
  background-position:center top;
  background-size: cover;
}

#login-card .login-block {
  height: 70%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

#login-card .login-block .left {
  /* background: rgb(19, 211, 137); */
  height: 100%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-image: url('/static/2144.jpg');
  background-size: cover;
}

#login-card .login-block .right {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.el-form-item__label {
  padding: 0px !important;
}
</style>

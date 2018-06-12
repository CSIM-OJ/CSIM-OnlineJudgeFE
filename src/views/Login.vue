<template>
<div @keyup.enter="login">
  <header id="login-navbar" :style="{'box-shadow': navbarBoxShadow}">
    <el-menu class="oj-menu" mode="horizontal" :style="{'background-color': navbarBGC}">
      <div class="logo">
        <img src="/static/logo.png" alt="">
        <!-- <span>CSIM OJ</span> -->
      </div>
      <div class="right-item">
        <el-button type="primary" size="small" @click="dialogFormVisible=true">登入</el-button>
      </div>
    </el-menu>
  </header>
  <div class="banner">
    <div class="block">
      <p>東吳資管線上評測系統</p>
      <div class="icon">
        <span>CSIM OJ</span>
      </div>
    </div>
  </div>
  <div class="programmer">
    <i class="fas fa-code"></i>&nbsp; 陳冠億、蘇靖軒
  </div>
  <el-dialog :visible.sync="dialogFormVisible" @close="loginCancel">
    <el-form :model="loginForm" status-icon label-width="40px" class="loginForm" v-loading="loading" element-loading-text="登入中">
      <div id="title">登入</div>
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form-item label="帳號" prop="account">
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
  </el-dialog>
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
          this.loading = false;
          this.dialogFormVisible = false;
          this.loginForm = {
            account: '',
            password: ''
          }
          this.$message.error('登入失敗');
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

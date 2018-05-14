<template>
<div @keyup.enter="login">
  <header id="navbar" :style="{'box-shadow': navbarBoxShadow}">
    <el-menu class="oj-menu" mode="horizontal" :style="{'background-color': navbarBGC}">
      <div class="logo">
        <span>CSIM OJ</span>
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
  <el-dialog :visible.sync="dialogFormVisible" @close="loginCancel">
    <el-form :model="loginForm" status-icon label-width="50px" class="loginForm" v-loading="loading" element-loading-text="登入中">
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
        <el-col :span="2" :offset="13">
          <el-button @click="loginCancel">取 消</el-button>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="primary" @click="login">ＧＯ！</el-button>
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
        axios.post('/api/student/login', {
          account: this.loginForm.account,
          password: this.loginForm.password
        }).then((response) => {
          let res = response.data;
          if (res.status == "200") {
            this.$router.push("/student/index");
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
      axios.get('/api/student/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result == true) {
            this.$router.push('/student/index');
          } else {
            // pass
          }
        }
      });
    }
  }
}
</script>

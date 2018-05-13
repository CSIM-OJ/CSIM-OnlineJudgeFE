<template>
<div>
  <nav-header-student></nav-header-student>
  <div id="info-section">
    <el-row>
      <el-col :span="20" :offset="2" class="box" style="min-height: 80vh;">
        <div id="title">個人中心</div>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form :model="user" label-position="top">
              <el-row>
                <el-col :span="7" :offset="1" style="margin-bottom: 30px;">
                  <el-form-item label="姓名">
                    <el-input readonly v-model="user.name" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-form-item label="學號">
                    <el-input readonly v-model="user.studentID" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-form-item label="系級">
                    <el-input readonly v-model="user.class" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7" :offset="1" style="margin-bottom: 30px;">
                  <el-form-item label="可做題目">
                    <el-input readonly v-model="user.undoNum" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-form-item label="已做題目">
                    <el-input readonly v-model="user.doneNum" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-form-item label="最佳解答">
                    <el-input readonly v-model="user.bestNum" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="margin-top: 70px;">
          <el-col :span="20" :offset="2">
            <div id="title">更改密碼</div>
            <el-form :model="changePasswordForm" label-position="top">
              <el-row>
                <el-col :span="6" :offset="1" style="margin-bottom: 30px;">
                  <el-form-item label="帳號">
                    <el-input v-model="changePasswordForm.account" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="原密碼">
                    <el-input v-model="changePasswordForm.oriPassword" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="新密碼">
                    <el-input v-model="changePasswordForm.newPassword" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" :offset="1" style="margin-top: 48px;">
                  <el-button type="primary" @click="onChangePassword">更改密碼</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'

export default {
  components: {
    NavHeaderStudent,
    NavFooter
  },
  data() {
    return {
      user: {
        name: '',
        studentID: '',
        class: '',
        bestNum: '',
        undoNum: '',
        doneNum: '',
        correctNum: '',
        errorNum: '',
      },
      changePasswordForm: {
        account: '',
        oriPassword: '',
        newPassword: ''
      }
    }
  },
  mounted() {
    this.checkLogin();
    this.getStudentInfo();
  },
  methods: {
    checkLogin() {
      axios.get('/api/student/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          // pass
        } else {
          this.$router.push('/login');
        }
      });
    },
    getStudentInfo() {
      axios.get('/api/student/info').then((response) => {
        let res = response.data;
        if(res.status=='200') {
          this.user.name = res.result.name;
          this.user.studentID = res.result.studentID;
          this.user.class = res.result.student_class;
          this.user.bestNum = res.result.bestCodeNum;
          this.user.undoNum = res.result.undoNum;
          this.user.doneNum = res.result.doneNum;
          this.user.correctNum = res.result.correctNum;
          this.user.errorNum = res.result.incorrectNum;
        }
      });
    },
    onChangePassword() {
      if (this.changePasswordForm.account == '') {
        this.$message.error('請輸入帳號！');
      } else if (this.changePasswordForm.oriPassword == '') {
        this.$message.error('請輸入原密碼！');
      } else if (this.changePasswordForm.newPassword == '') {
        this.$message.error('請輸入新密碼！');
      }

      axios.post('/api/student/changePassword', {
        account: this.changePasswordForm.account,
        oriPassword: this.changePasswordForm.oriPassword,
        newPassword: this.changePasswordForm.newPassword
      }).then((response) => {
        let res = response.data;
        if(res.status=='200') {
          this.$message({
            message: '更改密碼完成！',
            type: 'success'
          });
          this.changePasswordForm.account = '';
          this.changePasswordForm.oriPassword = '';
          this.changePasswordForm.newPassword = '';
        } else {
          this.$message.error('帳號或密碼錯誤！');
        }
      });
    }
  }
}
</script>

<template>
<div>
  <nav-header-student></nav-header-student>
  <div id="info-section">
    <el-row>
      <el-col :span="20" :offset="2" class="box" style="min-height: 80vh;">
        <el-row :gutter="20">
          <el-col :span="20" :offset="2">
            <div class="items-nav">
              <div class="item">個人中心</div>
            </div>
            <el-row>
              <el-col :span="7">
                <div class="block">
                  <div class="desc">姓 名</div>
                  <div class="main" style="color: #2E86C1;" v-text="user.name"></div>
                </div>
              </el-col>
              <el-col :span="7" :offset="1">
                <div class="block">
                  <div class="desc">學 號</div>
                  <div class="main" style="color: #239B56;" v-text="user.studentId"></div>
                </div>
              </el-col>
              <el-col :span="7" :offset="1">
                <div class="block">
                  <div class="desc">系 級</div>
                  <div class="main" style="color: #D4AC0D;" v-text="user.class"></div>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="block">
                  <div class="desc">可做題目</div>
                  <div class="main" style="color: #C0392B;" v-text="user.undoNum"></div>
                </div>
              </el-col>
              <el-col :span="7" :offset="1">
                <div class="block">
                  <div class="desc">已做題目</div>
                  <div class="main" style="color: #9B59B6;" v-text="user.doneNum"></div>
                </div>
              </el-col>
              <el-col :span="7" :offset="1">
                <div class="block">
                  <div class="desc">最佳解答</div>
                  <div class="main" style="color: #CA6F1E;" v-text="user.bestNum"></div>
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top: 70px;">
              <el-col :gutter="20">
                <div class="items-nav">
                  <div class="item">更改密碼</div>
                </div>
                <el-form :model="changePasswordForm" label-position="top">
                  <el-row style="margin-bottom: 30px;">
                    <el-col :xs="24" :sm="6">
                      <el-form-item label="帳號">
                        <el-input v-model="changePasswordForm.account" style="width: 100%;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="23" :sm="6" :offset="1">
                      <el-form-item label="原密碼">
                        <el-input v-model="changePasswordForm.oriPassword" style="width: 100%;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="23" :sm="6" :offset="1">
                      <el-form-item label="新密碼">
                        <el-input v-model="changePasswordForm.newPassword" style="width: 100%;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="23" :sm="2" :offset="1" style="margin-top: 40px;">
                      <el-button type="primary" @click="changePassword">更改密碼</el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <fab-rank></fab-rank>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'
import {studentCheckLogin} from '@/apis/_checkLogin.js'

import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'
import FabRank from '@/components/FabRank.vue'

export default {
  components: {
    NavHeaderStudent,
    NavFooter,
    FabRank
  },
  data() {
    return {
      user: {
        name: '',
        studentId: '',
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
    studentCheckLogin();
    this.getStudentInfo();
  },
  methods: {
    getStudentInfo() {
      axios.get('/api/student/info', {
        params: {
          courseId: this.$store.state.course.courseInfo.courseId
        }
      }).then((response) => {
        let res = response.data;
        if(res.status=='200') {
          this.user.name = res.result.name;
          this.user.studentId = res.result.account;
          this.user.class = res.result.studentClass;
          this.user.bestNum = res.result.bestCodeNum;
          this.user.undoNum = res.result.undoNum;
          this.user.doneNum = res.result.doneNum;
          this.user.correctNum = res.result.correctNum;
          this.user.errorNum = res.result.incorrectNum;
        }
      });
    },
    changePassword() {
      if (this.changePasswordForm.account == '') {
        this.$message.error('請輸入帳號！');
      } else if (this.changePasswordForm.oriPassword == '') {
        this.$message.error('請輸入原密碼！');
      } else if (this.changePasswordForm.newPassword == '') {
        this.$message.error('請輸入新密碼！');
      } else {
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
}
</script>

<style>
/* new design */
#info-section .block {
  height: 150px;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#info-section .block .main {
  width: 100%;
  font-size: 30px;
  text-align: center;
  margin-top: 15px;
  color: #303133;
}

#info-section .block .desc {
  width: 100%;
  text-align: center;
  color: #909399;
}
</style>

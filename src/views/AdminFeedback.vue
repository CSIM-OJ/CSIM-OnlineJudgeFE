<template>
<div>
  <el-container>
    <el-header>
      <nav-header-admin></nav-header-admin>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-admin></side-nav-admin>
      </el-aside>
      <el-container>
        <el-main>
          <el-row class="admin-page">
            <span class="title">意見回饋</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin/index' }">首頁</el-breadcrumb-item>
                <el-breadcrumb-item>意見回饋</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <el-row class="box-square">
            <el-col :span="20" :offset="2">
              <el-table :data="feedbackTableData" height="70vh" style="width: 100%;">
                <el-table-column prop="account" label="學號" width="180">
                </el-table-column>
                <el-table-column prop="date" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="feedback" label="意見回饋">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-main>
        <el-footer>
          <nav-footer-admin></nav-footer-admin>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import SideNavAdmin from '@/components/SideNavAdmin'
import NavFooterAdmin from '@/components/NavFooterAdmin'

export default {
  components: {
    NavHeaderAdmin,
    SideNavAdmin,
    NavFooterAdmin
  },
  data() {
    return {
      feedbackTableData: []
    }
  },
  mounted() {
    this.checkLogin();
    this.getStudentFeedback();
  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            this.$router.push('/student/index');
          } else if (res.result.authority == 'admin') {
            // pass
          }
        } else {
          this.$router.push('/login');
        }
      });
    },
    getStudentFeedback() {
      axios.get('/api/ta/getFeedback').then((response)=> {
        let res = response.data;
        if(res.status=='200') {
          this.feedbackTableData = res.result;
        } else {
          console.log(res.msg);
        }
      });
    }
  }
}
</script>

<template>
<div>
  <el-container>
    <el-header>
      <nav-header-assistant></nav-header-assistant>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-course-index-assistant></side-nav-course-index-assistant>
      </el-aside>
      <el-container>
        <el-main>
          <page-name-breadcrumb pageName="意見回饋"></page-name-breadcrumb>
          <el-row class="box-square">
            <el-col :span="20" :offset="2">
              <el-table :data="feedbackTableData" height="70vh" style="width: 100%;">
                <el-table-column prop="account" label="學號" width="180">
                </el-table-column>
                <el-table-column prop="date" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="content" label="意見回饋">
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
import {assistantCheckLogin} from '@/apis/_checkLogin.js'

import NavHeaderAssistant from '@/components/Assistant/NavHeaderAssistant'
import PageNameBreadcrumb from '@/components/MgmtContent/PageNameBreadcrumb'
import SideNavCourseIndexAssistant from '@/components/Assistant/SideNavCourseIndexAssistant'
import NavFooterAdmin from '@/components/NavFooterAdmin'

export default {
  components: {
    NavHeaderAssistant,
    PageNameBreadcrumb,
    SideNavCourseIndexAssistant,
    NavFooterAdmin
  },
  data() {
    return {
      feedbackTableData: []
    }
  },
  mounted() {
    assistantCheckLogin();
    this.getStudentFeedback();
  },
  methods: {
    getStudentFeedback() {
      axios.get('/api/feedback/getCourseFeedbacks', {
        params: {
          courseId: this.$store.state.course.courseInfo.courseId
        }
      }).then((response)=> {
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

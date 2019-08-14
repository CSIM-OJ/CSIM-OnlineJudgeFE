<template>
<div>
  <el-container>
    <el-header>
      <nav-header-teacher></nav-header-teacher>
    </el-header>

    <el-container>
      <el-aside width="15vw">
        <side-nav-course-index-teacher></side-nav-course-index-teacher>
      </el-aside>
      <el-container>
        <el-main>
          <page-name-breadcrumb pageName="新增題目"></page-name-breadcrumb>
          <new-problem-section></new-problem-section>
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
import {teacherCheckLogin} from '@/apis/_checkLogin.js'

import NavHeaderTeacher from '@/components/Teacher/NavHeaderTeacher'
import SideNavCourseIndexTeacher from '@/components/Teacher/SideNavCourseIndexTeacher'
import PageNameBreadcrumb from '@/components/MgmtContent/PageNameBreadcrumb'
import NewProblemSection from '@/components/MgmtProblem/NewProblemSection'
import NavFooterAdmin from '@/components/NavFooterAdmin'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseIndexTeacher,
    PageNameBreadcrumb,
    NewProblemSection,
    NavFooterAdmin
  },
  data() {
    return {}
  },
  mounted() {
    teacherCheckLogin();
  }
}
</script>
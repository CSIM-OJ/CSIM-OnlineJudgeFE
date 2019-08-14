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
import {assistantCheckLogin} from '@/apis/_checkLogin.js'

import NavHeaderAssistant from '@/components/Assistant/NavHeaderAssistant'
import SideNavCourseIndexAssistant from '@/components/Assistant/SideNavCourseIndexAssistant'
import PageNameBreadcrumb from '@/components/MgmtContent/PageNameBreadcrumb'
import NewProblemSection from '@/components/MgmtProblem/NewProblemSection'
import NavFooterAdmin from '@/components/NavFooterAdmin'

export default {
  components: {
    NavHeaderAssistant,
    SideNavCourseIndexAssistant,
    PageNameBreadcrumb,
    NewProblemSection,
    NavFooterAdmin
  },
  data() {
    return {}
  },
  mounted() {
    assistantCheckLogin();
  }
}
</script>
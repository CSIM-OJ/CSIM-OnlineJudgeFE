<template>
<div>
  <el-menu :default-active="$route.path" class="side-navbar" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" style="position: fixed; left:0px; height:100%; width: 15vw; border-right:0px;" router>
    <!-- <el-menu-item index="/admin/problemsData">
      <i class="el-icon-menu"></i>
      <span slot="title">題目列表</span>
    </el-menu-item> -->
    <el-menu-item index="/admin/newProblem">
      <i class="el-icon-menu"></i>
      <span slot="title">新增題目</span>
    </el-menu-item>
    <el-menu-item index="/admin/studentsData">
      <i class="el-icon-document"></i>
      <span slot="title">學生資訊</span>
    </el-menu-item>
    <el-menu-item index="/admin/feedback">
      <i class="el-icon-edit"></i>
      <span slot="title">意見回饋</span>
    </el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  }
}
</script>

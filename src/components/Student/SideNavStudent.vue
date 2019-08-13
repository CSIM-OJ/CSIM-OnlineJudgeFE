<template>
<div>
  <el-menu :default-active="$route.path" class="el-menu-vertical-demo" style="height: calc(100vh - 60px); overflow: initial;" router>
    <el-menu-item :index="problemIndex">
      <i class="el-icon-menu"></i>
      <span slot="title">題目列表</span>
    </el-menu-item>
    <el-menu-item :index="scorePanelIndex">
      <i class="el-icon-document"></i>
      <span slot="title">成績面板</span>
    </el-menu-item>
    <el-menu-item :index="mypageIndex">
      <i class="el-icon-setting"></i>
      <span slot="title">個人中心</span>
    </el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      problemIndex: '/student/'+this.$route.params.courseName+'/index',
      scorePanelIndex: '/student/'+this.$route.params.courseName+'/scorePanel',
      mypageIndex: '/student/'+this.$route.params.courseName+'/myPage',
    }
  },
  // mounted() {
  //   this.problemIndex = '/student/'+this.$route.params.courseName+'/index';
  //   this.scorePanelIndex = '/student/'+this.$route.params.courseName+'/scorePanel';
  //   this.mypageIndex = '/student/'+this.$route.params.courseName+'/myPage';
  // }
}
</script>
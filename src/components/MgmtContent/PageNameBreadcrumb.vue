<template>
<div>
  <el-row class="admin-page">
    <span class="title">{{ pageName }}</span>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/'+ this.$store.state.user.userInfo.authority +'/'+ this.$store.state.course.courseInfo.courseName +'/index' }">{{this.$store.state.course.courseInfo.courseName}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pageName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-row>
</div>
</template>

<script>
export default {
  components: {},
  props:['pageName'],
  data() {
    return {}
  }
}
</script>
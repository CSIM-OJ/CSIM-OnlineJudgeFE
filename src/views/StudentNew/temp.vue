<template>
<div>
<el-container>
  <el-header>
    <nav-header-student></nav-header-student>
  </el-header>

  <el-container style="height: calc(100vh - 60px); overflow: initial;">
    <el-aside width="200px" style="height: calc(100vh - 60px); overflow: initial;">
      <side-nav-student></side-nav-student>
    </el-aside>

    <el-container style="height: calc(100vh - 60px); overflow: initial;">
      <el-main style="padding-top: 0px;">
        
      </el-main>
      <el-footer><p style="text-align:center; background-color:#f5f5f5; color:rgba(0, 0, 0, 0.87);">penguin coco @ 2019</p></el-footer>
    </el-container>
    
  </el-container>
</el-container>
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
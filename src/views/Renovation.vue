<template>
<div>
  <div class="renovation">
    <div class="main">
      <img src="/static/renovation_img/1.png" alt="">
      <div class="text">維修中</div>
    </div>
  </div>
  <footer>CSIM OJ</footer>
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

<style>
.renovation {
  height: 100vh;
  position: relative;
}

.main {
  text-align: center;
  position: absolute;
  top: calc(50% - 100px);
  left: calc(50% - 75px);
}

.main img {
  width: 150px;
  border-radius: 25px;
}

.main .text {
  font-size: 30px;
  font-weight: bold;
  margin-top: 20px;
}

footer {
  width: 100%;
  text-align: center;
  position: fixed;
  bottom: 20px;
  color: #909399;
  font-weight: bold;
  transition: all .3s ease;
}

footer:hover {
  color: #409EFF;
}
</style>

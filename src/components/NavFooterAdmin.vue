<template>
<div>
  <footer id="nav-footer-admin">
    <p class="admin-programmer"><i class="fas fa-code"></i>&nbsp; 陳冠億、蘇靖軒</p>
    <p>CSIM OJ Admin &copy; {{ new Date().getFullYear() }}</p>
  </footer>
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
#nav-footer-admin {
  color: #606266;
  font-weight: bold;
  text-align: center;
  padding-bottom: 20px;
}

#nav-footer-admin .admin-programmer {
  font-weight: normal;
}
</style>

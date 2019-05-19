<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row>
    <el-col :span="20" :offset="2" class="box" style="min-height: 80vh;">
      <div class="items-nav">
        <div class="item">我的程式碼倉庫</div>
      </div>
      <el-button type="danger" icon="el-icon-plus" circle @click="newProject"></el-button>
      <section id="repository-main">
        <el-row>
          <el-col :xs="24" :sm="12" :md="6" :xl="4" v-for="(project, index) in projectTable" :key="index">
            <a @click="toProject(project.projectID)" class="project">
              <i class="fas fa-folder project-icon"></i>
              <span class="project-name">{{ project.projectName }}</span>
            </a>
          </el-col>
        </el-row>
      </section>
      <div class="items-nav" style="margin-top: 40px;">
        <div class="item">與我共享</div>
      </div>
    </el-col>
  </el-row>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'

export default {
  components: {
    NavHeaderStudent,
    NavFooter
  },
  data() {
    return {
      projectTable: [{
        projectID: '0',
        projectName: '迴圈程式asfadafas'
      }, {
        projectID: '1',
        projectName: '遞迴程式'
      }, {
        projectID: '2',
        projectName: '比賽題目'
      }, {
        projectID: '3',
        projectName: '迴圈程式asfadafas'
      }, {
        projectID: '4',
        projectName: '遞迴程式'
      }, {
        projectID: '5',
        projectName: '比賽題目'
      }],
      shareWithMe: [{

      }]
    }
  },
  methods: {
    newProject() {
      this.$prompt('請輸入專案名稱', '建立專案', {
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      }).then(({
        value
      }) => {
        let count = 0;
        for (let i = 0; i < this.projectTable.length; i++) {
          count++;
        }
        let obj = {
          projectID: count.toString(),
          projectName: value
        }
        this.projectTable.push(obj);
        console.log(this.projectTable);
        this.$message({
          type: 'success',
          message: '成功建立 ' + value + ' 專案'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消建立專案'
        });
      });
    },
    toProject(projectID) {
      this.$router.push('/student/repository/project?projectID=' + projectID);
    }
  }
}
</script>

<style>
#repository-main {
  margin-top: 10px;
}

#repository-main .project {
  display: block;
  height: 50px;
  border: solid 1px #DDDDDD;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 20px;
  margin-top: 20px;
  transition: all .3s ease;
}

#repository-main .project:hover {
  border: solid 1px #E6A23C;
  box-shadow: 3px 3px 2px rgba(20%, 20%, 30%, 0.1);
}

#repository-main .project .project-icon {
  height: 50px;
  text-align: center;
  color: #909399;
  font-size: 20px;
  margin-left: 15px;
  margin-right: 10px;
  line-height: 50px;
}

#repository-main .project .project-name {
  color: #303133;
  display: inline-block;
  width: 65%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

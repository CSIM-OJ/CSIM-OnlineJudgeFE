<template>
<div>
  <el-container>
    <el-header>
      <nav-header-teacher></nav-header-teacher>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-course-list-teacher></side-nav-course-list-teacher>
      </el-aside>
      <!-- TODO: 編輯課程 -->
      <el-container>
        <el-main>
          <el-row class="admin-page">
            <span class="title">編輯課程</span>
          </el-row>
          <el-row class="box-square" id="teacherEditCourse-section">
            <el-col :span="12" style="padding-right: 23px; padding-bottom: 30px;">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span class="title">物件導向程式設計</span>
                  <span class="courseId">
                    <span class="id">課程ID</span>13
                  </span>
                  <el-button type="text" class="edit-button" @click="editCourseDialogVisible=true">
                    編輯課程<i class="el-icon-edit"></i>
                  </el-button>
                  <el-button type="text" class="del-button" @click="delCourse">
                    刪除課程<i class="el-icon-close"></i>
                  </el-button>
                </div>
                <div class="text item marbtm">
                  <span class="item-title">課程學期(semester)</span>
                  <span class="item-content">107上</span>
                </div>
                <div class="text item marbtm">
                  <span class="item-title">班級(class)</span>
                  <span class="item-content">
                    <el-tag style="height: 25px; line-height: 25px;">資三A</el-tag>
                  </span>
                </div>
                <div class="text item">
                  <span class="item-title">助教(TA)</span>
                  <span class="item-content">蘇靖軒</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
        <el-footer>
          <nav-footer></nav-footer>
        </el-footer>

        <!-- TODO: edit course dialog start -->
        <el-dialog title="編輯課程" :visible.sync="editCourseDialogVisible" id="editCourseDialog">
          <el-form ref="form" :model="editCourseForm" label-width="80px" style="padding-bottom:25px;">
            <el-form-item label="課程名稱">
              <el-input v-model="editCourseForm.courseName" style="width: 90%;"></el-input>
            </el-form-item>
            <el-form-item label="課程名稱">
              <el-input v-model="editCourseForm.semester" style="width: 90%;"></el-input>
            </el-form-item>
            <el-form-item label="助教名單">
              <el-transfer
                filterable
                :titles="['未加入助教', '已加入助教']"
                filter-placeholder="請輸入助教名稱"
                v-model="editCourseForm.taList"
                :data="allTaList"
                @change="handleChange">
              </el-transfer>
            </el-form-item>
            <el-form-item>
              <el-button class="func-btn" type="danger" @click="cancelEdit">取消</el-button>
              <el-button class="func-btn" type="primary" style="margin-right: 20px;" @click="summitEdit">確定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- edit course dialog start -->
      </el-container>
    </el-container>
  </el-container>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderTeacher from '@/components/Teacher/NavHeaderTeacher'
import SideNavCourseListTeacher from '@/components/Teacher/SideNavCourseListTeacher'
import NavFooter from '@/components/NavFooter'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseListTeacher,
    NavFooter
  },
  data() {
    return {
      editCourseDialogVisible: false,
      editCourseForm: {
        courseName: '物件導向程式設計',
        semester: '107上',
        taList: ['04156147']
      },
      allTaList: [{
        label: '蘇靖軒',
        key: '04156147'
      }, {
        label: '陳冠毅',
        key: '06156213'
      }]
    }
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            this.$router.push('/student/courseList')
          } else if (res.result.authority == 'teacher') {
            // pass
          } else if (res.result.authority == 'assistant') {
            this.$router.push('/assistant/index');
          } else if (res.result.authority == 'admin') {
            this.$router.push('/admin/index');
          }  
        } else {
          this.$router.push('/login');
        }
      });
    },
    delCourse() {
      this.$confirm('確認是否要刪除課程', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleChange() {
      console.log(this.editCourseForm.taList);
    },
    cancelEdit() {
      this.editCourseDialogVisible = false;

      this.editCourseForm = {
        courseName: '',
        semester: '',
        taList: []
      }
    },
    summitEdit() {
      // TODO: axios
    }
  }
}
</script>

<style>
#teacherEditCourse-section .el-card {
  position: relative;
}

#teacherEditCourse-section .el-card .courseId {
  margin-right: 5px;
  position: absolute;
  right: 13px;
  top: 23px;
  color: #303133;
}

#teacherEditCourse-section .el-card .courseId .id {
  font-size: 13px;
  padding-right: 5px;
  color: #909399;
}

#teacherEditCourse-section .el-card .title {
  font-size: 20px;
  color: #303133;
}

#teacherEditCourse-section .el-card .marbtm {
  margin-bottom: 10px;
}

#teacherEditCourse-section .el-card .edit-button {
  position: absolute;
  bottom: 43px;
  right: 15px;
}

#teacherEditCourse-section .el-card .del-button {
  color: #F56C6C;
  position: absolute;
  bottom: 10px;
  right: 15px;
}

#teacherEditCourse-section .el-card .item .item-title {
  margin-right: 10px;
  color: #909399;
  font-size: 15px;
  font-weight: 200;
}

#teacherEditCourse-section .el-card .item .item-content {
  color: #303133;
}

/* editCourseDialog */

#editCourseDialog .el-transfer {
  padding-top: 10px;
}

#editCourseDialog .el-transfer .el-transfer__buttons {
  padding: 0 20px;
}

#editCourseDialog .func-btn {
  float: right;
  margin-right: 43px;
}
</style>

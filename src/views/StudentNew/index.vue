<template>
<div>
<el-container>
  <el-header>
    <navbar @onChangeMenuCollapse="onChangeMenuCollapse"></navbar>
  </el-header>

  <el-container style="height: calc(100vh - 60px); overflow: initial;">
    <el-aside width="200px" style="height: calc(100vh - 60px); overflow: initial;">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" style="height: calc(100vh - 60px); overflow: initial;">
        <el-menu-item index="1">
          <i class="el-icon-location"></i>
            <span slot="title">課程列表</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">題目列表</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">成績面板</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">個人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container style="height: calc(100vh - 60px); overflow: initial;">
      <el-main>
        <el-row>
          <el-col :span="22" :offset="1" id="newStudentIndex-section">
            <div class="header">
              <span class="course-name">{{ this.$store.state.course.courseInfo.courseName }}</span>
              <div class="right-action-bar" style="float: right;">
                <el-select class="select-custom" v-model="undoSelectValue" placeholder="選擇類型" @change="undoChange">
                  <el-option v-for="item in studIndexProblemType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select class="select-custom" v-model="undoSortValue" placeholder="排序方式" @change="undoSortChange" clearable @clear="undoSortClear" style="margin-right: 10px;">
                  <el-option label="難易度" value="rate"></el-option>
                  <el-option label="繳交期限" value="deadline"></el-option>
                </el-select>
              </div>
            </div>
            <div class="problemData-table">
              <el-table :data="undoProblems" stripe style="width: 100%" v-loading="tableLoading" highlight-current-row :row-style="{height:'60px'}">
                <el-table-column label="題目 ID" prop="problemId" width="150"></el-table-column>
                <el-table-column label="題目名稱">
                  <template slot-scope="scope">
                    <a class="id-hyperlink" href="javascript:void(0)" @click="showProblemInfo(scope.row.problemId)">{{ scope.row.name }}</a>
                    <span v-if="scope.row.status=='可作答'" style="color: #67C23A; font-size: 25px;">&bull;</span>
                    <span v-else style="color: #F56C6C; font-size: 25px;">&bull;</span>
                  </template>
                </el-table-column>
                <el-table-column label="類型" prop="type"></el-table-column>
                <el-table-column label="繳交日期" prop="deadline"></el-table-column>
                <el-table-column label="難易度">
                  <template slot-scope="scope">
                    <span><el-rate v-model="scope.row.rate" disabled text-color="#ff9900" score-template="{value}"></el-rate></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer><p style="text-align:center; background-color:#f5f5f5; color:rgba(0, 0, 0, 0.87);">penguin coco @ 2019</p></el-footer>
    </el-container>
    
  </el-container>
</el-container>



  
  <!-- <nav-header-student></nav-header-student> -->
  
</div>
</template>

<script>
import {apiProblemInfo} from '@/apis/student.js'

import problemStateMixin from '@/mixins/problemState.mixin.js'

import NavHeaderStudent from '@/components/student/NavHeaderStudent.vue'
import navbar from '@/views/StudentNew/navbar'
import NavFooter from '@/components/NavFooter.vue'

export default {
  components: {
    NavHeaderStudent,
    navbar,
    NavFooter
  },
  mixins: [problemStateMixin],
  mounted() {
    this.getUndoProblemData();
  },
  data() {
    return {
      // select
      undoSelectValue: '',
      doneSelectValue: '',
      // table
      tableLoading: false,
      undoProblems: [],
    }
  },
  methods: {
    getUndoProblemData() {
      this.tableLoading = true;
      apiProblemInfo({
        courseId: this.$store.state.course.courseInfo.courseId,
        type: '全部',
        isJudge: false
      }).then((response) => {
        let res = response.data;
        if (res.status=='200') {
          this.tableLoading = false;
          this.undoProblems = res.result;
        }
      });
    },
  }
}
</script>

<style>
#newStudentIndex-section .header {
  margin-bottom: 10px;
}

#newStudentIndex-section .header .course-name {
  font-size: 30px;
  color: #3F51B5;
}

#newStudentIndex-section .select-custom {
  width: 100px !important;
  margin-top: 3px;
  margin-left: 20px;
}

#newStudentIndex-section .select-custom .el-input .el-input__inner {
  border: 0px !important;
}

#newStudentIndex-section .select-custom .el-input {
  width: 105px;
}

/* table */
#newStudentIndex-section .problemData-table .el-table {
  border: solid 1px #DDDDDD;
}

#newStudentIndex-section .problemData-table .el-table thead {
  color: #1565C0;
  background: rgba(0,0,0,0) !important;
}

#newStudentIndex-section .problemData-table .el-table th, #newStudentIndex-section .problemData-table .el-table tr {
  background: rgba(0,0,0,0) !important;
}
</style>
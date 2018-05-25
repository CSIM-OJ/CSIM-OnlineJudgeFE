<template>
<div>
  <nav-header-admin></nav-header-admin>
  <el-row>
    <el-col :span="20" :offset="2">
      <!-- <el-alert title="助教請記得將學生加入課程內！！" type="warning" center show-icon style="margin-bottom: 30px;">
      </el-alert> -->
      <div class="box">
        <div class="manageClassGroup">
          <el-tag>{{ manageClassGroup }}</el-tag>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="題目名稱">
                      <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="已作題人數">
                      <span>{{ props.row.doneStudentNum }}</span>
                  </el-form-item>
                  <el-form-item label="題目 ID">
                      <span>{{ props.row.problemID }}</span>
                  </el-form-item>
                  <el-form-item label="未作題人數">
                      <span>{{ props.row.undoStudentNum }}</span>
                  </el-form-item>
                  <el-form-item label="難易度">
                      <span><el-rate v-model="props.row.rate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate></span>
                  </el-form-item>
                  <el-form-item label="正確率">
                      <span>{{ props.row.correctRate }}%</span>
                  </el-form-item>
                  <el-form-item label="繳交期限">
                      <span>{{ props.row.deadline }}</span>
                  </el-form-item>
                  <!-- <el-form-item label="抄襲偵測" style="width: 100%;" id="detectCopyFormItem">
                      <span><el-button type="primary" size="small" @click="detectCopy">偵測</el-button></span>
                      <div class="detectCopyTable">
                        <el-table v-if="props.row.detectCopyResult.length!=0" :data="props.row.detectCopyResult" style="width: 80%" height="250">
                          <el-table-column prop="studentOneID" label="學生1學號"></el-table-column>
                          <el-table-column prop="studentOneName" label="學生1姓名"></el-table-column>
                          <el-table-column prop="studentTwoID" label="學生2學號"></el-table-column>
                          <el-table-column prop="studentTwoName" label="學生2姓名"></el-table-column>
                          <el-table-column prop="similarity" label="相似度"></el-table-column>
                        </el-table>
                      </div>
                  </el-form-item> -->
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="題目 ID" prop="problemID"></el-table-column>
          <el-table-column label="題目名稱" prop="name"></el-table-column>
          <el-table-column label="類型" prop="type"></el-table-column>
          <el-table-column label="狀態" prop="status">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '可作答' ? 'success' : 'danger'" close-transition>{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import NavFooter from '@/components/NavFooter'

import '@/assets/css/ta-index.css'

export default {
  components: {
    NavHeaderAdmin,
    NavFooter
  },
  data() {
    return {
      // manageClassGroup
      manageClassGroup: '106資一A',
      // table
      tableData: [],
    }
  },
  mounted() {
    this.checkLogin();
    this.getProblemsData();
  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            this.$router.push('/student/index');
          } else if (res.result.authority == 'admin') {
            // pass
          }
        } else {
          this.$router.push('/login');
        }
      });
    },
    // TODO
    // table
    // handleEdit(index, data) {
    //   this.$router.push('/api/ta/editproblem?problem_id=' + data.id);
    // },
    getProblemsData() {
      axios.get('/api/ta/getProblems').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.tableData = res.result;
        }
      });
    },
    handleDelete(index, data) {
      console.log(index);
      console.log("id: " + data.id);
      console.log("name: " + data.name);

      // 刪除 api
      this.$confirm('確認是否要刪除此題目？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        axios.post('/api/ta/deleteProblem', {
          problemID: data.problemID
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '刪除成功!'
            });
            this.getProblemsData();
          }
        });
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // TODO
    detectCopy() {},

  }
}
</script>

<template>
<div>
  <el-container>
    <el-header>
      <nav-header-admin></nav-header-admin>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-admin></side-nav-admin>
      </el-aside>
      <el-container>
        <el-main>
          <el-row class="admin-page">
            <span class="title">學生管理</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin/index' }">首頁</el-breadcrumb-item>
                <el-breadcrumb-item>學生管理</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <div class="box-square">
            <el-row :gutter="20">
              <el-col :span="12" style="border-right: 1px #E4E7ED dashed;">
                <el-table class="studentDataTable" ref="multipleTable" :data="studentData" tooltip-effect="dark" height="70vh" @selection-change="handleSelectionChange" v-loading="dataLoading">
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="studentID" label="學號">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名">
                  </el-table-column>
                  <el-table-column prop="class" label="系級">
                  </el-table-column>
                </el-table>
                <el-button type="primary" @click="newOneStudentDialogVisible=true" style="float: left; margin-top: 10px;">新增</el-button>
                <div class="operating-btns">
                  <el-button @click="toggleSelection()">取消選取</el-button>
                  <el-button type="danger" :disabled="deleteFlag" @click="delSelectedStudent">刪除</el-button>
                </div>
              </el-col>
              <el-col class="uploadCsvCol" :span="12">
                <el-upload class="upload-demo" ref="upload" drag :action="action" accept=".csv" :on-success="handleSuccess" :file-list="fileList" :limit="limitFileNum" :on-exceed="onexceedFunction">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">將csv文件拖到此處，或<em>點擊上傳</em></div>
                  <div class="el-upload__tip" slot="tip">只能上傳csv文件，且不超過500kb
                    <a href="javascript:void(0);" @click="csvFormatAlert" style="color: #909399;"><i class="el-icon-info"></i></a>
                  </div>
                </el-upload>
              </el-col>
            </el-row>
          </div>
        </el-main>
        <el-footer>
          <nav-footer-admin></nav-footer-admin>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>

  <!-- newOneStudentDialog start -->
  <el-dialog title="新增學生" :visible.sync="newOneStudentDialogVisible">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form :model="newOneStudentForm">
          <el-form-item label="學生帳號 (學號)" style="margin-bottom: 5px;">
            <el-input v-model="newOneStudentForm.account"></el-input>
          </el-form-item>
          <el-form-item label="學生密碼" style="margin-bottom: 5px;">
            <el-input v-model="newOneStudentForm.password"></el-input>
          </el-form-item>
          <el-form-item label="學生姓名" style="margin-bottom: 5px;">
            <el-input v-model="newOneStudentForm.name"></el-input>
          </el-form-item>
          <el-form-item label="學生系級" style="margin-bottom: 5px;">
            <el-input v-model="newOneStudentForm.student_class"></el-input>
          </el-form-item>
          <div class="operating-btns" style="margin-bottom: 20px;">
            <el-button @click="newOneStudentDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="newOneStudentDialogVisible = false">確定</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
  <!-- newOneStudentDialog end -->

  <!-- confirmCsvDialog start -->
  <el-dialog title="確認學生名單" :visible.sync="confirmCsvDialogVisible" @close="cancelUpload">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table :data="csvFileData" style="margin-bottom: 15px;" height="336">
          <el-table-column property="account" label="帳號"></el-table-column>
          <el-table-column property="password" label="密碼"></el-table-column>
          <el-table-column property="name" label="姓名"></el-table-column>
          <el-table-column property="student_class" label="系級"></el-table-column>
        </el-table>
        <div class="operating-btns" style="margin-bottom: 20px;">
          <el-button type="danger" @click="cancelUpload">取消</el-button>
          <el-button type="primary" @click="newCsvStudent">確定新增</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
  <!-- confirmCsvDialog end -->
</div>
</template>

<script>
import axios from 'axios'
import Papa from 'papaparse'

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import SideNavAdmin from '@/components/SideNavAdmin'
import NavFooterAdmin from '@/components/NavFooterAdmin'

export default {
  components: {
    NavHeaderAdmin,
    SideNavAdmin,
    NavFooterAdmin
  },
  data() {
    return {
      studentData: [],
      dataLoading: false,
      deleteSelection: [],
      // new one student dialog
      newOneStudentDialogVisible: false,
      newOneStudentForm: {
        account: '',
        passowrd: '',
        name: '',
        student_class: ''
      },
      // upload csv
      action: 'https://jsonplaceholder.typicode.com/posts/',
      limitFileNum: 1,
      fileList: [],
      confirmCsvDialogVisible: false,
      csvFileData: [] // 被上傳的csv data
    }
  },
  computed: {
    deleteFlag() {
      if (this.deleteSelection.length == 0) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getStudentsData();
  },
  methods: {
    getStudentsData() {
      this.dataLoading = true;
      axios.get('/api/ta/getStudentsData').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          for (let i = 0; i < res.result.length; i++) {
            let obj = {
              studentID: res.result[i].studentID,
              name: res.result[i].name,
              class: res.result[i].class
            }
            this.studentData.push(obj);
          }
        }
        this.dataLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.deleteSelection = val;
      // console.log(this.deleteSelection);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    delSelectedStudent() {
      this.$confirm('確認是否刪除被選擇的學生名單?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.deleteSelection);
        let delID = []
        for (let i = 0; i < this.deleteSelection.length; i++) {
          delID.push(this.deleteSelection[i].studentID);
        }
        console.log(delID);

        // TODO axios

        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消刪除'
        });
      });
    },
    // upload csv then parse
    handleSuccess(res, file, fileList) {
      let self = this;
      // parse local csv file
      let data = Papa.parse(file.raw, {
        header: true,
        complete(results) {
          // 檢測csv是否符合格式
          let keys = Object.keys(results.data[0]);
          if (keys.sort().toString() == ["account", "password", "name", "student_class"].sort().toString()) {
            self.csvFileData = results.data;
            self.confirmCsvDialogVisible = true;
          } else {
            self.$message.error('Csv檔不符合格式！');
            self.$refs.upload.clearFiles();
          }
        },
        error(err, file, inputElem, reason) {
          self.$message.error('上傳失敗: ' + reason);
        }
      });
    },
    onexceedFunction(files, fileList) {
      let filename = files[0].name;
      this.$message.error(filename + ' 上傳失敗，只能傳送一份檔案！');
    },
    cancelUpload() {
      this.confirmCsvDialogVisible = false;
      this.$refs.upload.clearFiles();
      this.csvFileData = [];
      // console.log(this.csvFileData);
    },
    newCsvStudent() {
      // TODO
      // append csvFileData
    },
    csvFormatAlert() {
      this.$alert('account, password, name, student_class', 'Csv欄位格式', {
        dangerouslyUseHTMLString: true
      });
    }
  }
}
</script>

<style>
.studentDataTable {
  width: 100%;
}

.operating-btns {
  float: right;
  margin-top: 10px;
}

.uploadCsvCol {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 70vh;
  text-align: center;
}
</style>

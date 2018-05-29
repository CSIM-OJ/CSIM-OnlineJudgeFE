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
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
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
                  <el-form-item label="抄襲偵測" style="width: 100%;" id="detectCopyFormItem" v-loading="detectCopyLoading">
                      <span><el-button type="primary" size="small" @click="detectCopy(props.row.problemID)">偵測</el-button></span>
                      <div class="detectCopyTable">
                        <el-table v-if="props.row.detectCopyResult.length!=0" :data="props.row.detectCopyResult" style="width: 80%" height="250">
                          <el-table-column prop="studentOneID" label="學生1學號"></el-table-column>
                          <el-table-column prop="studentOneName" label="學生1姓名"></el-table-column>
                          <el-table-column prop="studentTwoID" label="學生2學號"></el-table-column>
                          <el-table-column prop="studentTwoName" label="學生2姓名"></el-table-column>
                          <el-table-column prop="similarity" label="相似度"></el-table-column>
                        </el-table>
                      </div>
                  </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="題目 ID" prop="problemID"></el-table-column>
          <el-table-column label="題目名稱">
            <template slot-scope="scope">
              <a class="id-hyperlink" href="javascript:void(0)" @click="getProblemInfo(scope.row)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
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
  <el-dialog :visible.sync="dialogFormVisible" v-loading="loading">
    <section id="problem-section">
      <el-row>
        <el-col :span="20" :offset="2">
          <div class="problem-name">
            <span v-text="problemData.name"></span>
            <span class="type" v-text="problemData.type"></span>
          </div>
          <hr>
          <div class="problem-info">
            <div class="title">Description</div>
            <div class="content" v-text="problemData.description"></div>
          </div>
          <div class="problem-info">
            <div class="title">Input</div>
            <div class="content" v-text="problemData.input"></div>
          </div>
          <div class="problem-info">
            <div class="title">Output</div>
            <div class="content" v-text="problemData.output"></div>
          </div>
          <el-row v-for="(sample, index) in problemData.samples" :key="index">
            <el-col :xs="24" :md="12">
              <div class="problem-info">
                <div class="title">
                  Sample Input {{index+1}}
                </div>
                <div class="content">
                  <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="sample.input" resize="none">
                  </el-input>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :md="12">
              <div class="problem-info">
                <div class="title">Sample Output {{index+1}}</div>
                <div class="content">
                  <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="sample.output" resize="none">
                  </el-input>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible=false">確 定</el-button>
    </div>
  </el-dialog>
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
      detectCopyLoading: false,
      tableData: [],
      loading: false,
      // dialogForm
      dialogFormVisible: false,
      problemData: {
        'id': this.$route.query.problemID,
        'judged': null,
        'name': '',
        'rate': null,
        'type': '',
        'description': '',
        'input': '',
        'output': '',
        'samples': [{
          'input': '',
          'output': ''
        }, {
          'input': '',
          'output': ''
        }],
        'correctNum': null,
        'incorrectNum': null
      },
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
      this.loading = true;
      axios.get('/api/ta/getProblems').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.tableData = res.result;
          this.loading = false;
        }
      });
    },
    handleDelete(index, data) {
      this.$confirm('確認是否要刪除此題目？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        this.loading = true;
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
            this.loading = false;
          }
        });
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    detectCopy(problemID) {
      this.detectCopyLoading = true;
      axios.post('/api/ta/judgeCopy', {
        problemID: problemID
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.$message({
            type: 'success',
            message: problemID + ' 抄襲判別完成!'
          });
          this.getProblemsData();
          this.detectCopyLoading = false;
        } else {
          this.detectCopyLoading = false;
          this.$message.error('判別抄襲失敗');
        }
      })
    },
    getProblemInfo(data) {
      axios.get('/api/problem/getInfo', {
        params: {
          problemID: data.problemID
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          console.log(res.result);
          this.problemData.name = res.result.name;
          this.problemData.type = res.result.type;
          this.problemData.description = res.result.desc;
          this.problemData.input = res.result.inputDesc;
          this.problemData.output = res.result.outputDesc;
          this.problemData.samples[0].input = res.result.inputSample1.replace(new RegExp("/n ", "g"), '\n');
          this.problemData.samples[0].output = res.result.outputSample1.replace(new RegExp("/n ", "g"), '\n');
          this.problemData.samples[1].input = res.result.inputSample2.replace(new RegExp("/n ", "g"), '\n');;
          this.problemData.samples[1].output = res.result.outputSample2.replace(new RegExp("/n ", "g"), '\n');
          this.problemData.correctNum = parseInt(res.result.correctNum);
          this.problemData.incorrectNum = parseInt(res.result.incorrectNum);
        }
      });
      this.dialogFormVisible = true;
    }
  }
}
</script>

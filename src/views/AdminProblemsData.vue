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
            <span class="title">題目列表</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin/index' }">首頁</el-breadcrumb-item>
                <el-breadcrumb-item>題目列表</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <div class="box-square">
            <!-- <div class="manageClassGroup">
              <el-tag>{{ manageClassGroup }}</el-tag>
            </div> -->
            <el-input class='filterInput' v-model='filterQuery' placeholder='請輸入題目ID或名稱' clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
            <el-table :data="tableFiltered" style="width: 100%" v-loading="loading">
              <el-table-column type="expand">
                <template slot-scope="props">
                <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="題目名稱">
                        <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="已作題人數">
                        <span>{{ props.row.doneStudentNum }}</span>
                        <span class="overview" @click="viewDoStatus(props.row.name, 'done')">&nbsp;<i class="fas fa-file-alt"></i></span>
                    </el-form-item>
                    <el-form-item label="題目 ID">
                        <span>{{ props.row.problemID }}</span>
                    </el-form-item>
                    <el-form-item label="未作題人數">
                        <span>{{ props.row.undoStudentNum }}</span>
                        <span class="overview" @click="viewDoStatus(props.row.name, 'undo')">&nbsp;<i class="fas fa-file-alt"></i></span>
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
                    <el-form-item label="最佳解答">
                        <span>{{ props.row.bestStudentID }}&nbsp;{{ props.row.bestStudentName }}&nbsp;({{ props.row.bestRunTime }} ms)</span>
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
                  <span v-if="scope.row.status=='可作答'" style="color: #67C23A; font-size: 25px;">&bull;</span>
                  <span v-else style="color: #F56C6C; font-size: 25px;">&bull;</span>
                </template>
              </el-table-column>
              <el-table-column label="類型" prop="type"></el-table-column>
              <el-table-column label="作題率">
                <template slot-scope="scope">
                  <span>{{ (parseInt(scope.row.doneStudentNum)/(parseInt(scope.row.doneStudentNum)+ parseInt(scope.row.undoStudentNum))*100).toFixed(1) }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="難易度">
                <template slot-scope="scope">
                  <span><el-rate v-model="scope.row.rate" disabled text-color="#ff9900" score-template="{value}"></el-rate></span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="狀態" prop="status">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === '可作答' ? 'success' : 'danger'" close-transition>{{scope.row.status}}</el-tag>
                </template>
              </el-table-column> -->
              <el-table-column label="操作">
                <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">編輯</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">刪除</el-button>
              </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
        <el-footer>
          <nav-footer-admin></nav-footer-admin>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
  <!-- edit problem dialog start -->
  <el-dialog id="editProblemDialog" :visible.sync="editProblemDialogVisible" v-loading="editProblemLoading">
    <el-form :model="form">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="讀寫檔">
            <el-checkbox-group v-model="editProblemData.readWriteList">
              <el-checkbox label="讀檔" border></el-checkbox>
              <el-checkbox label="寫檔" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="2">
          <el-form-item label="題目名稱">
            <el-input v-model="editProblemData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="題目類型">
            <el-select v-model="editProblemData.type" placeholder="請選擇類型" style="width: 100%;">
              <el-option label="作業" value="作業"></el-option>
              <el-option label="練習題" value="練習題"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="題目期限">
            <el-date-picker type="date" placeholder="選擇繳交期限" v-model="editProblemData.deadline" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="題目說明">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="輸入說明">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="輸出說明">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.output"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="輸入範例1">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.inputSample1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="輸出範例1">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.outputSample1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="輸入範例2">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.inputSample2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="輸出範例2">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.outputSample2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="特殊輸入範例">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.inputSample3"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="特殊輸出範例">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.outputSample3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editProblemDialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="editProblem">確 定</el-button>
    </div>
  </el-dialog>
  <!-- edit problem dialog end -->
  <!-- problem dialog start -->
  <el-dialog id="viewProblemDialog" :visible.sync="problemDialogVisible" v-loading="loading">
    <section id="problem-section">
      <el-row>
        <el-col :span="20" :offset="2">
          <div class="problem-name">
            <span v-text="problemData.name"></span>
            <span v-text="problemData.id" style="font-size: 16px; color: #909399; font-weight: 500;"></span>
            <span class="type" v-text="problemData.type"></span>
            <span class="deadline" v-text="problemData.deadline"></span>
          </div>
          <hr>
          <div class="problem-info">
            <div class="title">Description</div>
            <div id="markdown-editor">
              <vue-markdown class="content" :source="problemData.description"></vue-markdown>
            </div>
          </div>
          <div class="problem-info">
            <div class="title">Input</div>
            <div class="content change-line" v-text="problemData.input"></div>
          </div>
          <div class="problem-info">
            <div class="title">Output</div>
            <div class="content change-line" v-text="problemData.output"></div>
          </div>
          <el-row>
            <el-col :xs="24" :sm="12">
              <div class="problem-info">
                <div class="title">Sample Input 1</div>
                <div class="content">
                  <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="problemData.inputSample1" resize="none">
                  </el-input>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12">
              <div class="problem-info">
                <div class="title">Sample Output 1</div>
                <div class="content">
                  <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="problemData.outputSample1" resize="none">
                  </el-input>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12">
              <div class="problem-info">
                <div class="title">Sample Input 2</div>
                <div class="content">
                  <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="problemData.inputSample2" resize="none">
                  </el-input>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12">
              <div class="problem-info">
                <div class="title">Sample Output 2</div>
                <div class="content">
                  <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="problemData.outputSample2" resize="none">
                  </el-input>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="problemDialogVisible=false">確 定</el-button>
    </div>
  </el-dialog>
  <!-- problem dialog end -->
  <!-- done & undo dialog start -->
  <el-dialog :visible.sync="doInfoDialogVisible">
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="items-nav">
          <div class="item">{{ doInfoDialogPName }}</div>
        </div>
        <el-table max-height="350" :data="doStatusData" style="width: 100%; margin-bottom: 60px;">
          <el-table-column prop="studentID" label="學生學號">
          </el-table-column>
          <el-table-column prop="studentName" label="學生姓名"></el-table-column>
          <el-table-column prop="score" label="成績"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
  <!--done & undo dialog end -->
</div>
</template>

<script>
import axios from 'axios'
import VueMarkdown from 'vue-markdown'

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import SideNavAdmin from '@/components/SideNavAdmin'
import NavFooterAdmin from '@/components/NavFooterAdmin'

import '@/assets/css/ta-index.css'

export default {
  components: {
    NavHeaderAdmin,
    SideNavAdmin,
    NavFooterAdmin,
    VueMarkdown
  },
  data() {
    return {
      // manageClassGroup
      manageClassGroup: '106資一A',
      // table
      detectCopyLoading: false,
      tableData: [],
      loading: false,
      filterQuery: '',
      // edit problem dialog
      editProblemDialogVisible: false,
      editProblemLoading: false,
      editProblemData: {
        'id': '',
        'readWriteList': [],
        'name': '',
        'type': '',
        'deadline': '',
        'description': '',
        'input': '',
        'output': '',
        'inputSample1': '',
        'outputSample1': '',
        'inputSample2': '',
        'outputSample2': '',
        'inputSample3': '',
        'outputSample3': ''
      },
      // problem dialog
      problemDialogVisible: false,
      problemData: {
        'id': '',
        'judged': null,
        'name': '',
        'rate': null,
        'type': '',
        'deadline': '',
        'description': '',
        'input': '',
        'output': '',
        'inputSample1': '',
        'outputSample1': '',
        'inputSample2': '',
        'outputSample2': '',
        'correctNum': null,
        'incorrectNum': null
      },
      // student dialog
      studentData: [], // getStudentsData
      doInfoDialogVisible: false,
      doInfoDialogPName: '',
      doInfoDialogStatus: ''
    }
  },
  computed: {
    // problems data table
    tableFiltered() {
      let oriTable = this.tableData;
      let filteredTable = [];

      if (this.filterQuery == '') {
        return oriTable
      } else {
        for (let i = 0; i < oriTable.length; i++) {
          if (oriTable[i].problemID.includes(this.filterQuery) || oriTable[i].name.includes(this.filterQuery)) {
            filteredTable.push(oriTable[i]);
          }
        }
        return filteredTable
      }
    },
    doStatusData() {
      // TODO 使用PID判別
      let data = this.studentData;
      let flag = this.doInfoDialogStatus;
      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        let id = data[i].studentID;
        let name = data[i].name;
        let problems = data[i].problems;
        // 已作答的狀況
        if (flag == 'done') {
          for (let j = 0; j < problems.length; j++) {
            if (problems[j].name == this.doInfoDialogPName && problems[j].score != '未作答') {
              let obj = {
                studentID: id,
                studentName: name,
                score: problems[j].score
              };
              tableData.push(obj)
            }
          }
        } else if (flag == 'undo') { // 未作答的狀況
          for (let j = 0; j < problems.length; j++) {
            if (problems[j].name == this.doInfoDialogPName && problems[j].score == '未作答') {
              let obj = {
                studentID: id,
                studentName: name,
                score: problems[j].score
              };
              tableData.push(obj)
            }
          }
        }
      }
      return tableData
    }
    // formatedDeadline() {
    //   return this.formatDate(this.editProblemData.deadline)
    // }
  },
  mounted() {
    this.checkLogin();
    this.getProblemsData();
    this.getStudentsData();
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
    getProblemsData() {
      this.loading = true;
      axios.get('/api/ta/getProblems').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          console.log(res.result);
          this.tableData = res.result;
          this.loading = false;
        }
      });
    },
    getStudentsData() {
      axios.get('/api/ta/getStudentsData').then((response) => {
        let res = response.data;
        if (res.status == '200') {
          // console.log(res.result);
          this.studentData = res.result;
        }
      });
    },
    handleEdit(index, data) {
      this.$confirm('確認是否要編輯此題目？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        axios.get('/api/problem/getInfo', {
          params: {
            problemID: data.problemID
          }
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.editProblemData.id = data.problemID;
            this.editProblemData.name = res.result.name;
            this.editProblemData.type = res.result.type;
            this.editProblemData.deadline = res.result.deadline;
            this.editProblemData.description = res.result.desc;
            this.editProblemData.readWriteList = []; // 先清空
            if (res.result.readFile == true) {
              this.editProblemData.readWriteList.push('讀檔');
            }
            if (res.result.writeFile == true) {
              this.editProblemData.readWriteList.push('寫檔');
            }
            this.editProblemData.input = res.result.inputDesc;
            this.editProblemData.output = res.result.outputDesc;
            this.editProblemData.inputSample1 = res.result.inputSample1.replace(new RegExp(" /n ", "g"), '\n');
            this.editProblemData.outputSample1 = res.result.outputSample1.replace(new RegExp(" /n ", "g"), '\n');
            this.editProblemData.inputSample2 = res.result.inputSample2.replace(new RegExp(" /n ", "g"), '\n');;
            this.editProblemData.outputSample2 = res.result.outputSample2.replace(new RegExp(" /n ", "g"), '\n');
            this.editProblemData.inputSample3 = res.result.inputSample3.replace(new RegExp(" /n ", "g"), '\n');;
            this.editProblemData.outputSample3 = res.result.outputSample3.replace(new RegExp(" /n ", "g"), '\n');
          }
        });
        this.editProblemDialogVisible = true;
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
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
          this.problemData.id = data.problemID;
          this.problemData.name = res.result.name;
          this.problemData.type = res.result.type;
          this.problemData.deadline = res.result.deadline;
          this.problemData.description = res.result.desc;
          this.problemData.input = res.result.inputDesc;
          this.problemData.output = res.result.outputDesc;
          this.problemData.inputSample1 = res.result.inputSample1.replace(new RegExp(" /n ", "g"), '\n');
          this.problemData.outputSample1 = res.result.outputSample1.replace(new RegExp(" /n ", "g"), '\n');
          this.problemData.inputSample2 = res.result.inputSample2.replace(new RegExp(" /n ", "g"), '\n');;
          this.problemData.outputSample2 = res.result.outputSample2.replace(new RegExp(" /n ", "g"), '\n');
          this.problemData.correctNum = parseInt(res.result.correctNum);
          this.problemData.incorrectNum = parseInt(res.result.incorrectNum);
        }
      });
      this.problemDialogVisible = true;
    },
    viewDoStatus(problemName, status) {
      this.doInfoDialogPName = problemName;
      this.doInfoDialogStatus = status;
      this.doInfoDialogVisible = true;
    },
    formatDate(oriDate) {
      let d = new Date(oriDate);
      let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      return date
    },
    editProblem() {
      if (this.editProblemData.name == '') {
        this.$message.error('請填寫題目名稱！');
      } else if (this.editProblemData.type == '') {
        this.$message.error('請選擇題目類型！');
      } else if (this.editProblemData.deadline == '') {
        this.$message.error('請選定截止日期！');
      } else if (this.editProblemData.description == '') {
        this.$message.error('請填寫題目說明！');
      } else if (this.editProblemData.input == '') {
        this.$message.error('請填寫題目輸入說明！');
      } else if (this.editProblemData.output == '') {
        this.$message.error('請填寫題目輸出說明！');
      } else if (this.editProblemData.inputSample1 == '') {
        this.$message.error('請填寫題目輸入範例1！');
      } else if (this.editProblemData.outputSample1 == '') {
        this.$message.error('請填寫題目輸出範例1！');
      } else if (this.editProblemData.inputSample2 == '') {
        this.$message.error('請填寫題目輸入範例2！');
      } else if (this.editProblemData.outputSample2 == '') {
        this.$message.error('請填寫題目輸出範例2！');
      } else {
        this.editProblemLoading = true;
        axios.post('/api/ta/editProblem', {
          problemID: this.editProblemData.id,
          readWriteList: this.editProblemData.readWriteList,
          name: this.editProblemData.name,
          type: this.editProblemData.type,
          deadline: this.formatDate(this.editProblemData.deadline),
          desc: this.editProblemData.description,
          inputDesc: this.editProblemData.input,
          outputDesc: this.editProblemData.output,
          inputSample1: this.editProblemData.inputSample1.replace(/\n/g, ' /n '),
          outputSample1: this.editProblemData.outputSample1.replace(/\n/g, ' /n '),
          inputSample2: this.editProblemData.inputSample2.replace(/\n/g, ' /n '),
          outputSample2: this.editProblemData.outputSample2.replace(/\n/g, ' /n '),
          inputSample3: this.editProblemData.inputSample3.replace(/\n/g, ' /n '),
          outputSample3: this.editProblemData.outputSample3.replace(/\n/g, ' /n ')
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '編輯題目成功!'
            });
            this.editProblemData = {
              'readWriteList': [],
              'name': '',
              'type': '',
              'deadline': '',
              'description': '',
              'input': '',
              'output': '',
              'inputSample1': '',
              'outputSample1': '',
              'inputSample2': '',
              'outputSample2': '',
              'inputSample3': '',
              'outputSample3': ''
            }
            this.editProblemDialogVisible = false;
            this.editProblemLoading = false;
            this.getProblemsData();
          } else {
            this.editProblemLoading = false;
            this.$message.error(res.msg);
          }
        });
      }
    }
  }
}
</script>

<style>
.overview {
  transition: all .3s ease;
}

.overview:hover {
  color: #409EFF;
  cursor: pointer;
}

#editProblemDialog .el-dialog {
  width: 70vw;
}

#viewProblemDialog .el-dialog {
  width: 70vw;
}
</style>

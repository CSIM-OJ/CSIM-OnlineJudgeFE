<template>
<div>
  <el-container>
    <el-header>
      <nav-header-teacher></nav-header-teacher>
    </el-header>
    <el-container>
      <el-aside width="15vw">
        <side-nav-course-index-teacher></side-nav-course-index-teacher>
      </el-aside>
      <el-container>
        <el-main>
          <el-row class="admin-page">
            <span class="title">題目列表</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/teacher/'+ courseInfo.courseName +'/index' }">{{ courseInfo.courseName }}</el-breadcrumb-item>
                <el-breadcrumb-item>題目列表</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <div class="box-square">
            <!-- <div class="manageClassGroup">
              <el-tag>{{ manageClassGroup }}</el-tag>
            </div> -->
            <el-input class='filterInput' v-model='filterQuery' placeholder='請輸入題目ID或名稱' clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
            <el-table :data="tableFiltered.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%" v-loading="loading">
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
                        <span>{{ props.row.problemId }}</span>
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
                        <span>{{ props.row.bestStudentId }}&nbsp;{{ props.row.bestStudentName }}&nbsp;({{ props.row.bestRunTime }} ms)</span>
                    </el-form-item>
                    <el-form-item label="抄襲偵測" style="width: 100%;" id="detectCopyFormItem" v-loading="detectCopyLoading">
                        <span><el-button type="primary" size="small" @click="detectCopy(props.row.problemId)">偵測</el-button></span>
                        <div class="detectCopyTable">
                          <el-table v-if="props.row.detectCopyResult.length!=0" :data="props.row.detectCopyResult" style="width: 80%" height="257">
                            <el-table-column prop="studentOneId" label="學生1學號"></el-table-column>
                            <el-table-column prop="studentOneName" label="學生1姓名"></el-table-column>
                            <el-table-column prop="studentTwoId" label="學生2學號"></el-table-column>
                            <el-table-column prop="studentTwoName" label="學生2姓名"></el-table-column>
                            <el-table-column prop="similarity" label="相似度"></el-table-column>
                          </el-table>
                        </div>
                    </el-form-item>
                </el-form>
              </template>
              </el-table-column>
              <el-table-column label="題目 ID" prop="problemId"></el-table-column>
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
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">編輯</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">刪除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="text-align: center;margin-top: 30px;">
            <el-pagination background layout="prev, pager, next" :total="total" @current-change="currentChange"></el-pagination>
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
    <el-form :model="form" >
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="題目作答類型">
            <el-radio-group v-model="editProblemData.category">
              <el-radio label="輸入輸出" border>輸入輸出</el-radio>
              <el-radio label="輸入寫檔" border>輸入寫檔</el-radio>
              <el-radio label="讀檔輸出" border>讀檔輸出</el-radio>
              <el-radio label="讀檔寫檔" border>讀檔寫檔</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <!-- TODO: TAGs -->
          <el-form-item label="題目標籤">
            <el-tag :key="tag" v-for="tag in editProblemData.tag" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-autocomplete class="input-new-tag" v-if="inputVisible" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" v-model="inputValue" popper-class="my-autocomplete" :fetch-suggestions="querySearch" @select="handleSelect">
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <!-- <span class="addr">{{ item.address }}</span> -->
              </template>
            </el-autocomplete>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </el-form-item>
          <!-- TODO: TAGs -->
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
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.inputDesc"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="輸出說明">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.outputDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="輸入範例1">
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.inputDescSample1"></el-input>
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
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.inputDescSample2"></el-input>
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
            <el-input type="textarea" rows="5" resize="vertical" v-model="editProblemData.inputDescSample3"></el-input>
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
            <div class="content change-line" v-text="problemData.inputDesc"></div>
          </div>
          <div class="problem-info">
            <div class="title">Output</div>
            <div class="content change-line" v-text="problemData.outputDesc"></div>
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
  <el-dialog :visible.sync="doInfoDialogVisible" @close="doInfoDialogActiveStudentCode=false;">
    <el-row v-if="doInfoDialogActiveStudentCode==false">
      <el-col :span="20" :offset="2">
        <div class="items-nav">
          <div class="item">{{ doInfoDialogPName }}</div>
        </div>
        <el-table max-height="336" :data="doStatusData" style="width: 100%; margin-bottom: 60px;">
          <el-table-column prop="studentId" label="學生學號">
          </el-table-column>
          <el-table-column prop="studentName" label="學生姓名"></el-table-column>
          <el-table-column prop="score" label="成績"></el-table-column>
          <el-table-column v-if="doInfoDialogStatus=='done'" label="程式碼">
            <template slot-scope="scope">
              <span><a @click="seeStudentCode(scope.row)" href="javascript:void(0)" style="color: #409EFF; text-decoration: none;"><i class="fas fa-code"></i> 檢視</a></span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row v-if="doInfoDialogActiveStudentCode">
      <el-col>
        <div class="code">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
              <a href="javascript:void(0)" @click="doInfoDialogActiveStudentCode=false" style="text-decoration: none; ">{{doInfoDialogPName}}</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{doInfoDianlogNowStudentId}} {{doInfoDianlogNowStudentName}}</el-breadcrumb-item>
          </el-breadcrumb>
          <codemirror v-model="doInfoDianlogNowStudentCode" :options="options" style="margin-top: 20px;"></codemirror>
          <a class="code-copy" @click="copy(doInfoDianlogNowStudentCode)"><i class="el-icon-document"></i>複製代碼</a>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
  <!--done & undo dialog end -->
</div>
</template>

<script>
import axios from 'axios'
import VueMarkdown from 'vue-markdown'
import { codemirror } from 'vue-codemirror-lite'
import DateUtil from '@/utils/DateUtil.js'
import GeneralUtil from '@/utils/GeneralUtil.js'

import NavHeaderTeacher from '@/components/Teacher/NavHeaderTeacher'
import SideNavCourseIndexTeacher from '@/components/Teacher/SideNavCourseIndexTeacher'
import NavFooterAdmin from '@/components/NavFooterAdmin'

import '@/assets/css/ta-index.css'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseIndexTeacher,
    NavFooterAdmin,
    VueMarkdown,
    codemirror
  },
  data() {
    return {
      courseInfo: {
        'courseId': '',
        'courseName': '',
        'semester': ''
      },
      // pagination
      total: 0,
      pagesize:10,
      currentPage:1,
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
      // TODO: NEW category & tag[]
      editProblemData: {
        'id': '',
        'name': '',
        'type': '',
        'category': '',
        'tag': [],
        'deadline': '',
        'description': '',
        'inputDesc': '',
        'outputDesc': '',
        'testCases': []
      },
      // problem dialog
      problemDialogVisible: false,
      // TODO: 
      problemData: {
        'id': '',
        'judged': null,
        'name': '',
        'rate': null,
        'type': '',
        'category': '',
        'tag': [],
        'deadline': '',
        'description': '',
        'inputDesc': '',
        'outputDesc': '',
        'testCases': [],
        'correctNum': null,
        'incorrectNum': null
      },
      // student dialog
      studentData: [], // getStudentsData
      doInfoDialogVisible: false,
      doInfoDialogPName: '',
      doInfoDialogStatus: '',
      doInfoDialogActiveStudentCode: false, // 是否正在檢視學生的code
      doInfoDianlogNowStudentId: '', // 當下檢視的學生的學號
      doInfoDianlogNowStudentName: '', // 當下檢視的學生的姓名
      doInfoDianlogNowStudentCode: '', // 當下檢視的學生code
      // codemirror options
      options: {
        mode: 'text/x-java',
        theme: 'default',
        indentUnit: 4, // 縮進單位
        tabSize: 4,
        lineNumbers: true,
        matchBrackets: true, // 括號匹配
        smartIndent: true, // 自動縮排
        autoCloseBrackets: true, // 括號補全
        viewportMargin: Infinity,
        gutter: true,
        fixedGutter: true,
        extraKeys: {
          'Ctrl-Space': 'autocomplete'
        },
        showCursorWhenSelecting: true, // 反白時顯示鼠標位置
        // 代碼折疊
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        readOnly: 'nocursor'
      },
      // TODO: tags
      inputVisible: false,
      inputValue: '',
      autoCompleteTags: [],
      // loading
      loading: false
    }
  },
  computed: {
    // problems data table
    tableFiltered() {
      let oriTable = this.tableData;
      let filteredTable = [];

      if (this.filterQuery == '') {
        // pagination
        this.total= oriTable.length;
        return oriTable
      } else {
        for (let i = 0; i < oriTable.length; i++) {
          if (oriTable[i].problemId.includes(this.filterQuery) || oriTable[i].name.includes(this.filterQuery)) {
            filteredTable.push(oriTable[i]);
          }
        }
        // pagination
        this.total= filteredTable.length;
        return filteredTable
      }
    },
    doStatusData() {
      // TODO 使用PID判別
      let data = this.studentData;
      // console.log(data);
      let flag = this.doInfoDialogStatus;
      let tempTableData = [];
      for (let i = 0; i < data.length; i++) {
        let id = data[i].studentId;
        let name = data[i].studentName;
        let problems = data[i].problems;
        // 已作答的狀況
        if (flag == 'done') {
          for (let j = 0; j < problems.length; j++) {
            // TODO: new
            if (problems[j].name==this.doInfoDialogPName && problems[j].historyCode.slice(-1)[0].score!='未作答') {
              let obj = {
                studentId: id,
                studentName: name,
                score: problems[j].historyCode.slice(-1)[0].score,
                code: problems[j].historyCode.slice(-1)[0].code
              };
              tempTableData.push(obj)
            }
          }
        } else if (flag == 'undo') { // 未作答的狀況
          for (let j = 0; j < problems.length; j++) {
            if (problems[j].name==this.doInfoDialogPName && problems[j].historyCode.slice(-1)[0].score=='未作答') {
              let obj = {
                studentId: id,
                studentName: name,
                code: problems[j].historyCode.slice(-1)[0].code
              };
              tempTableData.push(obj)
            }
          }
        }
      }
      return tempTableData
    }
  },
  mounted() {
    this.checkLogin();
    this.getCourses();
    // this.getProblemsData();
    // this.getStudentsData();
    this.autoCompleteTags = this.loadAll();
  },
  methods: {
    currentChange(currentPage) {
      this.currentPage = currentPage;
    },
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
            // this.$router.push('/admin/index');
          }  
        } else {
          this.$router.push('/login');
        }
      });
    },
    getCourses() {
      axios.get("/api/teacher/courseList").then((response)=> {
        let res = response.data;
        if(res.status=="200") {
          res.result.forEach((element) => {
            if(element.courseName == this.$route.params.courseName) {
              this.courseInfo = element;
            }
          });

          this.getProblemsData();
          this.getStudentsData();
        }
      });
    },
    // TODO: 暫時沒問題
    getProblemsData() {
      this.loading = true;
      axios.get('/api/problem/getProblems', {
        params: {
          courseId: this.courseInfo.courseId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          console.log(res.result);
          this.tableData = res.result;
          this.loading = false;
        }
      });
    },
    // TODO: 暫時沒問題
    getStudentsData() {
      axios.get('/api/course/getStudentsData', {
        params: {
          courseId: this.courseInfo.courseId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          console.log(res.result);
          this.studentData = res.result;
        }
      });

      // TODO: new api
      // axios.get('/api/course/getStudentsData').then((response) => {
      //   let res = response.data;
      //   if (res.status == '200') {
      //     // console.log(res.result);
      //     this.studentData = res.result;
      //   }
      // });
    },
    handleEdit(index, data) {
      this.$confirm('確認是否要編輯此題目？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        // TODO: 多加 category & tag
        axios.get('/api/problem/getInfo', {
          params: {
            problemId: data.problemId
          }
        }).then((response) => {
          let res = response.data;
          console.log(res.result);
          if (res.status == '200') {
            this.editProblemData.id = data.problemId;
            this.editProblemData.name = res.result.name;
            this.editProblemData.type = res.result.type;
            // TODO: 新欄位
            this.editProblemData.category = res.result.category;
            this.editProblemData.tag = res.result.tag;
            this.editProblemData.deadline = res.result.deadline;
            this.editProblemData.description = res.result.description;
            this.editProblemData.inputDesc = res.result.inputDesc;
            this.editProblemData.outputDesc = res.result.outputDesc;
            this.editProblemData.testCases = res.result.testCases;
            console.log(this.editProblemData);
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
        axios.post('/api/problem/deleteProblem', {
          problemId: data.problemId
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
    detectCopy(problemId) {
      this.detectCopyLoading = true;
      axios.post('/api/ta/judgeCopy', {
        problemId: problemId
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.$message({
            type: 'success',
            message: problemId + ' 抄襲判別完成!'
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
          problemId: data.problemId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.problemData.id = data.problemId;
          this.problemData.name = res.result.name;
          this.problemData.type = res.result.type;
          // TODO: new category & tag
          this.problemData.category = res.result.category;
          this.problemData.tag = res.result.tag;
          this.problemData.deadline = res.result.deadline;
          this.problemData.description = res.result.desc;
          this.problemData.inputDescDesc = res.result.inputDesc;
          this.problemData.outputDesc = res.result.outputDesc;
          this.problemData.testCases = res.result.testCases;
          // this.problemData.inputDescSample1 = res.result.inputSample1.replace(new RegExp(" /n ", "g"), '\n');
          // this.problemData.outputSample1 = res.result.outputSample1.replace(new RegExp(" /n ", "g"), '\n');
          // this.problemData.inputDescSample2 = res.result.inputSample2.replace(new RegExp(" /n ", "g"), '\n');;
          // this.problemData.outputSample2 = res.result.outputSample2.replace(new RegExp(" /n ", "g"), '\n');
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
    seeStudentCode(data) {
      this.doInfoDianlogNowStudentId = data.studentId;
      this.doInfoDianlogNowStudentName = data.studentName;
      this.doInfoDianlogNowStudentCode = data.code;
      this.doInfoDialogActiveStudentCode = true;
    },
    editProblem() {
      if (this.editProblemData.name == '') {
        this.$message.error('請填寫題目名稱！');
      } else if (this.editProblemData.type == '') {
        this.$message.error('請選擇題目類型！');
      } else if (this.editProblemData.category == '') {
        this.$message.error('請選定題目作答類型！');
      } else if (this.editProblemData.tag.length == 0) {
        this.$message.error('請至少選擇程式語言的標籤！');
      } else if (this.editProblemData.deadline == '') {
        this.$message.error('請選定截止日期！');
      } else if (this.editProblemData.description == '') {
        this.$message.error('請填寫題目說明！');
      } else if (this.editProblemData.inputDescDesc == '') {
        this.$message.error('請填寫題目輸入說明！');
      } else if (this.editProblemData.outputDesc == '') {
        this.$message.error('請填寫題目輸出說明！');
      } else if (this.editProblemData.testCases.length == 0) {
        this.$message.error('請填寫題目輸入範例！');
      } else if (this.editProblemData.testCases.length == 1) {
        this.$message.error('請至少填寫兩組題目輸入範例！');
      } else {
        this.editProblemLoading = true;
        axios.post('/api/problem/editProblem', {
          problemId: this.editProblemData.id,
          name: this.editProblemData.name,
          type: this.editProblemData.type,
          // TODO: new
          category: this.editProblemData.category,
          tag: this.editProblemData.tag,
          deadline: DateUtil.formatDate(this.editProblemData.deadline),
          description: this.editProblemData.description,
          inputDesc: this.editProblemData.inputDesc,
          outputDesc: this.editProblemData.outputDesc,
          testCases: this.editProblemData.testCases
          // inputSample1: this.editProblemData.inputDescSample1.replace(/\n/g, ' /n '),
          // outputSample1: this.editProblemData.outputSample1.replace(/\n/g, ' /n '),
          // inputSample2: this.editProblemData.inputDescSample2.replace(/\n/g, ' /n '),
          // outputSample2: this.editProblemData.outputSample2.replace(/\n/g, ' /n '),
          // inputSample3: this.editProblemData.inputDescSample3.replace(/\n/g, ' /n '),
          // outputSample3: this.editProblemData.outputSample3.replace(/\n/g, ' /n ')
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '編輯題目成功!'
            });
            this.editProblemData = {
              'id': '',
              'name': '',
              'type': '',
              'category': '',
              'tag': [],
              'deadline': '',
              'description': '',
              'inputDesc': '',
              'outputDesc': '',
              'testCases': []
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
    },
    copy(s) {
      // 複製功能
      GeneralUtil.copy(s);
      // success msg
      this.$message({
        message: '複製成功',
        type: 'success'
      });
    },
    // TODO: tags control methods
    handleClose(tag) {
      this.editProblemData.tag.splice(this.editProblemData.tag.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.editProblemData.tag.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // TODO: tags autocomplete
    querySearch(queryString, cb) {
      var autoCompleteTags = this.autoCompleteTags;
      var results = queryString ? autoCompleteTags.filter(this.createFilter(queryString)) : autoCompleteTags;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (tag) => {
        return (tag.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return [
        {'value': 'Java'},
        {'value': 'Python'},
        {'value': '條件'},
        {'value': '迴圈'}
      ]
    },
    handleSelect(item) {
      // this.inputValue = item;
      let inputValue = this.inputValue;
      if (inputValue) {
        this.editProblemData.tag.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>

<style>
/* tag style */
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

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

/* doInfoDialog copy */
.code .code-copy {
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 20px;
  float: right;
  color: #303133;
  transition: all .3s ease;
}

.code .code-copy:hover {
  color: #409EFF;
}
</style>

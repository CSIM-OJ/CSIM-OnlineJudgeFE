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
            <span class="title">新增題目</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/teacher/'+ courseInfo.courseName +'/index' }">{{ courseInfo.courseName }}</el-breadcrumb-item>
                <el-breadcrumb-item>新增題目</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
          <el-row class="box-square">
            <el-col :span="20" :offset="2">
              <el-form :model="problemData" label-width="100px" label-position="top">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="題目名稱">
                      <el-input v-model="problemData.name" maxlength="15" placeholder="最長15個字" style="width: 70%;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <!-- TAGs -->
                    <el-form-item label="題目標籤">
                      <el-tag :key="tag" v-for="tag in problemData.tag" closable :disable-transitions="false" @close="handleClose(tag)">
                        {{tag}}
                      </el-tag>
                      <el-autocomplete class="input-new-tag" v-if="inputVisible" ref="saveTagInput" size="small" 
                      @keyup.enter.native="handleInputConfirm" v-model="inputValue" popper-class="my-autocomplete" :fetch-suggestions="querySearch" @select="handleSelect">
                        <template slot-scope="{ item }">
                          <div class="name">{{ item.value }}</div>
                        </template>
                      </el-autocomplete>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </el-form-item>
                    <!-- TAGs -->
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="題目作答類型">
                      <el-radio-group v-model="problemData.category">
                        <el-radio label="輸入輸出" border>輸入輸出</el-radio>
                        <el-radio label="輸入寫檔" border>輸入寫檔</el-radio>
                        <el-radio label="讀檔輸出" border>讀檔輸出</el-radio>
                        <el-radio label="讀檔寫檔" border>讀檔寫檔</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="題目類型">
                      <el-select v-model="problemData.type" placeholder="請選擇類型" style="width: 70%;">
                        <el-option label="作業" value="作業"></el-option>
                        <el-option label="練習題" value="練習題"></el-option>
                        <el-option label="討論題" value="討論題"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="繳交期限">
                      <el-date-picker type="date" placeholder="選擇繳交期限" v-model="problemData.deadline" style="width: 70%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item>
                  <label slot="label">
                    題目描述 (Description)
                    <img src="/static/md-icon.png" alt="md-icon" style="width: 25px; margin-left: 10px;">
                    <img src="/static/katex-icon.png" alt="md-icon" style="width: 40px; margin-left: 3px;">
                  </label>
                  <div id="markdown-editor">
                    <el-input type="textarea" rows="5" resize="vertical" placeholder="請輸入題目的描述內容" :value="problemData.description" style="width: 100%;" @input="update"></el-input>
                    <vue-markdown class="md-preview" :source="problemData.description"></vue-markdown>
                  </div>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="輸入描述 (Input)">
                      <el-input type="textarea" rows="3" resize="none" placeholder="請輸入題目的輸入內容" v-model="problemData.inputDesc" style="width: 90%;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="輸出描述 (Output)">
                      <el-input type="textarea" rows="3" resize="none" placeholder="請輸入題目的輸出內容" v-model="problemData.outputDesc" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 題目範本 -->
                <transition-group name="slide-fade">
                  <el-row v-for="(sample, index) in problemData.testCases" :key="index">
                    <el-col :span="12">
                      <el-form-item>
                        <span slot="label">輸入範例{{index+1}} (Input Sample{{index+1}})</span>
                        <el-input type="textarea" rows="3" resize="vertical" placeholder="請輸入題目的輸入範例" v-model="sample.inputSample" style="width: 90%;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                      <el-form-item>
                        <span slot="label">輸出範例{{index+1}} (Output Sample{{index+1}})</span>
                        <el-input type="textarea" rows="3" resize="vertical" placeholder="請輸入題目的輸出範例" v-model="sample.outputSample" style="width: 100%;"></el-input>
                      </el-form-item>
                    </el-col>           
                  </el-row>
                </transition-group>
                <el-row>
                  <el-col :span="24">
                    <p style="color: #F56C6C; margin-top: 0px;">注意！ 最後一項範例會作為隱藏範例，學生題目中看不見！</p>
                  </el-col> 
                </el-row>
                <el-button size="small" type="primary" plain @click="addSample">+ 新增範本</el-button>
                <el-button size="small" type="danger" plain @click="delSample">- 移除範本</el-button>
                <!-- 題目範本 -->
                <el-row>
                  <el-button type="primary" @click="dialogFormVisible=true" style="float: right;">確定</el-button>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </el-main>
        <el-footer>
          <nav-footer-admin></nav-footer-admin>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
  <!-- 確認題目 dialog start -->
  <el-dialog id="confirmProblemDialog" title="確認題目" :visible.sync="dialogFormVisible" v-loading="loading">
    <el-form :model="form">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="題目作答類型">
            <el-radio-group v-model="problemData.category">
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
          <!-- TAGs -->
          <el-form-item label="題目標籤">
            <el-tag :key="tag" v-for="tag in problemData.tag">
              {{tag}}
            </el-tag>
            <el-autocomplete class="input-new-tag" v-if="inputVisible" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" v-model="inputValue" popper-class="my-autocomplete" :fetch-suggestions="querySearch" @select="handleSelect">
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <!-- TAGs -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="2">
          <el-form-item label="題目名稱">
            <el-input v-model="problemData.name" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="題目類型">
            <el-input v-model="problemData.type" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="題目期限">
            <el-input v-model="formatedDeadline" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="題目說明">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.description" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="輸入說明">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.inputDesc" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="輸出說明">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.outputDesc" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(sample, index) in problemData.testCases" :key="index">
        <el-col :span="9" :offset="2">
          <el-form-item>
            <span slot="label">輸入範例{{index+1}} (Input Sample{{index+1}})</span>
            <el-input type="textarea" rows="3" resize="none" v-model="sample.inputSample" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item>
            <span slot="label">輸出範例{{index+1}} (Output Sample{{index+1}})</span>
            <el-input type="textarea" rows="3" resize="none" v-model="sample.outputSample" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="2">
          <p style="color: #F56C6C; margin-top: 0px;">注意！ 最後一項範例會作為隱藏範例，學生題目中看不見！</p>
        </el-col> 
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">取 消</el-button>
      <el-button type="primary" @click="newProblem">確 定</el-button>
    </div>
  </el-dialog>
  <!-- 確認題目 dialog end -->
</div>
</template>

<script>
import axios from 'axios'
import VueMarkdown from 'vue-markdown'
import DateUtil from '@/utils/DateUtil.js'

import NavHeaderTeacher from '@/components/Teacher/NavHeaderTeacher'
import SideNavCourseIndexTeacher from '@/components/Teacher/SideNavCourseIndexTeacher'
import NavFooterAdmin from '@/components/NavFooterAdmin'

import '@/assets/markdownParser/github.css'
import '@/assets/markdownParser/marked.js'
import '@/assets/markdownParser/lodash.js'
import '@/assets/markdownParser/katex.min.css'
import '@/assets/css/transition.css'

export default {
  components: {
    NavHeaderTeacher,
    SideNavCourseIndexTeacher,
    NavFooterAdmin,
    VueMarkdown
  },
  data() {
    return {
      courseInfo: {
        'courseId': '',
        'courseName': '',
        'semester': ''
      },
      dialogFormVisible: false,
      // 讀寫檔checkbox
      problemData: {
        // 'readWriteList': [], // TODO: 刪除
        'name': '',
        'type': '',
        'category': '', // TODO: 輸入輸出、...
        'tag': [],
        'deadline': '',
        'description': '',
        'inputDesc': '',
        'outputDesc': '',
        'testCases': [{
          'inputSample': '',
          'outputSample': ''
        }]
      },
      // tags
      inputVisible: false,
      inputValue: '',
      autoCompleteTags: [],
      // loading
      loading: false
    }
  },
  computed: {
    formatedDeadline() {
      return DateUtil.formatDate(this.problemData.deadline)
    },
    // markdown
    // compiledMarkdown() {
    //   return marked(this.problemData.description, { sanitize: true })
    // }
  },
  mounted() {
    this.checkLogin();
    this.getCourses();
    this.autoCompleteTags = this.loadAll();
  },
  methods: {
    //markdown
    update: _.debounce(function(e) {
      // console.log(e.target.value);
      this.problemData.description = e;
      // this.problemData.description = e.target.value
    }, 300),
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
    getCourses() {
      axios.get("/api/teacher/courseList").then((response)=> {
        let res = response.data;
        if(res.status=="200") {
          res.result.forEach((element) => {
            if(element.courseName == this.$route.params.courseName) {
              this.courseInfo = element;
            }
          });
        }
      });
    },
    newProblem() {
      if (this.problemData.name == '') {
        this.$message.error('請填寫題目名稱！');
      } else if (this.problemData.type == '') {
        this.$message.error('請選擇題目類型！');
      } else if (this.problemData.category == '') {
        this.$message.error('請選定題目作答類型！');
      } else if (this.problemData.tag.length == 0) {
        this.$message.error('請至少選擇一個標籤！');
      } // TODO: 至少要有java, py的tag
        else if (!(this.problemData.tag.includes('Java')||this.problemData.tag.includes('Python'))) {
        this.$message.error('請選擇一種程式語言標籤！');
      } else if (this.problemData.deadline == '') {
        this.$message.error('請選定截止日期！');
      } else if (this.problemData.description == '') {
        this.$message.error('請填寫題目說明！');
      } else if (this.problemData.inputDesc == '') {
        this.$message.error('請填寫題目輸入說明！');
      } else if (this.problemData.outputDesc == '') {
        this.$message.error('請填寫題目輸出說明！');
      } else if (this.problemData.testCases.length == 0) {
        this.$message.error('請填寫題目輸入範例！');
      } else if (this.problemData.testCases.length == 1) {
        this.$message.error('請至少填寫兩組題目輸入範例！');
      } else {
        this.loading = true;
        axios.post('/api/problem/addProblem', {
          courseId: this.courseInfo.courseId,
          name: this.problemData.name,
          type: this.problemData.type,
          category: this.problemData.category,
          tag: this.problemData.tag,
          description: this.problemData.description,
          deadline: DateUtil.formatDate(this.problemData.deadline),
          inputDesc: this.problemData.inputDesc,
          outputDesc: this.problemData.outputDesc,
          testCases: this.problemData.testCases
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '新增題目成功!'
            });
            this.problemData = {
              'name': '',
              'type': '',
              'category': '',
              'tag': [],
              'deadline': '',
              'description': '',
              'input': '',
              'output': '',
              'testCases': [{
                'inputSample': '',
                'outputSample': ''
              }]
            }
            this.dialogFormVisible = false;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.error(res.msg);
          }
        });
      }
    },
    // tags control methods
    handleClose(tag) {
      this.problemData.tag.splice(this.problemData.tag.indexOf(tag), 1);
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
        this.problemData.tag.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // tags autocomplete
    querySearch(queryString, cb) {
      var autoCompleteTags = this.autoCompleteTags;
      var results = queryString ? autoCompleteTags.filter(this.createFilter(queryString)) : autoCompleteTags;
      // 調用 callback 返回建議列表的數據
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
        this.problemData.tag.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    addSample() {
      let obj = {
        'inputSample': '',
        'outputSample': ''
      }
      this.problemData.testCases.push(obj);
      // console.log(this.problemData.testCases);
    },
    delSample() {
      this.problemData.testCases.pop();
    }
  }
}
</script>

<style>
#confirmProblemDialog .el-loading-mask {
  height: 160% !important;
}

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

/* markdown editor */

/* html, body, #editor {
  margin: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
} */

/* #markdown-editor textarea, #markdown-editor div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

#markdown-editor textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
} */

#markdown-editor code {
  color: #f66;
}

/* md預覽 */

.md-preview {
  font-size: 18px;
  line-height: 25px;
  color: #666;
}
</style>

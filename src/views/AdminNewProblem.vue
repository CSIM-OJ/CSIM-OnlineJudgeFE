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
            <span class="title">新增題目</span>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin/index' }">首頁</el-breadcrumb-item>
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
                    <el-form-item label="讀寫檔">
                      <el-checkbox-group v-model="problemData.readWriteList" @change="changeBox">
                        <el-checkbox label="讀檔" border></el-checkbox>
                        <el-checkbox label="寫檔" border></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="題目類型">
                      <el-select v-model="problemData.type" placeholder="請選擇類型" style="width: 70%;">
                        <el-option label="作業" value="作業"></el-option>
                        <el-option label="練習題" value="練習題"></el-option>
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
                  <!-- <el-input type="textarea" rows="5" resize="none" placeholder="請輸入題目的描述內容" v-model="problemData.description" style="width: 100%;"></el-input> -->
                  <div id="markdown-editor">
                    <el-input type="textarea" rows="5" resize="vertical" placeholder="請輸入題目的描述內容" :value="problemData.description" style="width: 100%;" @input="update"></el-input>
                    <!-- <textarea :value="problemData.description" @input="update" style="width: 100%; border-radius: 5px; border-color: #c0c4cc;"></textarea> -->
                    <!-- <div v-html="compiledMarkdown"></div> -->
                    <vue-markdown class="md-preview" :source="problemData.description"></vue-markdown>
                  </div>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="輸入描述 (Input)">
                      <el-input type="textarea" rows="3" resize="none" placeholder="請輸入題目的輸入內容" v-model="problemData.input" style="width: 90%;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="輸出描述 (Output)">
                      <el-input type="textarea" rows="3" resize="none" placeholder="請輸入題目的輸出內容" v-model="problemData.output" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="輸入範例1 (Input Sample1)">
                      <el-input type="textarea" rows="3" resize="vertical" placeholder="請輸入題目的輸入範例" v-model="problemData.inputSample1" style="width: 90%;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="輸出範例1 (Output Sample1)">
                      <el-input type="textarea" rows="3" resize="vertical" placeholder="請輸入題目的輸出範例" v-model="problemData.outputSample1" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="輸入範例2 (Input Sample2)">
                      <el-input type="textarea" rows="3" resize="vertical" placeholder="請輸入題目的輸入範例" v-model="problemData.inputSample2" style="width: 90%;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="輸出範例2 (Output Sample2)">
                      <el-input type="textarea" rows="3" resize="vertical" placeholder="請輸入題目的輸出範例" v-model="problemData.outputSample2" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="特殊輸入範例 (Input Sample3)">
                      <el-input type="textarea" rows="3" resize="vertical" placeholder="請輸入題目的輸入範例" v-model="problemData.inputSample3" style="width: 90%;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="特殊輸出範例 (Output Sample3)">
                      <el-input type="textarea" rows="3" resize="vertical" placeholder="請輸入題目的輸出範例" v-model="problemData.outputSample3" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
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
        <el-col :span="24" :offset="2">
          <el-form-item label="讀寫檔">
            <el-checkbox-group v-model="problemData.readWriteList" @change="changeBox">
              <el-checkbox label="讀檔" border disabled></el-checkbox>
              <el-checkbox label="寫檔" border disabled></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
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
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.input" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="輸出說明">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.output" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="輸入範例1">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.inputSample1" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="輸出範例1">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.outputSample1" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="輸入範例2">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.inputSample2" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="輸出範例2">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.outputSample2" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="特殊輸入範例">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.inputSample3" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="特殊輸出範例">
            <el-input type="textarea" rows="3" resize="none" v-model="problemData.outputSample3" readonly></el-input>
          </el-form-item>
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

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import SideNavAdmin from '@/components/SideNavAdmin'
import NavFooterAdmin from '@/components/NavFooterAdmin'

import '@/assets/markdownParser/github.css'
import '@/assets/markdownParser/marked.js'
import '@/assets/markdownParser/lodash.js'
import '@/assets/markdownParser/katex.min.css'

export default {
  components: {
    NavHeaderAdmin,
    SideNavAdmin,
    NavFooterAdmin,
    VueMarkdown
  },
  data() {
    return {
      dialogFormVisible: false,
      // 讀寫檔checkbox
      problemData: {
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
      loading: false
    }
  },
  computed: {
    formatedDeadline() {
      return this.formatDate(this.problemData.deadline)
    },
    // markdown
    // compiledMarkdown() {
    //   return marked(this.problemData.description, { sanitize: true })
    // }
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    //markdown
    update: _.debounce(function(e) {
      // console.log(e.target.value);
      this.problemData.description = e
      // this.problemData.description = e.target.value
    }, 300),
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
    newProblem() {
      if (this.problemData.name == '') {
        this.$message.error('請填寫題目名稱！');
      } else if (this.problemData.type == '') {
        this.$message.error('請選擇題目類型！');
      } else if (this.problemData.deadline == '') {
        this.$message.error('請選定截止日期！');
      } else if (this.problemData.description == '') {
        this.$message.error('請填寫題目說明！');
      } else if (this.problemData.input == '') {
        this.$message.error('請填寫題目輸入說明！');
      } else if (this.problemData.output == '') {
        this.$message.error('請填寫題目輸出說明！');
      } else if (this.problemData.inputSample1 == '') {
        this.$message.error('請填寫題目輸入範例1！');
      } else if (this.problemData.outputSample1 == '') {
        this.$message.error('請填寫題目輸出範例1！');
      } else if (this.problemData.inputSample2 == '') {
        this.$message.error('請填寫題目輸入範例2！');
      } else if (this.problemData.outputSample2 == '') {
        this.$message.error('請填寫題目輸出範例2！');
      } else {
        this.loading = true;
        axios.post('/api/ta/newProblem', {
          readWriteList: this.problemData.readWriteList,
          name: this.problemData.name,
          type: this.problemData.type,
          deadline: this.formatDate(this.problemData.deadline),
          desc: this.problemData.description,
          inputDesc: this.problemData.input,
          outputDesc: this.problemData.output,
          inputSample1: this.problemData.inputSample1.replace(/\n/g, ' /n '),
          outputSample1: this.problemData.outputSample1.replace(/\n/g, ' /n '),
          inputSample2: this.problemData.inputSample2.replace(/\n/g, ' /n '),
          outputSample2: this.problemData.outputSample2.replace(/\n/g, ' /n '),
          inputSample3: this.problemData.inputSample3.replace(/\n/g, ' /n '),
          outputSample3: this.problemData.outputSample3.replace(/\n/g, ' /n ')
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '新增題目成功!'
            });
            this.problemData = {
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
            this.dialogFormVisible = false;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.error(res.msg);
          }
        });
      }
    },
    formatDate(oriDate) {
      let d = new Date(oriDate);
      let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      return date
    },
    changeBox() {
      console.log(this.problemData.readWriteList);
    }
  }
}
</script>

<style>
#confirmProblemDialog .el-loading-mask {
  height: 160% !important;
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

<template>
<div>
  <el-row class="box-square" id="newproblem-section">
    <el-col :span="20" :offset="2" style="margin-bottom: 10px;">
      <el-button type="warning" icon="fas fa-book" round @click="viewProblemBank"> 從題庫匯入</el-button>
    </el-col>
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
            <el-form-item label="題目類型" style="margin-bottom:0px;">
              <el-select v-model="problemData.type" placeholder="請選擇類型" style="width: 70%;" @change="changeProblemType">
                <el-option  v-for="item in problemType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="繳交期限">
              <el-date-picker type="date" placeholder="選擇繳交期限" v-model="problemData.deadline" @change="selectDeadline" style="width: 70%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- pattern -->
        <el-row>
          <el-col :span="24" style="margin-bottom: 20px;">
            <el-form-item label="指定程式片段 (Pattern)" style="margin-bottom: 5px;">
              <el-input v-model="pattern.pat" maxlength="15" placeholder="請輸入一段指定的程式碼" style="width: 80%; margin-bottom: 10px;" v-for="(pattern, index) in problemData.pattern" :key="index"></el-input>
            </el-form-item>
            <el-button size="small" type="primary" plain @click="addPattern">+ 新增pattern</el-button>
            <el-button size="small" type="danger" plain @click="delPattern">- 移除pattern</el-button>
          </el-col>
        </el-row>
        <!-- pattern -->
        <el-form-item>
          <label slot="label">
            題目描述 (Description)
            <img src="/static/md-icon.png" alt="md-icon" style="width: 25px; margin-left: 10px;">
            <img src="/static/katex-icon.png" alt="md-icon" style="width: 40px; margin-left: 3px;">
          </label>
          <div id="markdown-editor">
            <el-input type="textarea" rows="5" resize="vertical" placeholder="請輸入題目的描述內容" v-model="problemData.description" style="width: 100%;" @input="update"></el-input>
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
        <!-- 討論題：選取批改配對 start-->
        <el-row v-if="problemData.type=='討論題'">
          <el-col :span="24" style="margin-bottom: 15px;">
            <el-divider content-position="center">討論題：選取批改配對</el-divider>
            <el-cascader-panel v-loading="discussLoading" v-model="discussValue" :options="discussOptions" :props="discussProps" style="height:500px;"></el-cascader-panel>
          </el-col>
        </el-row>
        <!-- 討論題：選取批改配對 end -->
        <el-row>
          <el-button type="primary" @click="previewProblem" style="float: right;">確定</el-button>
        </el-row>
      </el-form>
    </el-col>
  </el-row>

  <!-- 確認題目 dialog -->
  <confirm-problem-dialog :visible="confirmProblemDialogVisible" :data="problemData" @onChangeVisible="onChangeConfirmProblemDialogVisible" @refreshProblemData="refreshProblemData"></confirm-problem-dialog>

  <!-- 題庫 dialog start -->
  <problem-bank-dialog :visible="problemBankDialogVisible" :data="quesList" @onChangeVisible="onChangeProblemBankDialogVisible" @importProblem="importProblem"></problem-bank-dialog>
</div>
</template>

<script>
import {apiAllStud} from '@/apis/student.js'
import {apiGetAllProblem, apiGetProblemInfo} from '@/apis/problemBank.js'

import VueMarkdown from 'vue-markdown'
import DateUtil from '@/utils/DateUtil.js'
import GeneralUtil from '@/utils/GeneralUtil.js'
import problemStateMixin from '@/mixins/problemState.mixin.js'

import ConfirmProblemDialog from '@/components/MgmtProblem/ConfirmProblemDialog'
import ProblemBankDialog from '@/components/MgmtProblem/ProblemBankDialog'

import '@/assets/markdownParser/github.css'
import '@/assets/markdownParser/marked.js'
import '@/assets/markdownParser/lodash.js'
import '@/assets/markdownParser/katex.min.css'
import '@/assets/css/transition.css'

export default {
  components: {
    VueMarkdown,
    ConfirmProblemDialog,
    ProblemBankDialog
  },
  mixins: [problemStateMixin],
  data() {
    return {
      confirmProblemDialogVisible: false, // 題目預覽dialog
      problemData: {
        'name': '',
        'type': '',
        'category': '', // 輸入輸出、...
        'tag': [],
        'deadline': '',
        'previewDate': '', // 處理過後的deadline
        'description': '',
        'inputDesc': '',
        'outputDesc': '',
        'testCases': [{
          'inputSample': '',
          'outputSample': ''
        }, {
          'inputSample': '',
          'outputSample': ''
        }],
        'pattern': [{
          'pat': ''
        }],
        'discussValue': [], // 討論題配對pair
        'previewDiscussTreeData': [] // 預覽的tree
      },
      previewDiscussTreeData: [], // 確認題目的選學生配對部分
      // tags
      inputVisible: false,
      inputValue: '',
      autoCompleteTags: [],
      // 討論題：指定批改者
      discussLoading: false,
      discussStudsList: [], // 學生學號名單
      discussNum: 0,
      discussNowFocus: '', // 目前正在選的學號
      discussNumControl: {}, // {學號:count}
      discussIsLock: false,
      discussValue: [], // 選取配對的名單(pairs)
      discussProps: { 
        multiple: true
      },
      discussOptions: [],
      // problemBank Dialog
      problemBankDialogVisible: false,
      quesList: [],
    }
  },
  mounted() {
    this.autoCompleteTags = this.problemTag;
  },
  methods: {
    //markdown
    update: _.debounce(function(e) {
      this.problemData.description = e;
    }, 300),
    selectDeadline() {
      this.problemData.previewDate = DateUtil.formatDate(this.problemData.deadline);
    },
    // 討論題
    getStudsList() {
      apiAllStud({
        courseId: this.$store.state.course.courseInfo.courseId
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.discussStudsList = res.result;
        }
      });

      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(true);
        }, 1000);
      });
    },
    changeProblemType() {
      // 如果是討論題，就載入學生學號，去做討論題的批改配對
      if (this.problemData.type == '討論題') {
        this.discussLoading = true;
        this.getStudsList().then((value) => {
          if(value == true) {
            // 載入指定者學號進discussOptions
            this.discussStudsList.forEach((element) => {
              let obj = {
                value: element,
                label: element
              }
              this.discussOptions.push(obj);

              // 載入每個人的學號進discussNumControl, 做每個人選取數量的控制
              this.discussNumControl[element] = 0;
            });

            // 載入被指定者到discussOptions的各obj內，且不包含自己
            this.discussOptions.forEach((ele, idx) => {
              let [...tempStuList] = this.discussStudsList;
              // tempStuList.push(ele.value);
              let noMyselfList = GeneralUtil.removeInArray(tempStuList, ele);
              
              let children = [];
              this.discussOptions[idx].children = [];

              noMyselfList.forEach((ele) => {
                let obj = {
                  value: ele,
                  label: ele
                }
                this.discussOptions[idx].children.push(obj);
              });
            });
            this.discussLoading = false;
          }
        }).catch(function (error) {
          console.log(error);
        });
      } else { // 不是討論題
        this.discussOptions = [];
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
    handleSelect(item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.problemData.tag.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    addPattern() {
      let obj = { 'pat': '' };
      this.problemData.pattern.push(obj);
    },
    delPattern() {
      this.problemData.pattern.pop();
    },
    addSample() {
      let obj = {
        'inputSample': '',
        'outputSample': ''
      }
      this.problemData.testCases.push(obj);
    },
    delSample() {
      this.problemData.testCases.pop();
    },
    // confirm problem dialog
    previewProblem() {
      // discussValue轉成tree格式，供使用者預覽
      let treeData = [];
      this.discussOptions.forEach((element) => {
        let obj = {
          label: element.label,
          children: []
        }
        treeData.push(obj);
      });

      this.discussValue.forEach((element) => {
        let cor = element[0]; // 批改者
        let cored = element[1]; // 被批改
        
        treeData.forEach((ele) => {
          if (cor == ele.label) {
            let obj = {
              label: cored
            }
            ele.children.push(obj);
          }
        });
      })
      this.previewDiscussTreeData = treeData; // xx

      // 把資料放進problemData
      this.problemData.discussValue = this.discussValue; // pair名單
      this.problemData.previewDiscussTreeData = treeData;

      this.confirmProblemDialogVisible = true;
    },
    onChangeConfirmProblemDialogVisible(val) {
      this.confirmProblemDialogVisible = val;
    },
    refreshProblemData() {
      this.problemData = {
        'name': '',
        'type': '',
        'category': '', // 輸入輸出、...
        'tag': [],
        'deadline': '',
        'previewDate': '', // 處理過後的deadline
        'description': '',
        'inputDesc': '',
        'outputDesc': '',
        'testCases': [{
          'inputSample': '',
          'outputSample': ''
        }, {
          'inputSample': '',
          'outputSample': ''
        }],
        'pattern': [{
          'pat': ''
        }],
        'discussValue': [], // 討論題配對pair
        'previewDiscussTreeData': [] // 預覽的tree
      }
    },
    // problemBank Dialog
    onChangeProblemBankDialogVisible(val) {
      this.problemBankDialogVisible = val;
    },
    viewProblemBank() {
      this.problemBankDialogVisible = true;

      apiGetAllProblem().then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.quesList = res.result;
        }
      });
    },
    importProblem(id) {
      apiGetProblemInfo({
        id: id
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.problemData.name = res.result.name;
          this.problemData.category = res.result.category;
          this.problemData.tag = res.result.tag;
          this.problemData.description = res.result.description;
          this.problemData.inputDesc = res.result.inputDesc;
          this.problemData.outputDesc = res.result.outputDesc;
          this.problemData.testCases = res.result.testCases;

          this.$message({type: 'success', message: '匯入成功!'});
          this.problemBankDialogVisible = false;
        }
      });
    }
  }
}
</script>

<style>
/* tag style */
#newproblem-section .el-tag + .el-tag {
  margin-left: 10px;
}

#newproblem-section .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

#newproblem-section .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

#markdown-editor code {
  color: #f66;
}

/* md預覽 */

.md-preview {
  font-size: 18px;
  line-height: 25px;
  color: #666;
}

/* discuss cascader */
#newproblem-section .el-cascader-menu__wrap {
  height: 500px !important;
}

</style>
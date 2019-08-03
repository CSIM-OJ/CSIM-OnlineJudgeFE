<template>
<div>
  <el-dialog id="editProblemDialog" :visible.sync="myEditProblemDialogVisible" v-loading="editProblemLoading">
    <el-form>
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
          <!-- TAGs -->
          <el-form-item label="題目標籤">
            <el-tag :key="tag" v-for="tag in editProblemData.tag" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-autocomplete class="input-new-tag" v-if="inputVisible" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" v-model="inputValue" popper-class="my-autocomplete" :fetch-suggestions="querySearch" @select="handleSelect">
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
        <el-col :span="6" :offset="2">
          <el-form-item label="題目名稱">
            <el-input v-model="editProblemData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="題目類型">
            <el-select v-model="editProblemData.type" placeholder="請選擇類型" style="width: 100%;">
              <el-option  v-for="item in problemType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="題目期限">
            <el-date-picker type="date" placeholder="選擇繳交期限" v-model="editProblemData.deadline" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- TODO: pattern -->
      <el-row>
        <el-col :span="20" :offset="2" style="margin-bottom: 20px;">
          <el-form-item label="指定程式片段 (Pattern)" style="margin-bottom: 5px;">
            <el-input v-model="pattern.pat" maxlength="15" placeholder="請輸入一段指定的程式碼" style="width: 100%; margin-bottom: 10px;" v-for="(pattern, index) in editProblemData.pattern" :key="index"></el-input>
          </el-form-item>
          <el-button size="small" type="primary" plain @click="addPattern">+ 新增pattern</el-button>
          <el-button size="small" type="danger" plain @click="delPattern">- 移除pattern</el-button>
        </el-col>
      </el-row>
      <!-- TODO: pattern -->
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
      <el-row v-for="(sample, index) in editProblemData.testCases" :key="index">
        <el-col :span="9" :offset="2">
          <el-form-item>
            <span slot="label">輸入範例{{index+1}} (Input Sample{{index+1}})</span>
            <el-input type="textarea" rows="5" resize="vertical" v-model="sample.inputSample"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item>
            <span slot="label">輸出範例{{index+1}} (Output Sample{{index+1}})</span>
            <el-input type="textarea" rows="5" resize="vertical" v-model="sample.outputSample"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="2">
          <p style="color: #F56C6C; margin-top: 0px;">注意！ 最後一項範例會作為隱藏範例，學生題目中看不見！</p>
        </el-col> 
      </el-row>
      <el-row>
        <el-col :span="24" :offset="2">
          <el-button size="small" type="primary" plain @click="addSample">+ 新增範本</el-button>
          <el-button size="small" type="danger" plain @click="delSample">- 移除範本</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="myEditProblemDialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="editProblem">確 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import axios from 'axios'

import DateUtil from '@/utils/DateUtil.js'
import problemStateMixin from '@/mixins/problemState.mixin.js'

export default {
  components: {},
  props: ['editProblemDialogVisible', 'editProblemData'],
  mixins: [problemStateMixin],
  data() {
    return {
      editProblemLoading: false,
      myEditProblemDialogVisible: this.editProblemDialogVisible,
      // tags
      inputVisible: false,
      inputValue: '',
      autoCompleteTags: [],
    }
  },
  watch: {
    editProblemDialogVisible(val) {
      this.myEditProblemDialogVisible = val;
    },
    myEditProblemDialogVisible(val) {
      this.$emit('onChangeEditProblemDialogVisible', val)
    }
  },
  mounted() {
    this.autoCompleteTags = this.problemTag; // tags
  },
  methods: {
    addSample() {
      let obj = {
        'inputSample': '',
        'outputSample': ''
      }
      this.editProblemData.testCases.push(obj);
      // console.log(this.problemData.testCases);
    },
    delSample() {
      this.editProblemData.testCases.pop();
    },
    addPattern() {
      let obj = { 'pat': '' };
      this.editProblemData.pattern.push(obj);
    },
    delPattern() {
      this.editProblemData.pattern.pop();
    },
    editProblem() {
      if (this.editProblemData.name == '') {
        this.$message.error('請填寫題目名稱！');
      } else if (this.editProblemData.type == '') {
        this.$message.error('請選擇題目類型！');
      } else if (this.editProblemData.category == '') {
        this.$message.error('請選定題目作答類型！');
      } else if (this.editProblemData.tag.length == 0) {
        this.$message.error('請至少選擇一個標籤！');
      } // 至少要有java, py的tag
        else if (!(this.editProblemData.tag.includes('Java')||this.editProblemData.tag.includes('Python'))) {
        this.$message.error('請選擇一種程式語言標籤！');
      } else if (this.editProblemData.deadline == '') {
        this.$message.error('請選定截止日期！');
      } else if (this.editProblemData.description == '') {
        this.$message.error('請填寫題目說明！');
      } else if (this.editProblemData.inputDesc == '') {
        this.$message.error('請填寫題目輸入說明！');
      } else if (this.editProblemData.outputDesc == '') {
        this.$message.error('請填寫題目輸出說明！');
      } else if (this.editProblemData.testCases.length == 0) {
        this.$message.error('請填寫題目輸入範例！');
      } else if (this.editProblemData.testCases.length == 1) {
        this.$message.error('請至少填寫兩組題目輸入範例！');
      } else {
        this.editProblemLoading = true;

        // 取出pattern
        let patternArray = [];
        if (this.editProblemData.pattern.length==1 && this.editProblemData.pattern[0].pat=='') {
          patternArray = [];
        } else {
          this.editProblemData.pattern.forEach((element) => {
            patternArray.push(element.pat);
          });
        }

        axios.post('/api/problem/editProblem', {
          problemId: this.editProblemData.id,
          name: this.editProblemData.name,
          type: this.editProblemData.type,
          category: this.editProblemData.category,
          tag: this.editProblemData.tag,
          deadline: DateUtil.formatDate(this.editProblemData.deadline),
          description: this.editProblemData.description,
          inputDesc: this.editProblemData.inputDesc,
          outputDesc: this.editProblemData.outputDesc,
          testCases: this.editProblemData.testCases,
          keyword: this.editProblemData.keyword,
          pattern: patternArray
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '編輯題目成功!'
            });

            this.myEditProblemDialogVisible = false;
            this.editProblemLoading = false;
            this.$emit('refreshProblemsData');
          } else {
            this.editProblemLoading = false;
            this.$message.error(res.msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    // tags control methods
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
        this.editProblemData.tag.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>

<style>
#editProblemDialog .el-dialog {
  width: 70vw;
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

.overview {
  transition: all .3s ease;
}

.overview:hover {
  color: #409EFF;
  cursor: pointer;
}
</style>

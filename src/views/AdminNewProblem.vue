<template>
<div>
  <nav-header-admin></nav-header-admin>
  <el-row>
    <el-col :span="20" :offset="2" class="box" style="margin-top: 20px;">
      <el-row>
        <div id="title">新增題目</div>
        <el-col :span="18" :offset="3">
          <el-form :model="problemData" label-width="100px" label-position="top">
            <el-row>
              <el-col :span="12">
                <el-form-item label="題目名稱">
                  <el-input v-model="problemData.name" maxlength="15" placeholder="最長15個字" style="width: 70%;"></el-input>
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
            <el-form-item label="題目描述 (Description)">
              <el-input type="textarea" rows="5" resize="none" placeholder="請輸入題目的描述內容" v-model="problemData.description" style="width: 100%;"></el-input>
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
                  <el-input type="textarea" rows="3" resize="none" placeholder="請輸入題目的輸入範例" v-model="problemData.inputSample1" style="width: 90%;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="輸出範例1 (Output Sample1)">
                  <el-input type="textarea" rows="3" resize="none" placeholder="請輸入題目的輸出範例" v-model="problemData.outputSample1" style="width: 100%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="輸入範例2 (Input Sample2)">
                  <el-input type="textarea" rows="3" resize="none" placeholder="請輸入題目的輸入範例" v-model="problemData.inputSample2" style="width: 90%;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="輸出範例2 (Output Sample2)">
                  <el-input type="textarea" rows="3" resize="none" placeholder="請輸入題目的輸出範例" v-model="problemData.outputSample2" style="width: 100%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2" :offset="21">
                <el-button type="primary" @click="dialogFormVisible=true">確定</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <el-dialog title="確認題目" :visible.sync="dialogFormVisible" v-loading="loading">
    <el-form :model="form">
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">取 消</el-button>
      <el-button type="primary" @click="newProblem">確 定</el-button>
    </div>
  </el-dialog>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderAdmin from '@/components/NavHeaderAdmin'
import NavFooter from '@/components/NavFooter'

export default {
  components: {
    NavHeaderAdmin,
    NavFooter
  },
  data() {
    return {
      dialogFormVisible: false,
      problemData: {
        'name': '',
        'type': '',
        'deadline': '',
        'description': '',
        'input': '',
        'output': '',
        'inputSample1': '',
        'outputSample1': '',
        'inputSample2': '',
        'outputSample2': ''
      },
      loading: false
    }
  },
  computed: {
    formatedDeadline() {
      return this.formatDate(this.problemData.deadline)
    }
  },
  mounted() {
    // this.checkLogin();
  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if(res.result.authority!='admin') {
            this.$router.push('/login');
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
        console.log('type' + this.problemData.type);
        this.loading = true;
        axios.post('/api/ta/newProblem', {
          name: this.problemData.name,
          type: this.problemData.type,
          deadline: this.formatDate(this.problemData.deadline),
          desc: this.problemData.description,
          inputDesc: this.problemData.input,
          outputDesc: this.problemData.output,
          inputSample1: this.problemData.inputSample1.replace(/\n/g, ' /n '),
          outputSample1: this.problemData.outputSample1.replace(/\n/g, ' /n '),
          inputSample2: this.problemData.inputSample2.replace(/\n/g, ' /n '),
          outputSample2: this.problemData.outputSample2.replace(/\n/g, ' /n ')
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
              'deadline': '',
              'description': '',
              'input': '',
              'output': '',
              'inputSample1': '',
              'outputSample1': '',
              'inputSample2': '',
              'outputSample2': ''
            }
            this.dialogFormVisible = false;
            this.loading = false;
          } else {
            console.log(res.msg);
          }
        });
      }
    },
    formatDate(oriDate) {
      let d = new Date(oriDate);
      let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      return date
    }
  }
}
</script>

<style>
.el-loading-mask {
  height: 150%;
}
</style>

<template>
<div>
  <nav-header-student></nav-header-student>
  <section id="problem-section">
    <el-row>
      <el-col :span="20" :offset="2" class="box">
        <div class="problem-name">
          <span v-text="problem.name"></span>
          <el-rate allow-half v-model="problem.rate" @change="changeRate"></el-rate>
          <span class="type" v-text="problem.type"></span>
          <span class="deadline" v-text="problem.deadline"></span>
        </div>
        <hr>
        <div class="problem-info">
          <div class="title">Description</div>
          <div id="markdown-editor">
            <vue-markdown class="content" :source="problem.description"></vue-markdown>
            <!-- <div class="content" v-html="compiledMarkdown"></div> -->
          </div>
          <!-- <div class="content change-line" v-text="problem.description"></div> -->
        </div>
        <div class="problem-info">
          <div class="title">Input</div>
          <div class="content change-line" v-text="problem.input"></div>
        </div>
        <div class="problem-info">
          <div class="title">Output</div>
          <div class="content change-line" v-text="problem.output"></div>
        </div>
        <el-row>
          <el-col :xs="24" :sm="12">
            <div class="problem-info">
              <div class="title">Sample Input 1
                <a style="cursor: pointer" @click="copy(problem.inputSample1)"><i class="el-icon-document"></i></a>
              </div>
              <div class="content">
                <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="problem.inputSample1" resize="none">
                </el-input>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="problem-info">
              <div class="title">Sample Output 1</div>
              <div class="content">
                <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="problem.outputSample1" resize="none">
                </el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12">
            <div class="problem-info">
              <div class="title">Sample Input 2
                <a style="cursor: pointer" @click="copy(problem.inputSample2)"><i class="el-icon-document"></i></a>
              </div>
              <div class="content">
                <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="problem.inputSample2" resize="none">
                </el-input>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="problem-info">
              <div class="title">Sample Output 2</div>
              <div class="content">
                <el-input type="textarea" readonly autosize placeholder="請輸入内容" v-model="problem.outputSample2" resize="none">
                </el-input>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
  <section id="judged-section" v-if="problem.judged==true" class="animated fadeInUp">
    <el-row>
      <el-col :span="20" :offset="2" class="box">
        <div class="chart hidden-xs-only" v-if="problem.judged">
          <ve-pie :data="chartData" :colors="chartColors" :settings="chartSettings"></ve-pie>
        </div>
        <el-row>
          <el-col :span="20" :offset="2">
            <div class="handDate">
              <div style="padding-bottom: 10px;">批改日期：</div>
              <div>{{ judgedResultForm.handDate }}</div>
            </div>
            <el-form :model="judgedResultForm" label-width="100px" label-position="top">
              <el-row>
                <el-col :xs="10" :sm="6">
                  <el-form-item label="分數">
                    <el-input readonly v-model="judgedResultForm.score" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="10" :sm="6" :offset="2">
                  <el-form-item label="運行時間">
                    <el-input readonly v-model="judgedResultForm.runtime" style="width: 100%;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="程式碼">
                <el-input readonly :class="isBestCode" type="textarea" v-model="judgedResultForm.code" autosize resize="none"></el-input>
              </el-form-item>
              <el-form-item label="錯誤訊息" v-if="judgedResultForm.errorInfo!=''">
                <el-input readonly type="textarea" v-model="judgedResultForm.errorInfo" autosize resize="none"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
  <section id="codemirror-section" v-if="isCanDoRepeat">
    <el-row>
      <el-col :span="20" :offset="2" class="box" v-loading="judging" element-loading-text="批改中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="coding-block">
          <div class="setting">
            <span>Language:</span>
            <el-select v-model="nowLang" @change="changeNowLang" style="width: 100px;">
              <el-option v-for="item in languages" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
              </el-option>
            </el-select>
            <span style="margin-left: 10px;">Theme:</span>
            <el-select v-model="nowTheme" @change="changeNowTheme" style="width: 130px;">
              <el-option v-for="item in themes" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <span style="margin-left: 10px;">FontSize:</span>
            <el-select v-model="fontSize" style="width: 80px;">
              <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <el-button plain size="mini" @click="changeCodemirrorHeight" class="chbtn hidden-xs-only"><i class="fas fa-arrows-alt"></i></el-button>
            <el-button plain size="mini" @click="copy(code)" class="chbtn hidden-xs-only"><i class="fas fa-copy"></i></el-button>
          </div>
          <codemirror v-model="code" :options="options" ref="myEditor" :style="{'font-size': fontSize+'px'}"></codemirror>
          <el-button type="primary" @click="submitCode">submit</el-button>
        </div>
      </el-col>
    </el-row>
  </section>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'
import {
  codemirror
} from 'vue-codemirror-lite'
import VueMarkdown from 'vue-markdown'

import NavHeaderStudent from '@/components/NavHeaderStudent'
import NavFooter from '@/components/NavFooter'

import '@/assets/css/student-coding.css'
import '@/assets/css/code-mirror.css'

import "codemirror/mode/clike/clike.js"
import "codemirror/mode/python/python.js"
import "codemirror/addon/mode/overlay.js"
import "codemirror/addon/edit/matchbrackets.js"
import "codemirror/addon/edit/closebrackets.js"
// fold gutter
import "codemirror/addon/fold/foldcode.js"
import "codemirror/addon/fold/foldgutter.js"
import "codemirror/addon/fold/brace-fold.js"
import "codemirror/addon/fold/indent-fold.js"
import "codemirror/addon/fold/foldgutter.css"
// theme
import "codemirror/theme/darcula.css"
import "codemirror/theme/blackboard.css"
import "codemirror/theme/eclipse.css"
// animated
import "@/assets/animated/animate.css"

// var codes = {
//   'text/x-java': ``,
//   'text/x-python': 'int'
// }

export default {
  components: {
    NavHeaderStudent,
    NavFooter,
    codemirror,
    VueMarkdown
  },
  data() {
    return {
      // problem
      problem: {
        'id': this.$route.query.problemID,
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
      mode: "text/x-java",
      nowLang: 'Java',
      languages: [{
        value: 'Java',
        label: 'Java'
      }, {
        value: 'Python',
        label: 'Python',
        disabled: true
      }],
      fontSize: '16',
      codemirrorFlag: 1,
      fontSizeList: ['16', '17', '18', '19', '20'],
      theme: 'default',
      nowTheme: 'Default',
      themes: ['Default', 'Eclipse', 'Darcula', 'Blackboard'],
      // CodeMirror
      code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello! World!");
    }
}`,
      // judging
      judging: false,
      // judged result form
      judgedResultForm: {
        'handDate': '',
        'score': '',
        'runtime': '',
        'code': ``,
        'errorInfo': '',
        'bestCode': null
      }
    }
  },
  created() {
    // pie
    this.chartColors = ['#67C23A', '#F56C6C'];
    this.chartSettings = {
      radius: 70,
      offsetY: 120
    }
  },
  computed: {
    options() {
      return {
        mode: this.mode,
        theme: this.theme,
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
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      }
    },
    // judged form
    isBestCode() {
      // if judgedResultForm.copy==''
      if (this.judgedResultForm.bestCode == true) {
        return 'success-textarea bestcode'
      }
    },
    chartData() {
      let chartData = {
        columns: ['狀態', '數量'],
        rows: [{
            '狀態': '正確',
            '數量': this.problem.correctNum
          },
          {
            '狀態': '錯誤',
            '數量': this.problem.incorrectNum
          }
        ]
      }
      return chartData
    },
    // 判斷題目是否過期，過期則不給再提交
    isCanDoRepeat() {
      let deadline = new Date(this.problem.deadline);
      deadline.setDate(deadline.getDate() + 1);
      let today = new Date();

      if(today.valueOf() > deadline.valueOf()) { // 過期
        return false
      } else { // 沒過期
        if(this.problem.judged==false || this.problem.type=='練習題' || this.problem.type=='作業') {
          return true
        }
      }
    }
    // markdown
    // compiledMarkdown() {
    //   return marked(this.problem.description, { sanitize: true })
    // }
  },
  mounted() {
    this.checkLogin();
    this.getProblemData();
    this.checkJudged();
  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            // pass
          } else if (res.result.authority == 'admin') {
            this.$router.push('/admin/index');
          }
        } else {
          this.$router.push('/login');
        }
      });
    },
    changeRate(rateScore) {
      axios.post('/api/student/updateRate', {
        problemID: this.problem.id,
        rate: rateScore
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          // console.log(rateScore);
        }
      });
    },
    checkJudged() {
      axios.get('/api/judge/checkJudged', {
        params: {
          problemID: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          // console.log('judged:' + res.result.judged);
          this.problem.judged = res.result.judged;
          if (res.result.judged == true) {
            this.problem.judged = true;
            this.getJudgedInfo();
          } else {
            this.notify1();
            let self = this;
            setTimeout(function() {
              self.notify2();
            }, 300);
          }
        }
      });
    },
    getJudgedInfo() {
      axios.get('/api/judge/judgedInfo', {
        params: {
          problemID: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.judgedResultForm.handDate = res.result.handDate;
          this.judgedResultForm.score = res.result.score;
          this.judgedResultForm.runtime = res.result.runTime + ' ms';
          this.judgedResultForm.code = res.result.code;
          this.judgedResultForm.errorInfo = res.result.errorInfo;
          this.judgedResultForm.bestCode = res.result.best;
        }
      });
    },
    getProblemData() {
      axios.get('/api/problem/getInfo', {
        params: {
          problemID: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          console.log(res);
          this.problem.name = res.result.name;
          this.problem.rate = parseInt(res.result.rate);
          this.problem.type = res.result.type;
          this.problem.deadline = res.result.deadline;
          this.problem.description = res.result.desc;
          this.problem.input = res.result.inputDesc;
          this.problem.output = res.result.outputDesc;
          this.problem.inputSample1 = res.result.inputSample1.replace(new RegExp(" /n ", "g"), '\n');
          this.problem.outputSample1 = res.result.outputSample1.replace(new RegExp(" /n ", "g"), '\n');
          this.problem.inputSample2 = res.result.inputSample2.replace(new RegExp(" /n ", "g"), '\n');;
          this.problem.outputSample2 = res.result.outputSample2.replace(new RegExp(" /n ", "g"), '\n');
          this.problem.correctNum = parseInt(res.result.correctNum);
          this.problem.incorrectNum = parseInt(res.result.incorrectNum);
        }
      });
    },
    copy(s) {
      // 複製功能
      var clip_area = document.createElement('textarea');
      clip_area.textContent = s;

      document.body.appendChild(clip_area);
      clip_area.select();

      document.execCommand('copy');
      clip_area.remove();

      // success msg
      this.$message({
        message: '複製成功',
        type: 'success'
      });
    },
    // code mirror
    changeNowLang(lang) {
      if (lang == 'Java') {
        this.nowLang = 'Java';
        this.mode = 'text/x-java';
        this.code = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello! World!");
    }
}`;
        // console.log('Change lang to' + lang);
      } else if (lang == 'Python') {
        this.nowLang = 'Python';
        this.mode = 'text/x-python';
        this.code = "print('Hello! World!')";
        // console.log('Change lang to' + lang);
      }
    },
    changeNowTheme(theme) {
      if (theme == 'Default') {
        this.nowTheme = theme;
        this.theme = 'default';
      } else if (theme == 'Eclipse') {
        this.nowTheme = theme;
        this.theme = 'eclipse';
      } else if (theme == 'Darcula') {
        this.nowTheme = theme;
        this.theme = 'darcula';
      } else if (theme == 'Blackboard') {
        this.nowTheme = theme;
        this.theme = 'blackboard';
      }
    },
    // submit code
    submitCode() {
      let flag = true;
      let subNewLineCode = this.code.split('\n');

      // 檢測 package 及 public class name
      subNewLineCode.forEach((line) => {
        let subSpaceLine = line.split(' ');
        subSpaceLine.forEach((el, index) => {
          if (el == 'package') {
            flag = false;
            this.$message.error('不能有 package 出現');
          } else if (el == 'public') {
            if (subSpaceLine[index + 1] == 'class') {
              if (subSpaceLine[index + 2] != 'Main') {
                flag = false;
                this.$message.error('請將 public class 名稱改成 Main');
              }
            }
          }
        });
      });

      if (flag == true) {
        this.$confirm('確認是否要提交代碼？', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'info',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          // console.log(this.code);
          this.judging = true;
          axios.post('/api/judge/judgeCode', {
            problemID: this.problem.id,
            code: this.code,
            language: this.nowLang.toUpperCase()
          }).then((response) => {
            let res = response.data;
            if (res.status == '200') {
              this.problem.judged = true;
              this.getJudgedInfo();
              // 刷新圓餅圖
              axios.get('/api/problem/getInfo', {
                params: {
                  problemID: this.problem.id
                }
              }).then((response) => {
                let res = response.data;
                if (res.status == '200') {
                  this.problem.correctNum = parseInt(res.result.correctNum);
                  this.problem.incorrectNum = parseInt(res.result.incorrectNum);
                }
              });
              // 練習題與作業無限送出更改judging狀態及清空code
              if (this.problem.type == '練習題' || this.problem.type == '作業') {
                this.judging = false;
                this.code = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello! World!");
    }
}`;
              }
            } else {
              console.log('judgedErrorMsg:' + res.msg);
            }
          }).catch((error) => {
            console.log(error);
          });;
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          });
          this.judging = false;
          console.log(err);
        });
      }
    },
    notify1() {
      this.$notify({
        title: '小技巧',
        message: '若點擊題目旁的星星，可以對題目難易度進行評分。題目的平均難易度分數可以從首頁或是成績面板查看！',
        duration: 7000,
        type: 'success'
      });
    },
    notify2() {
      this.$notify({
        title: '注意',
        dangerouslyUseHTMLString: true,
        message: `public class name 記得改成 Main 呦 </br>
        不要有 package! </br>
        記得 import library~`,
        duration: 7000,
        type: 'warning'
      });
    },
    changeCodemirrorHeight() {
      this.codemirrorFlag++;
      var codemirror = document.getElementsByClassName("CodeMirror")[0];
      var chbtn = document.getElementsByClassName("chbtn")[0];

      if (this.codemirrorFlag % 2 == 0) {
        codemirror.style.height = '450px';
        chbtn.style.color = '#409EFF';
      } else {
        codemirror.style.height = '300px';
        chbtn.style.color = '#303133';
      }
    },
    // 兩日期天數差
    dateDiff(sDate1, sDate2) { //sDate1和sDate2是2018-6-18格式
      var aDate, oDate1, oDate2, iDays
      aDate = sDate1.split("-")
      oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //轉換為6-18-2018格式
      aDate = sDate2.split("-")
      oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒數轉換为天數
      console.log(iDays);
      return iDays
    }
  }
}
</script>

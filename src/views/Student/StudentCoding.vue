<template>
<div>
  <nav-header-student></nav-header-student>
  <problem-info-section :data="problem"></problem-info-section>

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
              <el-form-item>
                <label prop="label" style="margin-right: 10px;">程式碼</label>
                <span><a class="commit-hyperlink" href="javascript:void(0);" @click="commitDialogVisible=true"><i class="el-icon-time"></i> {{commitTableData.length}} commits</a></span>
                <el-input readonly :class="isBestCode" type="textarea" v-model="judgedResultForm.code" autosize resize="none"></el-input>
              </el-form-item>
              <el-form-item label="錯誤訊息" v-if="judgedResultForm.score!='100.0'">
                <el-collapse>
                  <el-collapse-item v-for="(info, index) in judgedResultForm.errorInfo" :key="index">
                    <template slot="title" :name="index">
                      樣本{{index+1}}
                    </template>
                    <div style="margin-bottom: 10px;">編譯結果：<el-tag type="warning" size="small">{{ judgedResultForm.symbol[index] }}</el-tag></div>
                    <!-- 如果有info顯示info, 無則顯示output -->
                    <el-input readonly type="textarea" autosize resize="none" :value="info" v-if="info"></el-input>
                    <el-input readonly type="textarea" autosize resize="none" :value="judgedResultForm.output[index]" v-else></el-input>
                  </el-collapse-item>
                </el-collapse>
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
            <el-select disabled v-model="nowLang" style="width: 100px;"></el-select>
            <!-- <el-select v-model="nowLang" @change="changeNowLang" style="width: 100px;">
              <el-option v-for="item in languages" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
              </el-option>
            </el-select> -->
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

  <!-- FIXME: dicuss correct start -->
  <section id="discuss-correct-section" v-if="dicussShowFlag">
    <el-row>
      <el-col :span="20" :offset="2" class="box">
        <span class="title">討論題 - 程式互評</span>
        <span v-if="correctStudsDone==false">學生還沒做完程式，再稍等一下！</span>
        <el-tabs type="card" @tab-click="clickCorrectTab" v-if="correctStudsDone">
          <el-tab-pane v-for="(stud, index) in correctList" :key="stud.studentAccount" :label="stud.studentAccount" >
            <!-- 1. 程式碼 -->
            <codemirror :options="options" :ref="'discussCodeMirror'+index" :style="{'font-size': fontSize+'px', 'padding-bottom': '20px'}"></codemirror>
            <!-- 2. 給分 -->
            <el-row class="block">
              <el-col :span="3">
                <span class="small-title">分數</span>
              </el-col>
              <el-col :span="21">
                <el-slider class="correct-slider" v-model="stud.score" show-input style="" :disabled="correctStatus"></el-slider>
              </el-col>
            </el-row>
            <el-row class="block">
              <el-col :span="3">
                <span class="small-title">程式正確性</span>
              </el-col>
              <el-col :span="21">
                <el-slider v-model="stud.correctValue" show-input :step="1" :max="5" show-stops class="correct-slider" :disabled="correctStatus"></el-slider>
              </el-col>
            </el-row>
            <el-row class="block">
              <el-col :span="3">
                <span class="small-title">程式可讀性</span>
              </el-col>
              <el-col :span="21">
                <el-slider v-model="stud.readValue" show-input :step="1" :max="5" show-stops class="correct-slider" :disabled="correctStatus"></el-slider>
              </el-col>
            </el-row>
            <el-row class="block">
              <el-col :span="3">
                <span class="small-title">技巧運用</span>
              </el-col>
              <el-col :span="21">
                <el-slider v-model="stud.skillValue" show-input :step="1" :max="5" show-stops class="correct-slider" :disabled="correctStatus"></el-slider>
              </el-col>
            </el-row>
            <el-row class="block">
              <el-col :span="3">
                <span class="small-title">程式完整性</span>
              </el-col>
              <el-col :span="21">
                <el-slider v-model="stud.completeValue" show-input :step="1" :max="5" show-stops class="correct-slider" :disabled="correctStatus"></el-slider>
              </el-col>
            </el-row>
            <el-row class="block">
              <el-col :span="3">
                <span class="small-title">綜合評分</span>
              </el-col>
              <el-col :span="21">
                <el-slider v-model="stud.wholeValue" show-input :step="1" :max="5" show-stops class="correct-slider" :disabled="correctStatus"></el-slider>
              </el-col>
            </el-row>
            <!-- 3. 送出評分 -->
            <el-row v-if="!correctStatus">
              <el-divider content-position="center" style="font-size: 16px; padding-top: 20px !important;">評分完所有學生後送出評分</el-divider>
              <el-button type="primary" style="float: right;" @click="submitCorrect">送出評分</el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </section>
  <!-- FIXME: dicuss correct end -->


  <!-- FIXME: dicuss corrected start 被批改的成績 -->
  <section id="discuss-corrected-section" v-if="problem.type=='討論題'&&dicussCorrectedShowFlag">
    <el-row>
      <el-col :span="20" :offset="2" class="box">
        <span class="title">討論題 - 被批改的成績</span>
        <span v-if="correctedStudsDone==false">還未有批改的成績，再稍等一下</span>
        <el-row v-if="correctedStudsDone">
          <el-col :span="11" v-for="stud in correctedList" :key="stud.studentAccount" style="margin: 10px;">
            <el-card class="box-card" style="margin-top: 15px; " shadow="hover">
              <div class="text item">
                <el-row class="block">
                  <el-col :span="6">
                    <span class="small-title">分數</span>
                  </el-col>
                  <el-col :span="14">
                    <el-slider class="correct-slider" v-model="stud.score" :disabled="true"></el-slider>
                  </el-col>
                  <el-col :span="4">
                    <p class="score">{{stud.score}}</p>
                  </el-col>
                </el-row>
                <el-row class="block">
                  <el-col :span="6">
                    <span class="small-title">程式正確性</span>
                  </el-col>
                  <el-col :span="14">
                    <el-slider v-model="stud.correctValue" :step="1" :max="5" show-stops class="correct-slider" :disabled="true"></el-slider>
                  </el-col>
                  <el-col :span="4">
                    <p class="score">{{stud.correctValue}}</p>
                  </el-col>
                </el-row>
                <el-row class="block">
                  <el-col :span="6">
                    <span class="small-title">程式可讀性</span>
                  </el-col>
                  <el-col :span="14">
                    <el-slider v-model="stud.readValue" :step="1" :max="5" show-stops class="correct-slider" :disabled="true"></el-slider>
                  </el-col>
                  <el-col :span="4">
                    <p class="score">{{stud.readValue}}</p>
                  </el-col>
                </el-row>
                <el-row class="block">
                  <el-col :span="6">
                    <span class="small-title">技巧運用</span>
                  </el-col>
                  <el-col :span="14">
                    <el-slider v-model="stud.skillValue" :step="1" :max="5" show-stops class="correct-slider" :disabled="true"></el-slider>
                  </el-col>
                  <el-col :span="4">
                    <p class="score">{{stud.skillValue}}</p>
                  </el-col>
                </el-row>
                <el-row class="block">
                  <el-col :span="6">
                    <span class="small-title">程式完整性</span>
                  </el-col>
                  <el-col :span="14">
                    <el-slider v-model="stud.completeValue" :step="1" :max="5" show-stops class="correct-slider" :disabled="true"></el-slider>
                  </el-col>
                  <el-col :span="4">
                    <p class="score">{{stud.completeValue}}</p>
                  </el-col>
                </el-row>
                <el-row class="block">
                  <el-col :span="6">
                    <span class="small-title">綜合評分</span>
                  </el-col>
                  <el-col :span="14">
                    <el-slider v-model="stud.wholeValue" :step="1" :max="5" show-stops class="correct-slider" :disabled="true"></el-slider>
                  </el-col>
                  <el-col :span="4">
                    <p class="score">{{stud.wholeValue}}</p>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
  <!-- FIXME: dicuss corrected end 被批改的成績 -->

  <!-- commitDialog start -->
  <el-dialog id="commitDialog" :title="problem.name+' commits 紀錄'" :visible.sync="commitDialogVisible" @close="commitDialogActive=false">
    <el-row class="commit-table" v-if="commitDialogActive==false">
      <el-col :span="20" :offset="2">
        <el-table :data="commitTableData">
          <el-table-column property="handDate" label="提交日期"></el-table-column>
          <el-table-column property="name" label="提交人"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <span><a @click="seeCommitCode(scope.row)" href="javascript:void(0)" style="color: #409EFF; text-decoration: none;"><i class="fas fa-code"></i> 檢視</a></span>
            </template>
          </el-table-column>
        </el-table>
        <div class="sm-space"></div>
      </el-col>
    </el-row>
    <div class="codeDiff-block" v-if="commitDialogActive">
      <vue-code-diff :old-string="oldCode" :new-string="newCode" :context="10"></vue-code-diff>
      <div><a class="back2commit-hyperlink" href="javascript:void(0);" @click="commitDialogActive=false"><i class="fas fa-long-arrow-alt-left"></i> 返回</a></div>
    </div>
  </el-dialog>
  <!-- commitDialog end -->
  
  <fab-rank></fab-rank>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'
import {
  codemirror
} from 'vue-codemirror-lite'
import GeneralUtil from '@/utils/GeneralUtil.js'
import DateUtil from '@/utils/DateUtil.js'
import KeyPatUtil from '@/utils/KeyPatUtil.js'
import {toKeys} from '@/utils/KeywordTrans.js'
import vueCodeDiff from 'vue-code-diff'

import NavHeaderStudent from '@/components/NavHeaderStudent'
import NavFooter from '@/components/NavFooter'
import ProblemInfoSection from '@/components/Student/ProblemInfoSection'
import FabRank from '@/components/FabRank.vue'

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
    ProblemInfoSection,
    NavFooter,
    codemirror,
    vueCodeDiff,
    FabRank
  },
  data() {
    return {
      // problem
      problem: {
        'id': this.$route.query.problemId,
        'judged': null,
        'name': '',
        'rate': null,
        'type': '',
        'category': '',
        'tag': [],
        'deadline': '',
        'description': '',
        'input': '',
        'output': '',
        'testCases': [],
        'correctNum': null,
        'incorrectNum': null,
        'pattern': []
      },
      mode: "text/x-java",
      nowLang: 'Java',
      languages: [{
        value: 'Java',
        label: 'Java'
      }, {
        value: 'Python',
        label: 'Python',
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
        'symbol': [],
        'errorInfo': [],
        'output': [],
        'bestCode': null
      },
      // commit dialog
      commitDialogVisible: false,
      commitTableData: [],
      // code difference
      commitDialogActive: false, // 是否顯示code diff
      commitIndex: '',
      oldCode: '',
      newCode: '',
      // FIXME: discuss correct
      dicussShowFlag: false,
      correctStudsDone: false, // TODO: 需要被批改的學生, 是否已經送出code
      correctStatus: false,
      correctList: [],
      correctedStatus: false,
      // FIXME: discuss corrected
      dicussCorrectedShowFlag: true,
      correctedStudsDone: false, // 是否已經被批改
      correctedList: []
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
      // 調用外部函示渲染太慢
      // return !DateUtil.isOverDate(this.problem.deadline)

      let deadline = new Date(this.problem.deadline);
      deadline.setDate(deadline.getDate() + 1);
      let today = new Date();

      if(today.valueOf() > deadline.valueOf()) { // 過期
        return false
      } else { // 沒過期
        if(this.problem.judged==false || this.problem.type=='練習題' || this.problem.type=='作業' || this.problem.type=='活動題') {
          return true
        }
      }
    }
  },
  mounted() {
    this.checkLogin();
    this.getProblemData();
    this.getHistoryScore();
  },
  methods: {
    checkLogin() {
      axios.get('/api/checkLogin').then((response) => {
        let res = response.data;
        if (res.status == "200") {
          if (res.result.authority == 'student') {
            // pass
          } else if (res.result.authority == 'teacher') {
            this.$router.push('/teacher/courseList');
          } else if (res.result.authority == 'assistant') {
            this.$router.push('/assistant/courseList');
          } else if (res.result.authority == 'admin') {
            this.$router.push('/admin/index');
          }  
        } else {
          this.$router.push('/login');
        }
      });
    },
    checkJudged() {
      axios.get('/api/judge/checkJudged', {
        params: {
          problemId: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          // console.log('judged:' + res.result.judged);
          this.problem.judged = res.result.judged;
          if (res.result.judged == true) {
            this.problem.judged = true;

            this.getJudgedInfo();

            // FIXME: show discuss section
            console.log(this.problem.type);
            if (this.problem.type == '討論題') {
              this.checkCorrectStatus();
              this.checkCorrectedStatus();
            }
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
          problemId: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.judgedResultForm.handDate = res.result.handDate;
          this.judgedResultForm.score = res.result.score;
          this.judgedResultForm.runtime = res.result.runTime + ' ms';
          this.judgedResultForm.code = res.result.code;
          this.judgedResultForm.symbol = res.result.symbol;
          this.judgedResultForm.errorInfo = res.result.errorInfo;
          this.judgedResultForm.output = res.result.output;
          this.judgedResultForm.bestCode = res.result.best;
        }
      });
    },
    getProblemData() {
      axios.get('/api/problem/getInfo', {
        params: {
          problemId: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.problem.name = res.result.name;
          this.problem.rate = parseInt(res.result.rate);
          this.problem.type = res.result.type;
          this.problem.category = res.result.category;
          this.problem.tag = res.result.tag;
          this.problem.deadline = res.result.deadline;
          this.problem.description = res.result.description;
          this.problem.input = res.result.inputDesc;
          this.problem.output = res.result.outputDesc;
          this.problem.testCases = res.result.testCases;
          this.problem.correctNum = parseInt(res.result.correctNum);
          this.problem.incorrectNum = parseInt(res.result.incorrectNum);
          this.problem.pattern = res.result.pattern;
          
          this.setLanguage(this.problem.tag);
          this.checkJudged();
        }
      });
    },
    getHistoryScore() {
      axios.get('/api/student/historyScore', {
        params: {
          courseId: this.$store.state.course.courseInfo.courseId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.commitTableData = []; // 先清空
          let data = res.result;
          let problemId = this.problem.id;

          for(let i=0; i<data.length; i++) {
            if(data[i].problemId == problemId) {
              let historyCode = data[i].historyCode;

              for(let j=0; j<historyCode.length; j++) {
                let obj = {
                  index: j,
                  handDate: historyCode[j].handDate,
                  name: '我',
                  code: historyCode[j].code
                }
                this.commitTableData.push(obj);
              }
            }
          }
        }
      });
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
    // code mirror
    setLanguage(tags) {
      tags.forEach((tag) => {
        if (tag ==' Java') {
          this.nowLang = 'Java';
          this.changeNowLang('Java');
        } else if (tag == 'Python') {
          this.nowLang = 'Python';
          this.changeNowLang('Python');
        }
      });
    },
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
      // check code
      let flag = true;
      let checkErrorMsg = '';
      let checkResult = GeneralUtil.checkCode(this.code);
      flag = checkResult.flag;
      checkErrorMsg = checkResult.checkErrorMsg;

      if(flag == false) {
        this.$message.error(checkErrorMsg);
      }
      // if code check pass
      if (flag == true) {
        this.$confirm('確認是否要提交代碼？', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'info',
          center: true
        }).then(() => {
          // FIXME: keyword檢查
          // NOTE: 190725 取消keyword
          // let keywords = KeyPatUtil.toKeys(this.problem.tag);
          // console.log(keywords);

          // 看code是否有包含keyword
          // if (KeyPatUtil.isInRule(keywords, this.code) == false) {
          //   this.$message.error('程式邏輯錯誤！');
          //   return;
          // }

          // FIXME: pattern檢查
          console.log(this.problem.pattern);
          if (KeyPatUtil.isInRule(this.problem.pattern, this.code) == false) {
            this.$message.error('程式碼內沒有包含pattern');
            return;
          }

          this.judging = true;
          axios.post('/api/judge/judgeCode', {
            problemId: this.problem.id,
            code: this.code,
            language: this.nowLang
          }).then((response) => {
            let res = response.data;
            if (res.status == '200') {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });

              this.problem.judged = true;
              this.getJudgedInfo();
              this.getHistoryScore();
              // 刷新圓餅圖
              axios.get('/api/problem/getInfo', {
                params: {
                  problemId: this.problem.id
                }
              }).then((response) => {
                let res = response.data;
                if (res.status == '200') {
                  this.problem.correctNum = parseInt(res.result.correctNum);
                  this.problem.incorrectNum = parseInt(res.result.incorrectNum);
                }
              });
              // 練習題與作業無限送出更改judging狀態及清空code
              if (this.problem.type == '練習題' || this.problem.type == '作業' || this.problem.type == '活動題') {
                this.judging = false;
                this.code = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello! World!");
    }
}`;
              }

              // FIXME: 如果是討論題，顯示出批改學生的區域
              if (this.problem.type == '討論題') {
                this.getCorrectStuds();

                // this.dicussShowFlag = true;
                // this.options.readOnly = true;
                // this.$nextTick(() => {
                //   this.$refs.discussCodeMirror0[0].value = this.correctList[0].code;
                //   var self = this;
                //   setTimeout(function() {
                //     self.$refs.discussCodeMirror0[0].editor.refresh();
                //   },1);
                // });
              }
            } else {
              console.log('judgedErrorMsg:' + res.msg);
            }
          }).catch((error) => {
            console.log(error);
          });
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
    seeCommitCode(data) {
      this.commitIndex = data.index;
      if(data.index == 0) {
        this.oldCode = '';
        this.newCode = data.code;
      } else {
        this.oldCode = this.commitTableData[data.index-1].code;
        this.newCode = data.code;
      }
      this.commitDialogActive = true;
    },
    // FIXME: discuss section
    getCorrectStuds() {
      axios.get('/api/team/correctStuds', {
        params: {
          problemId: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.correctList = res.result;

          // 沒有學生已經完成題目(=沒有學生有code)
          if (this.correctList.length == 0) {
            this.correctStudsDone = false;
            this.dicussShowFlag = true;
            return;
          } else {
            // TODO:
            // console.log(res.result);
            // console.log(this.correctList);
            this.correctStudsDone = true;

            this.dicussShowFlag = true;
            this.options.readOnly = true;
            this.$nextTick(() => {
              this.$refs.discussCodeMirror0[0].value = this.correctList[0].code;
              var self = this;
              setTimeout(function() {
                self.$refs.discussCodeMirror0[0].editor.refresh();
              },1);
            });
          }
        }
      });
      
      this.correctList.forEach((ele)=> {
        ele.score = 0; // 分數
        ele.correctValue = 0; // 程式正確性
        ele.readValue = 0; // 程式可讀性
        ele.skillValue = 0; // 技巧運用
        ele.completeValue = 0; // 程式完整性
        ele.wholeValue = 0; // 綜合評分
      });
    },
    clickCorrectTab(tab) {
      this.$nextTick(() => {
        tab.$children[0].value = this.correctList[tab.index].code;
        var self = this;
        setTimeout(function() {
          tab.$children[0].editor.refresh();
        },1);
      });
    },
    submitCorrect() {
      this.$confirm('確定已經評分完所有同學，要送出評分結果嗎？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // FIXME: 送出評分
        this.correctStatus = true;

        let resultList = [];
        this.correctList.forEach((ele) => {
          let obj = {
            correctedAccount: ele.studentAccount,
            score: ele.score,
            correctValue: ele.correctValue,
            readValue: ele.readValue,
            skillValue: ele.skillValue,
            completeValue: ele.completeValue,
            wholeValue: ele.wholeValue
          }
          resultList.push(obj);
        });

        axios.post('/api/team/submitCorrect', {
          problemId: this.problem.id,
          correctedList: resultList
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '送出評分成功!'
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消送出評分'
        });          
      });
    },
    checkCorrectStatus() {
      // FIXME: correctStatus
      axios.get('/api/team/checkCorrectStatus', {
        params: {
          problemId: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.correctStatus = res.result.status;

          if (this.correctStatus == true) {
            this.correctStudsDone = true;
            this.getCorrectInfo();
          } else {
            this.getCorrectStuds();
          }
        }
      });
    },
    getCorrectInfo() {
      axios.get('/api/team/correctInfo', {
        params: {
          problemId: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.correctList = res.result;
          this.dicussShowFlag = true;
          this.options.readOnly = true;
          this.$nextTick(() => {
            this.$refs.discussCodeMirror0[0].value = this.correctList[0].code;
            var self = this;
            setTimeout(function() {
              self.$refs.discussCodeMirror0[0].editor.refresh();
            },1);
          });
        }
      })
    },
    // NOTE: new
    checkCorrectedStatus() {
      axios.get('/api/team/checkCorrectedStatus', {
        params: {
          problemId: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.correctedStudsDone = res.result.status;
          console.log('correctedStudsDone:'+this.correctedStudsDone);

          if (this.correctedStudsDone == true) {
            this.getCorrectedInfo();
          }
        }
      })
    },
    getCorrectedInfo() { // 取得被別人批改的成績
      axios.get('/api/team/correctedInfo', {
        params: {
          problemId: this.problem.id
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.correctedList = res.result;
          console.log(this.correctedList);
        }
      });

    }
  }
}
</script>

<style>
  .commit-hyperlink {
    color: #303133;
    text-decoration: none;
    transition: all .3s ease;
  }

  .commit-hyperlink:hover {
    color: #409EFF;
  }

  /* codeDiff-block */
  #commitDialog .el-dialog {
    width: 60vw;
  }

  .codeDiff-block {
    padding-bottom: 35px;
  }

  .back2commit-hyperlink {
    float: right;
    color: #303133;
    text-decoration: none;
    transition: all .3s ease;
  }

  .back2commit-hyperlink:hover {
    color: #409EFF;
  }

  /* code mirror */
  #discuss-correct-section .CodeMirror-gutters {
    height: 50vh !important;
  }

  #discuss-correct-section .CodeMirror-scroll {
    min-height: 50vh !important;
    height: auto;
  }

  #discuss-correct-section .CodeMirror {
    min-height: 50vh !important;
    height: auto;
  }

  #discuss-correct-section .CodeMirror-sizer {
    margin-left: 41px !important;
  }

  #discuss-correct-section .CodeMirror-linenumbers {
    width: 29px !important;
  }

  #discuss-correct-section .title {
    display: block;
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  #discuss-correct-section .block {
    padding: 20px 24px;
    overflow: hidden;
  }

  #discuss-correct-section .small-title {
    display: inline-block;
    font-size: 16px;
    text-align: center;
    margin-top: 7px;
    color: rgb(132, 146, 166);
  }


  #discuss-correct-section .correct-slider {
    padding-left: 10px;
  }

  /* discuss corrected 被批改的資料 */

  #discuss-corrected-section .title {
    display: block;
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  #discuss-corrected-section .small-title {
    display: inline-block;
    font-size: 16px;
    text-align: center;
    margin-top: 6px;
    color: #303133;
  }

  #discuss-corrected-section .score {
    color: #303133;
    text-align: center;
    width:80%;
    margin-top: 4px;
    margin-bottom: 0px;
    margin-left: 15px;
    font-size: 18px;
    border: 1px #DCDFE6 solid;
    border-radius: 10px;
  }
</style>

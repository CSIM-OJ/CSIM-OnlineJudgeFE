<template>
<div>
  <div class="box-square">
    <el-input class='filterInput' v-model='filterQuery' placeholder='請輸入題目ID或名稱' clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    <el-table :data="tableFiltered.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%" v-loading="tableLoading">
      <el-table-column type="expand">
        <template slot-scope="props">
        <el-form label-position="left" inline class="table-expand">
            <el-form-item label="題目名稱">
                <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="已作題人數">
                <span>{{ props.row.doneStudentNum }}</span>
                <span class="overview" @click="showDoStatusDialog(props.row.name, 'done')">&nbsp;<i class="fas fa-file-alt"></i></span>
            </el-form-item>
            <el-form-item label="題目 ID">
                <span>{{ props.row.problemId }}</span>
            </el-form-item>
            <el-form-item label="未作題人數">
                <span>{{ props.row.undoStudentNum }}</span>
                <span class="overview" @click="showDoStatusDialog(props.row.name, 'undo')">&nbsp;<i class="fas fa-file-alt"></i></span>
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
            <!-- TODO: 討論題:匯出互評成績 -->
            <el-form-item label="匯出互評" v-if="props.row.type=='討論題'">
                <span><el-button type="success" size="small" @click="discussScore2Csv(props.row.problemId, props.row.name)">匯出</el-button></span>
            </el-form-item>
            <!-- TODO: 討論題:匯出互評成績 -->
            <!-- TODO: 討論題:老師評分學生 -->
            <el-form-item label="教師評分" v-if="props.row.type=='討論題'">
                <span><el-button type="warning" size="small" @click="onTeacherDiscuss(props.row.name)">評分</el-button></span>
            </el-form-item>
            <!-- TODO: 討論題:老師評分學生 -->
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
      <el-table-column label="題目 ID" prop="problemId" width="100"></el-table-column>
      <el-table-column label="題目名稱" width="230">
        <template slot-scope="scope">
          <a class="id-hyperlink" href="javascript:void(0)" @click="showProblemInfo(scope.row.problemId)">{{ scope.row.name }}</a>
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
          <el-button size="mini" @click="editProblem(scope.row.problemId)">編輯</el-button>
          <el-button size="mini" type="danger" @click="deleteProblem(scope.row.problemId)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="text-align:center; margin-top:30px;">
    <el-pagination background layout="prev, pager, next" :total="total" @current-change="currentChange"></el-pagination>
  </div>

  <!-- FIXME: -->
  <el-dialog id="teacherDiscussDialog" :fullscreen="true" :title="'教師評分 - '+trDiscussProblemName" :visible.sync="teacherDiscussDialogVisible" @open="setDefaultSelectStud" @close="closeTrDiscussDialog">
    <el-container>
      <el-aside>
        <el-menu @select="tdSelectStud" :default-active="selectedAccount">
          <el-menu-item v-for="(stud,index) in tdStudsAllList" :index="stud.account" :key="index">
            <i class="el-icon-user-solid"></i>
            <span slot="title">{{ stud.name }}
              <!-- 學生是否完成做題 -->
              <span v-if="stud.isJudged" style="color: #E6A23C; font-size: 12px;">已做題</span>
              <span v-else style="color: #909399; font-size: 12px;">未做題</span>
            </span>
            <!-- 老師是否完成批改 -->
            <span style="float:right; color:#67C23A;" v-if="stud.isTrJudged">
              <i class="el-icon-check" style="color:#67C23A;"></i>批改完成
            </span>
            <span style="float:right; color:#F56C6C;" v-else>
              <i class="el-icon-close" style="color:#F56C6C;"></i>尚未批改
            </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <discuss-correct-form :data="tdCodeData[selectedAccount]" :lang="nowLang"></discuss-correct-form>
        <el-button type="primary" style="float: right; margin-top: 25px;">送出</el-button>
      </el-main>
    </el-container>
  </el-dialog>
  <!-- FIXME: -->

</div>
</template>

<script>
import axios from 'axios'
import { json2csv } from '@/utils/json2csv.js'

import DiscussCorrectForm from '@/components/Student/DiscussCorrectForm'

export default {
  components: {
    DiscussCorrectForm
  },
  props: ['problemData', 'tableLoading'],
  computed: {
    tableFiltered() {
      let oriTable = this.problemData;
      let filteredTable = [];

      if (this.filterQuery == '') {
        this.total= oriTable.length; // pagination
        return oriTable
      } else {
        for (let i = 0; i < oriTable.length; i++) {
          if (oriTable[i].problemId.includes(this.filterQuery) || oriTable[i].name.includes(this.filterQuery)) {
            filteredTable.push(oriTable[i]);
          }
        }
        this.total= filteredTable.length; // pagination
        return filteredTable
      }
    }
  },
  mounted() {
    this.setLanguage(this.problemData.tag);
  },
  data() {
    return {
      // loading
      // tableLoading: '',
      // filter
      filterQuery: '',
      // pagination
      total: 0,
      pagesize: 10,
      currentPage: 1,
      // detectCopyLoading
      detectCopyLoading: false,
      // FIXME: 老師評分
      teacherDiscussDialogVisible: false,
      trDiscussProblemName: '',
      codeSection: '',
      selectedAccount: '', // 當前選擇的account
      nowLang: '', // 此題目的程式語言
      tdStudsAllList: [{
        name: '蘇靖軒',
        account: '04156147',
        isJudged: false,
        isTrJudged: false
      }, {
        name: '陳冠毅',
        account: '04156211',
        isJudged: true,
        isTrJudged: true
      }],
      tdCodeData: {
        '04156147': {
          code: 'zzzafadafwad',
          correctValue: {
            score: 0,
            comment: ''
          },
          readValue: {
            score: 0,
            comment: ''
          },
          skillValue: {
            score: 0,
            comment: ''
          },
          completeValue: {
            score: 0,
            comment: ''
          },
          wholeValue: {
            score: 0,
            comment: ''
          },
          comment: ''
        },
        '04156211': {
          code: 'java import zz',
          correctValue: {
            score: 0,
            comment: ''
          },
          readValue: {
            score: 0,
            comment: ''
          },
          skillValue: {
            score: 0,
            comment: ''
          },
          completeValue: {
            score: 0,
            comment: ''
          },
          wholeValue: {
            score: 0,
            comment: ''
          },
          comment: ''
        }
      }
    }
  },
  methods: {
    // FIXME:
    onTeacherDiscuss(problemName) {
      this.trDiscussProblemName = problemName;
      this.teacherDiscussDialogVisible = true;
    },
    // @open
    setDefaultSelectStud() {
      this.tdSelectStud(this.tdStudsAllList[0].account);

      // 老師批改區塊scroll回到最頂
      let element = document.getElementById('teacherDiscussDialog').getElementsByClassName('el-main')[0];
      element.scrollTo(0,0);
    },
    // @close
    closeTrDiscussDialog() {
      // 老師批改區塊scroll回到最頂
      let element = document.getElementById('teacherDiscussDialog').getElementsByClassName('el-main')[0];
      element.scrollTo(0,0);

      this.teacherDiscussDialogVisible = false;
    },
    tdSelectStud(account) {
      console.log(account);
      console.log(this.tdCodeData[account]);
      // this.codeSection = this.tdCodeData[account].code;
      this.selectedAccount = account;
      
      // 老師批改區塊scroll回到最頂
      let element = document.getElementById('teacherDiscussDialog').getElementsByClassName('el-main')[0];
      element.scrollTo(0,0);
    },
    setLanguage(tags) {
      tags.forEach((tag) => {
        if (tag ==' Java') {
          this.nowLang = 'Java';
        } else if (tag == 'Python') {
          this.nowLang = 'Python';
        }
      });
    },
    // pagination
    currentChange(currentPage) {
      this.currentPage = currentPage;
    },
    // view problem
    showProblemInfo(problemId) {
      this.$emit('showViewProblemDialog', problemId);
    },
    // editProblem
    editProblem(problemId) {
      this.$confirm('確認是否要編輯此題目？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        axios.get('/api/problem/getInfo', {
          params: {
            problemId: problemId
          }
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            let editProblemData = {};
            editProblemData.id = problemId;
            editProblemData.name = res.result.name;
            editProblemData.type = res.result.type;
            editProblemData.category = res.result.category;
            editProblemData.tag = res.result.tag;
            editProblemData.deadline = res.result.deadline;
            editProblemData.description = res.result.description;
            editProblemData.inputDesc = res.result.inputDesc;
            editProblemData.outputDesc = res.result.outputDesc;
            editProblemData.testCases = res.result.testCases;
            editProblemData.keyword = res.result.keyword;

            // 處理pattern格式(pat)
            let patternList = [];
            res.result.pattern.forEach((item) => {
              let obj = {
                pat: item
              }
              patternList.push(obj);
            })
            editProblemData.pattern = patternList;

            this.$emit('showEditProblemDialog', editProblemData);
          }
        });
      }).catch((err) => {
        console.log(err);
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    deleteProblem(problemId) {
      this.$confirm('確認是否要刪除此題目？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        this.tableLoading = true;
        axios.post('/api/problem/deleteProblem', {
          problemId: problemId
        }).then((response) => {
          let res = response.data;
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '刪除成功!'
            });

            this.$emit('refreshProblemsData');
            this.tableLoading = false;
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
      axios.post('/api/judge/judgeCopy', {
        problemId: problemId
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          this.$message({
            type: 'success',
            message: problemId + ' 抄襲判別完成!'
          });
          this.$emit('refreshProblemsData');
          this.detectCopyLoading = false;
        } else {
          this.detectCopyLoading = false;
          this.$message.error('判別抄襲失敗');
        }
      })
    },
    // do status
    showDoStatusDialog(problemName, status) {
      this.$emit('showDoStatusDialog', problemName, status);
    },
    // TODO: discussScore2Csv
    discussScore2Csv(problemId, problemName) {
      axios.get('/api/team/discussScore', {
        params: {
          problemId: problemId
        }
      }).then((response) => {
        let res = response.data;
        if (res.status == '200') {
          let result = res.result;

          let options = {
            headers: ['account', 'name', 'studentClass', 'courseName', 'score', 'discussedScore.studentAccount', 'discussedScore.correctValue.score', 'discussedScore.correctValue.comment', 'discussedScore.readValue.score', 'discussedScore.readValue.comment', 'discussedScore.skillValue.score', 'discussedScore.skillValue.comment', 'discussedScore.completeValue.score', 'discussedScore.completeValue.comment', 'discussedScore.wholeValue.score', 'discussedScore.wholeValue.comment', 'discussedScore.comment'],
            rename: ['學號', '姓名', '班級', '課程', '系統批改的成績', '批改者學號', '程式正確性分數', '程式正確性評論', '程式可讀性分數', '程式可讀性評論', '技巧運用分數', '技巧運用評論', '程式完整性分數', '程式完整性評論', '綜合評分分數', '綜合評分評論', '總評論']
          }
          
          let csvName = problemName+'互評成績';
          json2csv(result, csvName, options);
        }
      });
    }
  }
}
</script>

<style>
#detectCopyFormItem .el-form-item__content {
  width: 80%;
}

/* teacher discuss dialog */
#teacherDiscussDialog .el-dialog__wrapper {
  overflow: initial;
}

#teacherDiscussDialog .el-dialog.is-fullscreen {
  overflow: initial;
  border-radius: 0px;
}

#teacherDiscussDialog .el-container {
  height: calc(100vh - 84px);
}

#teacherDiscussDialog .block.el-row {
  margin-top: 25px;
}
</style>

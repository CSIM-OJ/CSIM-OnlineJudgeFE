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
</div>
</template>

<script>
import axios from 'axios'
import { json2csv } from '@/utils/json2csv.js'

export default {
  components: {},
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
      detectCopyLoading: false
    }
  },
  methods: {
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
            headers: ['account', 'name', 'studentClass', 'courseName', 'score', 'discussedScore.studentAccount', 'discussedScore.correctValue', 'discussedScore.readValue', 'discussedScore.skillValue', 'discussedScore.completeValue', 'discussedScore.wholeValue'],
            rename: ['學號', '姓名', '班級', '課程', '系統批改的成績', '批改者學號', '程式正確性', '程式可讀性', '技巧運用', '程式完整性', '綜合評分']
          }
          
          let csvName = problemName+'互評成績';
          json2csv(result, csvName, options);
        }
      });
    }
  }
}
</script>
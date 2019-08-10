<template>
<div>
  <el-container style="height: 100vh;">
    <el-aside>
      <el-menu @select="tdSelectStud">
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
    </el-main>
  </el-container>
</div>
</template>

<script>
import DiscussCorrectForm from '@/components/Student/DiscussCorrectForm'

export default {
  components: {
    DiscussCorrectForm
  },
  data() {
    return {
      // FIXME: 老師評分
      teacherDiscussDialogVisible: false,
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
    tdSelectStud(account) {
      console.log(account);
      console.log(this.tdCodeData[account]);
      // this.codeSection = this.tdCodeData[account].code;
      this.selectedAccount = account;
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
  }
}
</script>
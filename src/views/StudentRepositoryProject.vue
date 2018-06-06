<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row class="main">
    <el-col :span="20" :offset="2" class="box">
      <div class="project-info">
        <div class="project-name">{{ projectData.name }}</div>
        <span class="project-desc">{{ projectData.desc }}</span>
      </div>
      <el-tabs type="card">
        <el-tab-pane>
          <span slot="label"><i class="fas fa-code"></i> 程式碼</span>
          <el-table :data="projectData.files" style="width: 100%">
            <el-table-column label="檔案名稱" width="300">
              <template slot-scope="scope">
                <a class="fileName">{{ scope.row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="modifyDesc" label="修改描述">
            </el-table-column>
            <el-table-column prop="modifyTime" label="修改時間">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="新增文件">
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
              <el-select v-model="fontSize" style="width: 100px;">
                <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div>
            <codemirror v-model="code" :options="options" ref="myEditor" :style="{'font-size': fontSize+'px'}"></codemirror>
          </div>
        </el-tab-pane>
        <el-tab-pane label="設定">Setting</el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import {
  codemirror
} from 'vue-codemirror-lite'

import NavHeaderStudent from '@/components/NavHeaderStudent.vue'
import NavFooter from '@/components/NavFooter.vue'

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

export default {
  components: {
    NavHeaderStudent,
    NavFooter,
    codemirror
  },
  data() {
    return {
      projectData: {
        name: '遞迴程式',
        desc: '演算法的遞迴程式',
        files: [{
          name: '費氏數列.java',
          modifyDesc: 'update',
          modifyTime: '2018-6-6 12:32'
        }, {
          name: '河內塔.java',
          modifyDesc: '修改後段程式',
          modifyTime: '2018-6-6 12:32'
        }, {
          name: '最大公因數.java',
          modifyDesc: '修改演算法',
          modifyTime: '2018-6-6 12:32'
        }]
      },
      // CodeMirror
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
      themes: ['Default', 'Eclipse', 'Darcula', 'Blackboard']
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
    }
  }
}
</script>

<style>
.project-info {
  margin-bottom: 20px;
}

.project-info .project-name {
  display: inline-block;
  color: #303133;
  font-size: 35px;
  margin-right: 10px;
}

.project-info .project-desc {
  color: #606266;
}

.fileName {
  cursor: pointer;
  text-decoration: none;
  color: #303133;
  transition: all .3s ease;
}

.fileName:hover {
  color: #409EFF;
}
</style>

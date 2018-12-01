<template>
<div>
  <nav-header-student></nav-header-student>
  <el-row :gutter="20">
    <el-col :span="20" :offset="2">
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main style="padding-top: 0px;">
          <div class="post box-square" v-for="(post, index) in postList">
            <div class="problem">{{ post.problemName }}</div>
            <div class="problem-id">{{ post.problemID }}</div>
            <div class="info">
              <div class="name">{{ post.postName }}</div>
            </div>
            <div class="content">
              {{ post.postContent }}
            </div>
            <div class="bottom">
              <a v-if="post.thumbActive==false" class="bottom-thumb bounce" href="javascript:void(0)"><i class="fas fa-thumbs-up" @click="sendThumb(index)"></i> {{ post.thumbNum }}</a>
              <a v-else class="bottom-thumb thumbActive bounce" href="javascript:void(0)"><i class="fas fa-thumbs-up" @click="backThumb"></i> {{ post.thumbNum }}</a>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-col>
  </el-row>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'

import NavHeaderStudent from '@/components/NavHeaderStudent'
import NavFooter from '@/components/NavFooter'

import '@/assets/css/forum.css'

export default {
  components: {
    NavHeaderStudent,
    NavFooter
  },
  data() {
    return {
      postList: [{
        postID: '0',
        problemName: '找出最大最小值',
        problemID: 'P0012',
        postName: '蘇靖軒',
        postTime: '2018-05-24',
        postContent: '先把所有數字兩個兩個比，並且個別放入兩個區塊，一塊放大的數，一塊放小的數。接著再從大數的區塊比出最大值，從小數的區塊比出最小值。',
        thumbNum: '12',
        thumbActive: false
      }]
    }
  },
  methods: {
    sendThumb(index) {
      this.postList[index].thumbActive = true;
      this.postList[index].thumbNum++;
    },
    backThumb() {

    }
  }
}
</script>

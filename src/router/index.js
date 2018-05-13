import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import StudentIndex from '@/views/StudentIndex'
import StudentScorePanel from '@/views/StudentScorePanel'
import StudentMypage from '@/views/StudentMypage'
import StudentCoding from '@/views/StudentCoding'
import NewProblem from '@/views/NewProblem'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/student/index',
      name: 'StudentIndex',
      component: StudentIndex
    },
    {
      path: '/student/scorePanel',
      name: 'StudentScorePanel',
      component: StudentScorePanel
    },
    {
      path: '/student/mypage',
      name: 'StudentMypage',
      component: StudentMypage
    },
    {
      path: '/student/coding',
      name: 'StudentCoding',
      component: StudentCoding
    },
    {
      path: '/admin/newProblem',
      name: 'NewProblem',
      component: NewProblem
    }
  ]
})

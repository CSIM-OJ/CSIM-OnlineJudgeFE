import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import StudentIndex from '@/views/StudentIndex'
import StudentScorePanel from '@/views/StudentScorePanel'
import StudentMypage from '@/views/StudentMypage'
import StudentCoding from '@/views/StudentCoding'
import AdminIndex from '@/views/AdminIndex'
import AdminNewProblem from '@/views/AdminNewProblem'
import AdminStudentsData from '@/views/AdminStudentsData'
import AdminOverview from '@/views/AdminOverview'
import Forum from '@/views/Forum'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
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
      path: '/admin/index',
      name: 'AdminIndex',
      component: AdminIndex
    },
    {
      path: '/admin/newProblem',
      name: 'AdminNewProblem',
      component: AdminNewProblem
    },
    {
      path: '/admin/studentsData',
      name: 'AdminStudentsData',
      component: AdminStudentsData
    },
    {
      path: '/admin/overview',
      name: 'AdminOverview',
      component: AdminOverview
    },
    {
      path: '/forum',
      name: 'Forum',
      component: Forum
    }
  ]
})

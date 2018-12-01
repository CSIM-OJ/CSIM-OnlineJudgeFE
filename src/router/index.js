import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import StudentIndex from '@/views/StudentIndex'
import StudentScorePanel from '@/views/StudentScorePanel'
import StudentMypage from '@/views/StudentMypage'
import StudentCoding from '@/views/StudentCoding'
import AdminIndex from '@/views/AdminIndex'
import AdminProblemsData from '@/views/AdminProblemsData'
import AdminNewProblem from '@/views/AdminNewProblem'
import AdminStudentManage from '@/views/AdminStudentManage'
import AdminStudentsData from '@/views/AdminStudentsData'
import AdminFeedback from '@/views/AdminFeedback'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'Root',
      component: Login
    },
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
      path: '/admin/index',
      name: 'AdminIndex',
      component: AdminIndex
    },
    {
      path: '/admin/problemsData',
      name: 'AdminProblemsData',
      component: AdminProblemsData
    },
    {
      path: '/admin/newProblem',
      name: 'AdminNewProblem',
      component: AdminNewProblem
    },
    {
      path: '/admin/studentManage',
      name: 'AdminStudentManage',
      component: AdminStudentManage
    },
    {
      path: '/admin/studentsData',
      name: 'AdminStudentsData',
      component: AdminStudentsData
    },
    {
      path: '/admin/feedback',
      name: 'AdminFeedback',
      component: AdminFeedback
    }
  ]
})

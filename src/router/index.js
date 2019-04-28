import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import StudentCourseList from '@/views/Student/StudentCourseList' 
import StudentIndex from '@/views/Student/StudentIndex'
import StudentScorePanel from '@/views/Student/StudentScorePanel'
import StudentMypage from '@/views/Student/StudentMypage'
import StudentCoding from '@/views/Student/StudentCoding'
// import StudentRepository from '@/views/StudentRepository'
// import StudentRepositoryProject from '@/views/StudentRepositoryProject'

import AdminIndex from '@/views/Admin/AdminIndex'
import AdminProblemsData from '@/views/Admin/AdminProblemsData'
import AdminNewProblem from '@/views/Admin/AdminNewProblem'
import AdminStudentManage from '@/views/Admin/AdminStudentManage'
import AdminStudentsData from '@/views/Admin/AdminStudentsData'
import AdminFeedback from '@/views/Admin/AdminFeedback'

import TeacherCourseList from '@/views/Teacher/TeacherCourseList'
import TeacherNewCourse from '@/views/Teacher/TeacherNewCourse'
import TeacherEditCourse from '@/views/Teacher/TeacherEditCourse'
import TeacherCourseIndex from '@/views/Teacher/TeacherCourseIndex'
import TeacherProblemsData from '@/views/Teacher/TeacherProblemsData'
import TeacherNewProblem from '@/views/Teacher/TeacherNewProblem'
import TeacherStudentManage from '@/views/Teacher/TeacherStudentManage'
import TeacherStudentsData from '@/views/Teacher/TeacherStudentsData'
import TeacherFeedback from '@/views/Teacher/TeacherFeedback'
// import Forum from '@/views/Forum'
// import VueChatTest from '@/views/VueChatTest'

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
      path: '/student/courseList',
      name: 'StudentCourseList',
      component: StudentCourseList
    },
    {
      path: '/student/:courseName/index',
      name: 'StudentIndex',
      component: StudentIndex
    },
    {
      path: '/student/:courseName/scorePanel',
      name: 'StudentScorePanel',
      component: StudentScorePanel
    },
    {
      path: '/student/:courseName/mypage',
      name: 'StudentMypage',
      component: StudentMypage
    },
    {
      path: '/student/:courseName/coding',
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
    },
    {
      path: '/teacher/courseList',
      name: 'TeacherCourseList',
      component: TeacherCourseList
    },
    {
      path: '/teacher/newCourse',
      component: TeacherNewCourse
    },
    {
      path: '/teacher/editCourse',
      name: 'TeacherEditCourse',
      component: TeacherEditCourse
    },
    {
      path: '/teacher/:courseName/index',
      component: TeacherCourseIndex
    },
    {
      path: '/teacher/:courseName/problemsData',
      component: TeacherProblemsData
    },
    {
      path: '/teacher/:courseName/newProblem',
      component: TeacherNewProblem
    },
    {
      path: '/teacher/:courseName/studentManage',
      component: TeacherStudentManage
    },
    {
      path: '/teacher/:courseName/studentsData',
      component: TeacherStudentsData
    },
    {
      path: '/teacher/:courseName/feedback',
      component: TeacherFeedback
    }
  ]
})

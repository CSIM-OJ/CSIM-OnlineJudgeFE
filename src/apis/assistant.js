import req from './https.js'

export const apiAddStudentList = params => req('post', '/assistant/addStudentList', params)
export const apiDeleteStudentList = params => req('post', '/assistant/deleteStudentList', params)
export const apiCourseList = () => req('get', '/assistant/courseList')
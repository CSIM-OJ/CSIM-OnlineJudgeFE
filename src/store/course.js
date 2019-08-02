const course = {
  state: {
    courseInfo: {},
  },
  mutations: {
    initCourseInfo(state, courseInfo) {
      state.courseInfo = courseInfo;
    }
  },
}

export default course;
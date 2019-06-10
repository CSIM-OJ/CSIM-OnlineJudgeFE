let problemTag = [
  {'value': 'Java'},
  {'value': 'Python'},
  {'value': '條件'},
  {'value': '迴圈'},
  {'value': '陣列'},
]

let problemType = [
  {'value': '作業', 'label': '作業'},
  {'value': '練習題', 'label': '練習題'},
  {'value': '討論題', 'label': '討論題'},
  {'value': '活動題', 'label': '活動題'}
]

let quesTagOptions = [{
  label: '程式語言',
  options: [{
    value: 'Java',
    label: 'Java'
  }, {
    value: 'Python',
    label: 'Python'
  }]
}, {
  label: '題目類型',
  options: [{
    value: '條件',
    label: '條件'
  }, {
    value: '迴圈',
    label: '迴圈'
  }, {
    value: '陣列',
    label: '陣列'
  }]
}]

export default {
  data: () => ({
    problemTag,
    problemType,
    quesTagOptions
  }),
  methods: {
  }
}

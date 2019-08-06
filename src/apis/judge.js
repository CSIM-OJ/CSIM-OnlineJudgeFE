import req from './https.js'

export const apiJudgeCode = params => req('post', '/judge/judgeCode', params)
export const apiJudgedInfo = params => req('post', '/judge/judgedInfo', params)
export const apiCheckJudged = params => req('post', '/judge/checkJudged', params)
export const apiJudgeCopy = params => req('post', '/judge/judgeCopy', params)

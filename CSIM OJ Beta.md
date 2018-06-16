# 資料庫（MongoDB）

* Collections：

  1. **Student**：學生

     ~~~json
     {
         "account": "",
     	"password": "0000",
     	"name": "",
     	"student_class": "106資一A", // String, 學生系級
     	"classGroup": "106資一A程式設計", // String, 被分到的群組班級 e.g.104計算機程式設計
     	"problems": [{ // List[Object], 學生可做的題目
             "problem_id": "", // String, 題目id
             "problem_name": "", // String, 題目名稱
             "type": "", // String, 題目類型
     		"judged": null, // Boolean, 是否已被批改
     		"rate": null, // Double, 題目難易度
     		"code": "", // String, 題目代碼
     		"runTime": "", // Double, 程式運行時間
     		"errorInfo": "", // String, 程式錯誤訊息
     		"score": null, // Double, 程式分數
     		"handDate": "", // String, 做題後當時日期時間
             "best": false, // boolean, 是否為最佳程式作答者, 預設為false
             "bestcode": "", // String, 最佳代碼
     		"copys":[ // 抄襲相似
                 { 
     				"studentID": "", // String, 相似的另個學生學號
     				"similarity": "" // Double, 相似度
                 }
              ]
     	}]
     }
     ~~~


  2. **Admin**：管理員

     ~~~json
     {
         "account": "admin",
         "password": "admin123"
     }
     ~~~


  3. **Problem**：題目

     - 題目資訊

     - 新增、編輯題目

       ```json
       {
           "_id": "",
           "name": "",
           "type": "", // String, 題目類型
           "rate": null, // Double, 題目平均難易度
           "desc": "", // String, 題目描述
           "readFile": null, // Boolean, 是否為讀檔題
           "writeFile": null, // Boolean, 是否為寫檔題
           "inputDesc": "", // String, 輸入描述
           "outputDesc": "", // String, 輸出描述
           "inputSample1": "", // String, 輸入範例1
           "outputSample1": "", // String, 輸出範例1
           "inputSample2": "", // String, 輸入範例2
           "outSample2": "", // String, 輸出範例2
           "inputSample3": "", // String, 特殊輸入範例
           "outputSample3": "", // String, 特殊輸出範例
           "deadline": "", // String, 截止日期
           "correctNum": null, // Int, 此題正確(滿分)人數
           "incorrectNum": null, // Int, 此題錯誤(未滿分)人數
           "correctRate": null, // Double, 正確率
           "bestcode": { // 最佳代碼（解答）
               "studentID": "", // String, 學生學號（account）
               "code": "", // String, 學生代碼
               "runTime": ""// Double 運行時間
           },
           "detectCopyResults": [{ // List[Object], 題目總抄襲
               studentOneID: "", // String
               studentOneName: "", // String
               studentTwoID: "", // String
               studentTwoName: "", // String
               similarity: null // Double, 相似度
           }]
       }
       ```


  4. **Feedbacks**：學生回饋

     ~~~json
     {
         "account": "",
         "date": "",
         "feedback": ""
     }
     ~~~

  5. **Dashboard**：儀表板統計資料

     ~~~json
     {
         "dashboardID": "", // ID
         "onlineNum": 0, // (今日)在線人數/int
         "activeNum": 0, // (今日)活躍人數，當天頁面訪問次數超過5(看checkLogin呼叫幾次)/int
         "todayDoNum": 0, // 今日做題次數（今日批改次數)/int
         "weekDoNum": 0, // 本週做題次數（本週批改次數）/int
         "onlineData": [{ // 在線與活躍人數線圖（上限：6天）
             "date": "", // 日期
             "onlineNum": 0, // 日期當天在線人數/int
             "activeNum": 0, // 日期當天活躍人數/int
         }],
         "doPerDayData": [{ // 每日做題次數（上限：6天）
             "date": "", // 日期
             "doPerDayNum": 0 // 當日做題次數/int
         }],
         "judgeLiveData": [{ // 即時批改實況（上限：10則）
             "time": "", // 時間 e.g. 2018-05-02 20:25:00
             "studentID": "", // 學生學號
             "studentName": "", // 學生姓名
             "problemID": "", // 題目ID
             "problemName": "", // 題目名稱
             "score": "", // 批改分數
             "errorMsg": "" // 批改錯誤訊息
         }]
     }
     ~~~




# Restful API

* URL = https://hostname:8080/api/

* Response Format

  status：狀態碼

  msg：訊息

  result：回傳的資料

* Status Code

  | Status Code | Description |
  | ----------- | ----------- |
  | 200         | 請求成功    |
  | 404         | 請求失敗    |



1. 基礎api

   | API Method | API URL        | Desc         | Req Params        | Resp Result                                           |
   | ---------- | -------------- | ------------ | ----------------- | ----------------------------------------------------- |
   | POST       | URL/login      | 登入         | account, password | authority(判斷身份。 admin、student)                  |
   | POST       | URL/logout     | 登出         |                   |                                                       |
   | GET        | URL/checkLogin | 檢查登入狀態 |                   | status(boolean)、authority(判斷身份。 admin、student) |


2. 學生api（student）

   | API Method | API URL                    | Desc                   | Req Params                        | Resp Result                                                  |
   | ---------- | -------------------------- | ---------------------- | --------------------------------- | ------------------------------------------------------------ |
   | POST       | URL/student/changePassword | 更改密碼               | account, oriPassowrd, newPassword |                                                              |
   | GET        | URL/student/info           | 個人學生資料           |                                   | studentdID, name, student_class, undoNum, doneNum, bestCodeNum, correctNum, incorrectNum |
   | GET        | URL/student/historyScore   | 學生歷史成績及題目資訊 |                                   | [{problemID, problemName, type, score, handDate, rate, runTime, correctRate, isBestCode(Boolean), copys: [{studentID, similarity}]}] |
   | GET        | URL/student/undoAllList    | 學生所有未做題目資料   |                                   | [{problemID, name, type, deadline, rate}]                    |
   | GET        | URL/student/undoHwList     | 學生作業未做題目資料   |                                   | [{problemID, name, type, deadline, rate}]                    |
   | GET        | URL/student/undoPraList    | 學生練習題未做題目資料 |                                   | [{problemID, name, type, deadline, rate}]                    |
   | GET        | URL/student/doneAllList    | 學生所有已做題目資料   |                                   | [{problemID, name, type, handDate, rate}]                    |
   | GET        | URL/student/doneHwList     | 學生作業已做題目資料   |                                   | [{problemID, name, type, handDate, rate}]                    |
   | GET        | URL/student/donePraList    | 學生練習題已做題目資料 |                                   | [{problemID, name, type, handDate, rate}]                    |
   | POST       | URL/student/updateRate     | 學生對題目的難易度評分 | problemID, rate                   |                                                              |
   | POST       | URL/student/sendFeedback   | 學生對系統的回饋       | feedback                          |                                                              |

3. 題目api（problem）

   | API Method | API URL             | Desc       | Req Params | Resp Result                                                  |
   | ---------- | ------------------- | ---------- | ---------- | ------------------------------------------------------------ |
   | GET        | URL/problem/getInfo | 題目的資訊 | problemID  | name, rate, type, deadline, desc, readFile, writeFile, inputDesc, outputDesc, inputSample1, outputSample1, inputSample2, outputSample2, inputSample3, outputSample3, correctNum, incorrectNum |

4. 批改api（judge）

   | API Method | API URL               | Desc                   | Req Params                                  | Resp Result                                                  |
   | ---------- | --------------------- | ---------------------- | ------------------------------------------- | ------------------------------------------------------------ |
   | POST       | URL/judge/judgeCode   | 批改代碼               | problemID, code, language(JAVA \|\| PYTHON) |                                                              |
   | GET        | URL/judge/judgedInfo  | 已被批改後的資訊       | problemID                                   | handDate, score, runTime, code, CopyResult: [{anotherStudentID, similarity}], errorInfo, best(Boolean) |
   | GET        | URL/judge/checkJudged | 學生在此題是否已被批改 | porblemID                                   | judged(Boolean)                                              |

5. 助教api (ta)

   | API Method | API URL                | Desc                           | Req Params                                                   | Resp Result                                                  |
   | ---------- | ---------------------- | ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
   | POST       | URL/ta/newProblem      | 助教新增題目                   | readWriteList:[] (空 or 讀檔 or 寫檔 or 讀檔、寫檔), name, type, deadline, desc, inputDesc, outputDesc, inputSample1, outputSample1, inputSample2, outputSample2, inputSample3, outputSample3 |                                                              |
   | POST       | URL/ta/editProblem     | 編輯題目                       | problemID, readWriteList:[] (空 or 讀檔 or 寫檔 or 讀檔、寫檔), name, type, deadline, desc, inputDesc, outputDesc, inputSample1, outputSample1, inputSample2, outputSample2, inputSample3, outSample3 |                                                              |
   | GET        | URL/ta/getProblems     | 取得管轄班級的所有題目相關資訊 |                                                              | [{problemID, name, type, status(判斷是否已過期。可作答、已關閉), undoStudentNum, doneStudentNum, rate, correctRate, deadline, bestStudentID, bestStudentName, bestRunTime, detectCopyResult: [{studentOneID, studentOneName,  studentTwoID, studentTwoName,  similarity}] (如果沒有就回空List) |
   | POST       | URL/ta/deleteProblem   | 助教刪除題目                   | problemID                                                    |                                                              |
   | GET        | URL/ta/getStudentsData | 取得管轄班級的所有學生成績     |                                                              | studentID, name, class, problems: [{name, score(若未被批改回傳"未作答"), date, type, code}] |
   | POST       | URL/ta/judgeCopy       | 判斷抄襲                       | problemID                                                    |                                                              |
   | GET        | URL/ta/getFeedback     | 取得意見回饋內容               |                                                              | [{account, date, feedback}]                                  |

6. 排行api (rank)

   | API Method | API URL                  | Desc                                                    | Req Params | Resp Result                                   |
   | ---------- | ------------------------ | ------------------------------------------------------- | ---------- | --------------------------------------------- |
   | GET        | URL/rank/getCorrectRank  | 取得正確解題的學生排行（前五名，有同值則同名，且值>0）  |            | [{rank, studentID, studentName, correctNum}]  |
   | GET        | URL/rank/getBestCodeRank | 取得最佳解答的學生排行 （前五名，有同值則同名，且值>0） |            | [{rank, studentID, studentName, bestCodeNum}] |

   

7. 數據api (data)

   | API Method | API URL                   | Desc                                                         | Req Params | Resp Result                                                  |
   | ---------- | ------------------------- | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
   | GET        | URL/data/getBasicData     | 取得在線人數(onlineNum)、活躍人數(activeNum)、今日做題次數(todayDoNum)、本週做題次數(WeekDoNum)的資訊 |            | onlineNum, activeNum, todayDoNum,  WeekDoNum                 |
   | GET        | URL/data/getOnlineData    | 取得在線與活躍人數統計（6天）                                |            | [{date, onlineNum, activeNum}]                               |
   | GET        | URL/data/getDoPerDayData  | 取得每日做題人數（6天）                                      |            | [{date, doPerDayNum}]                                        |
   | GET        | URL/data/getJudgeLiveData | 取得批改即時資訊                                             |            | [{time, studentID, studentName,  problemID, problemName, score, errorMsg}] |

   

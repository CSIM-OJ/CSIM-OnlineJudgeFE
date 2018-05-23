# 資料庫（MongoDB）

* Collections：

  1. **Students**：學生

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

     

  2. **Admins**：管理員

     ~~~json
     {
         "account": "admin",
         "password": "admin123"
     }
     ~~~

     

  3. **Problems**：題目

     - 題目資訊

     - 新增、編輯題目

       ```json
       {
           "_id": "",
           "name": "",
           "type": "", // String, 題目類型
           "rate": null, // Double, 題目平均難易度
           "desc": "", // String, 題目描述
           "inputDesc": "", // String, 輸入描述
           "outputDesc": "", // String, 輸出描述
           "inputSample1": "", // String, 輸入範例1
           "outputSample1": "", // String, 輸出範例1
           "inputSample2": "", // String, 輸入範例2
           "outSample2": "", // String, 輸出範例2
           "deadline": "", // String, 截止日期
           "correctNum": null, // Int, 此題正確(滿分)人數
           "incorrectNum": null, // Int, 此題錯誤(未滿分)人數
           "correctRate": null, // Double, 正確率
           "bestcode": { // 最佳代碼（解答）
               "studentID": "", // String, 學生學號（account）
               "code": "", // String, 學生代碼
               "runTime": ""// Double 運行時間
           },
           "detectCopyResult": [{ // List[Object], 題目總抄襲
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
   | GET        | URL/student/historyScore   | 學生歷史成績及題目資訊 |                                   | [{problemID, problemName, type, score, handDate, rate, runTime, correctRate, copys: [{studentID, similarity}]}] |
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
   | GET        | URL/problem/getInfo | 題目的資訊 | problemID  | name, rate, type, deadline, desc, inputDesc, outputDesc, inputSample1, outputSample1, inputSample2, outputSample2, [selectedStudents], correctNum, incorrectNum |

4. 批改api（judge）

   | API Method | API URL               | Desc                   | Req Params                                  | Resp Result                                                  |
   | ---------- | --------------------- | ---------------------- | ------------------------------------------- | ------------------------------------------------------------ |
   | POST       | URL/judge/judgeCode   | 批改代碼               | problemID, code, language(JAVA \|\| PYTHON) |                                                              |
   | *GET       | URL/judge/judgedInfo  | 已被批改後的資訊       | problemID                                   | handDate, score, runTime, code, *CopyResult: [{anotherStudentID, similarity}], errorInfo, best(Boolean) |
   | GET        | URL/judge/checkJudged | 學生在此題是否已被批改 | porblemID                                   | judged(Boolean)                                              |

5. 助教api (ta)

   | API Method | API URL                | Desc                           | Req Params                                                   | Resp Result                                                  |
   | ---------- | ---------------------- | ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
   | POST       | URL/ta/newProblem      | 助教新增題目                   | name, type, deadline, desc, inputDesc, outputDesc, inputSample1, outputSample1, inputSample2, outputSample2, *selectedStudents |                                                              |
   | GET        | URL/ta/getProblems     | 取得管轄班級的所有題目相關資訊 |                                                              | [problemID, name, type, status(判斷是否已過期。可作答、已關閉), undoStudentNum, doneStudentNum, rate, correctRate, deadline] |
   | POST       | URL/ta/deleteProblem   | 助教刪除題目                   | problemID                                                    |                                                              |
   | GET        | URL/ta/getStudentsData | 取得管轄班級的所有學生成績     |                                                              | studentID, name, class, problems: [{name, score(若未被批改回傳"未作答")}] |

   
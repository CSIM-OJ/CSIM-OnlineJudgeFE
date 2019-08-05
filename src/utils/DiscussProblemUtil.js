export let setGradingObj = (correctList) => {
  let tempList = [];

  correctList.forEach((ele) => {
    let n = {
      score: 0,
      comment: ''
    };

    let obj = {
      studentAccount: ele.studentAccount,
      code: ele.code,
      correctValue: n,
      readValue: n,
      skillValue: n,
      completeValue: n,
      wholeValue: n
    }
    tempList.push(obj);
  });
  
  return tempList;
};
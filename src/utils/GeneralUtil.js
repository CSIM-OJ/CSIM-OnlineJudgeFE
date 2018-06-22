/**
 * Some general functions are used in the CSIM Online Judge system
 * 1. codeCheck(code): Check student's code doesn't have package and have a correct class name. Return flag's boolean and errorMsg
 * 2. copy(content): Copy the content to the clipboard
 *
 * Created by Ching-Hsuan Su on 18/06/22.
**/

let GeneralUtil = {

  checkCode(code) {
    let flag = true;
    let checkErrorMsg = '';

    // 檢測 package 及 public class name
    let subNewLineCode = code.split('\n');
    subNewLineCode.forEach((line) => {
      let subSpaceLine = line.split(' ');
      subSpaceLine.forEach((el, index) => {
        if (el == 'package') {
          flag = false;
          checkErrorMsg = '不能有 package 出現';
        } else if (el == 'public') {
          if (subSpaceLine[index + 1] == 'class') {
            if (subSpaceLine[index + 2] != 'Main') {
              flag = false;
              checkErrorMsg = '請將 public class 名稱改成 Main';
            }
          }
        }
      });
    });

    return { 'flag': flag, 'checkErrorMsg': checkErrorMsg }
  },

  copy(content) {
    var clip_area = document.createElement('textarea');
    clip_area.textContent = content;

    document.body.appendChild(clip_area);
    clip_area.select();

    document.execCommand('copy');
    clip_area.remove();
  }

}

export { GeneralUtil };

/**
 * Functions of processing date format
 * 1. dateDiff(sDate1, sDate2): Calculate days between two dates. Return (int)days
 * 2. plusOneDay(date): Date of @param date's next day. Return (Date)next day's date
 * 3. getTodayDate(): Return the date of today
 * 4. isOverDate(deadline): If today's date is after the @param deadline, then return true else return false
 *
 * Created by Ching-Hsuan Su on 18/06/22.
**/

let DateUtil = {

  dateDiff(sDate1, sDate2) { // sDate1和sDate2是2018-6-18格式
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); // 轉換為6-18-2018格式
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒數轉換为天數
    // console.log(iDays);
    return iDays
  },

  nextDayDate(date) {
    var date = new Date(date);
    date.setDate(date.getDate() + 1);
    var nextDayDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return nextDayDate
  },

  getTodayDate() {
    let date = new Date();
    let today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return today
  },

  isOverDate(deadline) {
    let deadlineDate = new Date(deadline);
    deadlineDate.setDate(deadlineDate.getDate() + 1);
    let todayDate = new Date();

    if(todayDate.valueOf() > deadlineDate.valueOf()) { // 過期
      return true
    } else { // 沒過期
      return false
    }
  }

}

export { DateUtil };

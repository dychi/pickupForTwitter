function sendMessage(message) {
  var myToken = PropertiesService.getScriptProperties().getProperty('MY_CW_TOKEN');
  var roomId = "81192774";
  var params = {
    headers : {"X-ChatWorkToken" : myToken},
    method : "post",
    payload : {
      body : message
    }
  };
  var url = "https://api.chatwork.com/v2/rooms/" + roomId + "/messages";
  UrlFetchApp.fetch(url, params);
}


function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var content = json.webhook_event.body;
  var today = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd");
  if (content.match(/ストック！/)) {
    content = content.replace( /ストック！/, "" );
    arr = content.split(',');
    arr.unshift(today);
    Logger.log(arr);
    writeSheet(arr);
    sendMessage('Done!');
  }
}

function writeSheet(array) {
  var spreadsheet = SpreadsheetApp.openById('1ZXXYgCRWYoljAWnoJPvCRaH-KO7nYowRXZe5pmTfSP8');
  var sheet = spreadsheet.getSheetByName('データ');
  var lastRow = sheet.getLastRow();
  array.unshift(lastRow);
  // Logger.log(array);
  sheet.appendRow(array);
}

function test() {
  var message = "テスト";
  var corpName = 'microsoft';
  var url = 'https://example.com';
  var imageURL = 'https://example.com/img';
  var today = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd");
  var arr = [corpName, url, message, imageURL];
  arr.unshift(today);
  // Browser.msgBox(arr);
  // writeSheet(arr);
  sendMessage('test');
  // Logger.log(arr);
}
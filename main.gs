function createMessage(number) {
  var stockCode = number;
  var html = UrlFetchApp.fetch("https://stocks.finance.yahoo.co.jp/stocks/detail/?code=" + stockCode).getContentText('utf-8');
  var title = Parser.data(html).from('<h1>').to('</h1>').build();
  var price = Parser.data(html).from('<td class="stoksPrice">').to('</td>').build();
  var message = title + '(' + stockCode + ')は' + price + '円です。';
  Logger.log(message);
  return message;
}


function sendMessage(message) {
  var myToken = PropertiesService.getScriptProperties().getProperty('MY_CW_TOKEN');
  Logger.log(myToken);
  var roomId = "90987703";
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
  content = content.replace( /\[rp.*?\n/g, "" ); // リプライ削除
  content = content.replace( /\[.*?\]/g, "" ); // タグ削除
  
  if (content.match(/Twitter/)) {
    content = content.replace( /\Twitter/g, "" );
    sendMessage(content);
  }
}

function writeSheet(array) {
  var spreadsheet = SpreadsheetApp.openById('1ZXXYgCRWYoljAWnoJPvCRaH-KO7nYowRXZe5pmTfSP8');
  var sheet = spreadsheet.getSheetByName('データ');
  var lastRow = sheet.getLastRow();
  array.unshift(lastRow);
  Logger.log(array);
  sheet.appendRow(array);
}

function test() {
  var message = "テスト";
  var corpName = 'microsoft';
  var url = 'https://example.com';
  var imageURL = 'https://example.com/img';
  var arr = [corpName, url, message, imageURL];
  // writeSheet(arr);
  sendMessage(arr);
}
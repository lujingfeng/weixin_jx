var BaseRequest = {}; 
var menberList = [];
var send = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function(){
  if(arguments[0]){
    var json = JSON.parse(arguments[0]);
    BaseRequest = json.BaseRequest;
  }

  send.apply(this, arguments);

  this.addEventListener('readystatechange', function(response){
    if(this.readyState == 4 && this.status == 200){
      if(this.responseURL.indexOf('webwxgetcontact') >-1){
        var json = JSON.parse(this.responseText);
        menberList = json.MemberList||[];
        menberList = menberList.filter(function(item){
          return item.AttrStatus > 100;
        });
        createChatRoom();
      }
    }
  });
}

var failedList = [];
var corpseList = [];//僵尸粉列表
var timestamp = 15 * 1000;

function createChatRoom(){
  if(menberList.length <= 0){
    console.log('corpseList=', corpseList);
    return;
  }
    
  var userMap = {};
  var inviteList = menberList.length > 30 ? menberList.splice(0, 30) : menberList;
  inviteList = inviteList.map(function(item){
    userMap[item.UserName] = item;
    return {
      UserName: item.UserName
    }
  });

  BaseRequest.DeviceID = 'e'+ Math.round(Math.random(32) * 10000000000000000);

  var json = {
    BaseRequest: BaseRequest,
    MemberCount: inviteList.length,
    MemberList: inviteList,
    Topic: ''
  };

  var xhr = new XMLHttpRequest();
  xhr.open('post','https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxcreatechatroom?r='+Date.now());
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(json));
  xhr.onreadystatechange = function(event){
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var resJson = JSON.parse(xhr.responseText);
      if(resJson.BaseResponse.Ret !== 0){
        failedList = failedList.concat(inviteList);
        setTimeout(createChatRoom, timestamp);
      }else{
        setTimeout(createChatRoom, timestamp);
        var mlist = resJson.MemberList || [];
        mlist = mlist.map(function(item){
          var origin = userMap[item.UserName];
          if(!item.NickName){
            origin.NickName = '';
          }
          return origin
        });
        corpseList = corpseList.concat(mlist.filter(function(m){
          return !m.NickName
        }));
      }
    }else if(xhr.readyState == XMLHttpRequest.DONE && xhr.status != 200){
      setTimeout(createChatRoom, timestamp);
    }
  }
}




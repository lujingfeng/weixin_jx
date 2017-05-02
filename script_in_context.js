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
        menberList = json.MemberList;
        createChatRoom();
      }
    }
  });
}

function createChatRoom(){
  var inviteList = menberList.filter(function(item){
    return item.AttrStatus > 100;
  });

  inviteList = inviteList.slice(0, 2);

  inviteList = inviteList.map(function(item){
    return {
      UserName: item.UserName
    }
  });

  BaseRequest.DeviceID = 'e'+ Math.round(Math.random(32) * 10000000000000000);

  var json = {
    BaseRequest: BaseRequest,
    MemberCount: 2,
    MemberList: [{UserName: '@6b063d6557c2d4ff4ca9b8f17a21741b'}, {UserName: '@589aecdcdd1b2bfe3786480640f4d90230fcd02c542273628d690f29ca939e7d'}],
    Topic: ''
  };

  var xhr = new XMLHttpRequest();
  xhr.open('post','https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxcreatechatroom?r='+Date.now());
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(json));
}




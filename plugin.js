
// 1.同步获取脚本内容
var readFileSync = function(filename, callback) {
    // read script sync
    var xhr = new XMLHttpRequest();
    var scriptUrl = chrome.extension.getURL(filename);
    //!!! disable async
    xhr.open("GET", scriptUrl, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
};
// 2.插入内联脚本
var writeScriptSync = function(code) {
    var s = document.createElement('script');
    s.textContent = code;
    var doc = document.head || document.documentElement;
    return doc.appendChild(s);
};
// test
readFileSync('script_in_context.js', writeScriptSync);


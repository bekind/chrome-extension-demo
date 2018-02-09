// When the extension is installed or upgraded ...
var supportArray = [
    'chuchutong.com',
    'daweixinke.com',
    'chuchujie.com'
  ];

var pageRules = [];
function createRules(){
    supportArray.forEach((item, index, array)=>{
        var rule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostContains: item }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        };
        pageRules.push(rule);
    })
}
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        createRules();
        chrome.declarativeContent.onPageChanged.addRules(pageRules);
    });
});


//   function update(tabId) {
//     if (location.host.indexOf('.chuchutong.com') == -1) {
//       chrome.pageAction.hide(tabId);
//     }
//     else {
//       chrome.pageAction.show(tabId);
//     }
//   }

//   chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
//     console.log(tab.url);
//     if (change.status == "complete") {
//     //   update(tabId);
//     }
//   });

//   chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
//     update(tabId);
//   });

//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     update(tabs[0].id);
//   });
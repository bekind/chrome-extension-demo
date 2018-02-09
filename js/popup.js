// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}
chrome.tabs.executeScript(null,{file: 'js/clientbridge.js'})

// The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {

  new Vue({
    el: '#main',
    data: {
      supported: false,
      debugStatus: false,
      token: undefined,
      currentDomain: '',
      editTokenStatus: false,
      editable: true
    },
    methods: {
      switchPro: function () {
        var that = this;
        this.debugStatus = !this.debugStatus;
        saveDebugStatus('app-debug', that.debugStatus);
      },
      changeStatus: function () {
        var that = this;
        that.editTokenStatus = !that.editTokenStatus;
        if (!that.token) {
          that.editable = false;
          $('#token').focus();
        } else {
          that.editable = true;
        }
      },
      editToken: function () {
        var that = this;
        if (that.editable) {
          that.editable = false;
          $('#token').focus();
        } else {
          //保存
          that.token = $('#token').val();
          saveDebugStatus('tkValue', that.token);
          that.editTokenStatus = !that.editTokenStatus;
        }
      },
      gotoSetting: function () {
        if (this.supported) {
          var optionUrl = chrome.extension.getURL("../page/options.html");
          chrome.tabs.create({
            url: optionUrl
          }, (tab) => { });
        }
      },
      getTokenKey: function(url) {
        if (url.indexOf('.daweixinke.com')!==-1) {
          return 'm_cck_access_token';
        } else {
          return 'access_token';
        }
      }
    },
    created: function () {
      var that = this;
      that.debugStatus = true;
      getCurrentTabUrl((url) => {
        chrome.cookies.get({ url: url, name: that.getTokenKey(url) }, function (cookie) {
          ///值就在cookie 里面了
          // alert(JSON.stringify(cookie));
          if (cookie) {
            that.token = cookie.value;
          }

          that.currentDomain = getDomainUrl(url);
          if (avaliable(that.currentDomain)) {
            that.supported = true;
          }
          getDebugStatus('app-debug', (items) => {
            that.debugStatus = items;
            console.log(that.debugStatus);
            // that.token = items['tkValue'];
          });
        });
      });
    },
    mounted: function () { }
  });
});

// See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
// optional callback since we don't need to perform any action once the
// background color is saved.
function saveDebugStatus(url, status) {
  var items = {};
  items[url] = status;
  chrome.storage.sync.set(items);
}

function getDebugStatus(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}
var supportArray = [
  '.chuchutong.com',
  '.daweixinke.com',
  '.chuchujie.com'
];

function avaliable(url) {
  return supportArray.indexOf(url) != -1;
}

//存储cookie
function _vm_setCookie(name, value, days) {
  var d = new Date();
  if (!days) {
    days = 30;
  }
  d.setTime(d.getTime() + (days * 24 * 3600 * 1000));
  var expires = "expires=" + d.toUTCString();
  var _vm_domain = getDomainUrl(location.host);
  document.cookie = name + "=" + value + ";path=/;domain=" + _vm_domain + ";" + expires;
}

//读取cookie
function _vm_getCookie(name) {
  /**
   * getCookie
   * @param name
   * @returns 对应cookie值，没有返回null
   */
  var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"),
    r = document.cookie.match(reg);
  return r ? decodeURIComponent(r[2]) : null;
}

//删除cookie
function _vm_removeCookie(name) {
  _vm_setCookie(name, null, -1);
}

//读取存储的配置信息
function getDebugSettings(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

function saveDebugSettings(url, key, value) {
  var that = this;
  getDebugSettings(url, (items) => {
    items[key] = value;
    saveDebugStatus(key, items);
  })
}

function saveDebugStatus(url, status) {
  var items = {};
  items[url] = status;
  chrome.storage.sync.set(items);
}

/**
 * save extension option value
 * @param {string} item option item key 
 * @param {*} value  option item value
 */
function saveOptions(item, value) {
  var items = {};
  items[item] = value;
  chrome.storage.sync.set(items);
}

/**
 * get extension option value
 * @param {string} item option item key
 * @param {function} callback return callback
 */
function getOptions(item, callback) {
  chrome.storage.sync.get(item, (items) => {
    callback(chrome.runtime.lastError ? null : items[item]);
  })
}

/**
 * 读取插件配置信息
 * @param {function} callback 
 */
function getAppDetails(callback) {
  var version = null;
  $.get(chrome.extension.getURL('manifest.json'), function (info) {
   callback && callback(info);
  }, 'json');
}

//获取url中的主域名
//例如：dev.master.ccj.chuchutong.com----> .ccj.chuchutong.com
function getDomainUrl(url) {
  var tokenDomain = '';
  if (url.indexOf('chuchutong.com') != -1) {
    tokenDomain = '.chuchutong.com'
  } else if (url.indexOf('.daweixinke.com') != -1) {
    tokenDomain = '.daweixinke.com';
  } else if (url.indexOf('.chuchujie.com') != -1) {
    tokenDomain = '.chuchujie.com';
  } else {
    var splits = url.split('.');
    var len = splits.length;
    if (len > 1) {
      tokenDomain = '.' + splits[len - 2] + '.com';
    }
  }
  return tokenDomain;
}

function getPackageNameWithType(type) {
  var packageName = 'com.culiu.chuchutui';
  //后期再优化
  // var pakages = ['com.culiu.chuchutui','com.culiu.consultant'];
  switch (+type) {
    case 1:
      //楚楚推
      packageName = 'com.culiu.chuchutui';
      break;
    case 2:
      //楚楚顾问
      packageName = 'com.culiu.consultant';
      break;
    case 3:
      //萌萌团
      packageName = 'com.culiu.mengmengtuan';
      break;
    case 4:
      //赚享客
      packageName = 'com.culiu.zhuanxiangke';
      break;
    case 5:
      //微友团
      packageName = 'com.culiu.weiyoutuan';
      break;
    case 6:
      packageName = 'com.culiu.youxuanguwen'
      break;
    default:
      packageName = 'com.culiu.chuchutui';
      break;
  }
  return packageName;
}

function getAppPartnerIdWithType(type) {
  var appId = 14;
  switch (+type) {
    case 1:
      //楚楚推
      appId = 14;
      break;
    case 2:
      //楚楚顾问
      appId = 0;
      break;
    case 3:
      //萌萌团
      appId = 11;
      break;
    case 4:
      //赚享客
      appId = 12;
      break;
    case 5:
      //微友团
      appId = 13;
      break;
    case 6:
      //优选汇
      appId = 15;
      break;
    default:
      appId = 14;
      break;
  }
  return appId;
}

function Browser() { }
Browser.prototype = {
  versions: function () {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信
      QQ: u.indexOf(' QQ') > -1, //qq浏览器
      qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
  }()
}
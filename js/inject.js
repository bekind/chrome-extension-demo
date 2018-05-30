//
var _vm_domainKey = getDomainUrl(location.host);

// listen chrome setting option change
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        // console.log('App Debug status changed!("%s"-->"%s")', storageChange.oldValue, storageChange.newValue);
        if (key == 'tkValue' && storageChange.newValue) {
            var tk = storageChange.newValue;
            _vm_setCookie('access_token', tk);
            _vm_setCookie('m_cck_access_token', tk);
        }

        if (key == 'app-opt') {
            localStorage.removeItem('m_ccj_dwxk-cctui_clientInfo');
            localStorage.removeItem('wx_ccj_clientInfo');
        }

        if (key == 'app-debug' && storageChange.newValue) {
            initialSetupEnv();
        } else {
            clearSetupEnv();
        }
        location.reload();
    }
});

//get setting option
//app-debug: value [boolean] true is in app debug mode, false is not



getDebugSettings('app-debug', (debug) => {
    if (debug) {
        initialSetupEnv(() => {
            readFileSync('../js/clientbridge.min.js', writeScriptSync);
            // var srcUrl = chrome.extension.getURL("../js/clientbridge.min.js");
            // $.get(srcUrl, function(data){
            //     writeScriptSync(data);
            // });
            //src 方式为异步加载，不能保证在页面js执行之前执行
            // var srcUrl = chrome.extension.getURL("../js/clientbridge.js");
            // var script = '<script type="text/javascript" ></script>';
            // $('html').prepend(script);
        });
    } else {
        clearSetupEnv();
    }
});


/**
 * 初始化基础环境变量和cookie存储
 */
function initialSetupEnv(callback) {
    var browser = new Browser();
    clearSetupEnv();
    getOptions('app-opt', (value) => {
        var packageName = getPackageNameWithType(value);
        var appId = getAppPartnerIdWithType(value);
        if (browser.versions.ios) {
            getOptions('app-iosversion', (version) => {
                _vm_setCookie('package_name', packageName);
                _vm_setCookie('client_version', version || '1.0');
                _vm_setCookie('client_type', 'ios');
                _vm_setCookie('app_partner_id', appId);
            });
        } else if (browser.versions.android) {
            getOptions('app-androidversion', (version) => {
                _vm_setCookie('package', packageName);
                _vm_setCookie('version', version || '1.0');
                _vm_setCookie('client_type', 'android');
                _vm_setCookie('app_partner_id', appId);
            })
        }

        //set token
        getDebugSettings('tkValue', (tk) => {
            if (tk) {
                _vm_setCookie('m_cck_access_token', tk);
                _vm_setCookie('access_token', tk);
            }
            if (callback && typeof callback == 'function') {
                callback();
            }
        })
    });
}

/**
* 清除APP Debug数据痕迹
*/
function clearSetupEnv() {
    _vm_removeCookie('package_name');
    _vm_removeCookie('package');
    _vm_removeCookie('client_version');
    _vm_removeCookie('version');
    _vm_removeCookie('client_type');
    _vm_removeCookie('package_name');
    _vm_removeCookie('app_partner_id');
}


// 1.同步获取脚本内容
function readFileSync(filename, callback) {
    var bridgeCode = localStorage.getItem('chromebridge');
    if (bridgeCode) {
        writeScriptSync(bridgeCode);
    } else {
        // read script sync
        var xhr = new XMLHttpRequest();
        var scriptUrl = chrome.extension.getURL(filename);
        //!!! disable async
        xhr.open("GET", scriptUrl, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                localStorage.setItem('chromebridge', xhr.responseText);
                callback(xhr.responseText);
            }
        };
        xhr.send(null);
    }
};

// 2.插入内联脚本
function writeScriptSync(code) {
    var s = document.createElement('script');
    s.textContent = code;
    var doc = document.head || document.documentElement;
    return doc.appendChild(s);
};


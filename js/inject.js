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
            // chrome.tabs.executeScript(null,{file: '../js/clientbridge.js'})

            // var srcUrl = chrome.extension.getURL("../js/clientbridge.js");
            // var script = '<script type="text/javascript" src=' + srcUrl + '></script>';
            // $('html').prepend(script);
        });
    } else {
        clearSetupEnv();
    }
});
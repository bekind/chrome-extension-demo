// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Set the default app options
*/

window.addEventListener('load', function () {

  $('.tabular.menu .item').tab();
  $('.ui.accordion').accordion();
  $('.ui.dropdown').dropdown();

  new Vue({
    el: '#main',
    data: {
      appSelectedValue: 1,
      initialLocalIos: '',
      initialLocalAndroid: '',
      iosVersion: '',
      androidVersion: ''
    },
    methods: {
      dropDownChanged: function () {
        $('.dropdown').dropdown({
          action: 'activate',
          onChange: function (value, text, $selectedItem) {
            console.log('app changed to: %s',value);
            saveOptions('app-opt', value);
          }
        });
      },
      clearNoNum: function(data) {
        data = data.replace(/[^\d.]/g, "");//清除“数字”和“.”以外的字符
        return data;
       },
      inputBlur: function(type){
        var that = this;
        if (type == 1 && that.iosVersion) {
          that.iosVersion = that.clearNoNum(that.iosVersion);
          if (that.iosVersion != that.initialLocalIos) {
            saveOptions('app-iosversion', that.iosVersion);
          }
        } else if (type == 2 && that.androidVersion) {
          that.androidVersion = that.clearNoNum(that.androidVersion);
          if (that.androidVersion != that.initialLocalAndroid) {
            saveOptions('app-androidversion', that.androidVersion);
          }
        }
      }
    },
    created: function () {
      var that = this;
      getOptions('app-opt', (value) => {
        if (value) {
          that.appSelectedValue = value;
        } else {
          // default set chuchutui
          that.appSelectedValue = 1;
        }
        //初始化下拉选中
        $('.ui.dropdown').dropdown('set selected', that.appSelectedValue);
        // console.log($('.ui.dropdown').dropdown('get value'));
        that.dropDownChanged();
      });

      getOptions('app-iosversion', (value) => {
        if (value) {
          that.initialLocalIos = value;
          that.iosVersion =  value;
        }
      });

      getOptions('app-androidversion', (value) => {
        if (value) {
          that.initialLocalAndroid = value;
          that.androidVersion = value;
        }
      })
    }
  })

});
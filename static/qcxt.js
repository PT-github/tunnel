/// <reference path="jquery-1.7.1.min.js" />
var rtspws = false;
$.getScript("/rtsp/js");
var qcxt = {
    video: {
        dhPlugin: false,
        hkPlugin: false,
        vlcPlugin: false,
        isload: false,
        load: function () {
            for (var r = 0, s = navigator.mimeTypes.length; s > r; r++) {
                if (navigator.mimeTypes[r].type.toLowerCase().indexOf("application/media-plugin-version-") >= 0) {
                    dhPlugin = navigator.mimeTypes[r].type;
                } else if (navigator.mimeTypes[r].type.toLowerCase().indexOf("application/x-vlc-plugin") >= 0) {
                    vlcPlugin = true;
                } else if (navigator.mimeTypes[r].type.toLowerCase().indexOf("application/webvideo-plugin-kit") >= 0) {
                    hkPlugin = true;
                }
            }
            isload = true;
        },
        checkPluginInstall: function (type) {
            if (!isload) {
                qcxt.load();
            }
            switch (type) {
                case "dh":
                    return this.dhPlugin;
                case "hk":
                    return this.dhPlugin;
                case "vlc":
                    return this.vlcPlugin;
            }
            return false;
        },
        /**
         * 播放大华的
         * @param {any} elementId 
         * @param {*} width 
         * @param {*} height 
         * @param {*} data 
         * @param {*} pluginVideoId 
         */
        playDH: function (elementId, width, height, data, pluginVideoId) {
            if ($(elementId).find("[data-channel]").length == 0) {
                $(elementId).html('<object type="' + this.dhPlugin + '" width="' + width + '" height="' + height + '" data-type="dh" data-channel="' + data.channel + '" id="' + pluginVideoId + '"></object>');
                var pluginObject = document.getElementById(pluginVideoId);
                var ret = pluginObject.LoginDeviceEx(data.recordIP, data.recordPort, data.username || "admin", data.password || "admin123", data.protocol || 0);
                pluginObject.ProtocolPluginWithWebCall('{"Protocol":"EnablePreviewDBClickFullSreen","Params":{"Enable":true}}');//双击放大
                pluginObject.SetModuleMode(1);
                pluginObject.ConnectRealVideo(data.channel - 1, 1);
            } else {
                var pluginObject = document.getElementById($(elementId).find("[data-channel]").attr("id"));
                pluginObject.ConnectRealVideo(data.channel - 1, 1);
            }
        },
        /**
         * 播放海康的
         * @param {any} elementId 
         * @param {*} width 
         * @param {*} height 
         * @param {*} data 
         * @param {*} pluginVideoId 
         */
        playHK: function (elementId, width, height, data, pluginVideoId) {
            var iRet = WebVideoCtrl.I_CheckPluginInstall();
            WebVideoCtrl.I_InitPlugin(width, height, {
                bWndFull: true,     //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
                iPackageType: 2,    //2:PS 11:MP4
                iWndowType: 1,
                bNoPlugin: true,
                cbSelWnd: function (xmlDoc) {
                    g_iWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
                    var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
                    console.log(szInfo);
                },
                cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
                    var szInfo = "当前放大的窗口编号：" + iWndIndex;
                    if (!bFullScreen) {
                        szInfo = "当前还原的窗口编号：" + iWndIndex;
                    }
                    console.log(szInfo);
                },
                cbEvent: function (iEventType, iParam1, iParam2) {
                    if (2 == iEventType) {// 回放正常结束
                        console.log("窗口" + iParam1 + "回放结束！");
                    } else if (-1 == iEventType) {
                        console.log("设备" + iParam1 + "网络错误！");
                    } else if (3001 == iEventType) {
                        clickStopRecord(g_szRecordType, iParam1);
                    }
                },
                cbRemoteConfig: function () {
                    console.log("关闭远程配置库！");
                },
                cbInitPluginComplete: function () {
                    $(elementId).html('<div id="divPlugin' + $(elementId).attr("id") + '"  class="plugin"></div>');
                    WebVideoCtrl.I_InsertOBJECTPlugin('divPlugin' + $(elementId).attr("id"));
                    console.log($(elementId).attr("id"));
                }
            });
            var szDeviceIdentify = data.recordIP + "_" + data.recordPort;
            var iRet = WebVideoCtrl.I_Login(data.recordIP, 1, data.recordPort, data.username || "admin", data.password || "abcd1234",
                {
                    success: function (xmlDoc) {
                        console.log(szDeviceIdentify + " 登录成功！");
                        var startRealPlay = function () {
                            console.log("准备预览" + JSON.stringify({
                                iRtspPort: data.iRtspPort || 554,
                                iStreamType: 1,
                                iChannelID: 1,
                                bZeroChannel: false
                            }))
                            WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                                iRtspPort: data.iRtspPort || 554,
                                iStreamType: 1,
                                iChannelID: 1,
                                bZeroChannel: false,
                                success: function () {
                                    szInfo = "开始预览成功！";
                                    console.log(szDeviceIdentify + " " + szInfo);
                                },
                                error: function (status, xmlDoc) {
                                    if (403 === status) {
                                        szInfo = "设备不支持Websocket取流！";
                                    } else {
                                        szInfo = "开始预览失败！";
                                    }
                                    console.log(szDeviceIdentify + " " + szInfo + JSON.stringify(arguments));
                                    qcxt.video.playRtsp(elementId, width, height, data, pluginVideoId);
                                }
                            });

                        };
                        startRealPlay();
                    }
                    ,
                    error: function (status, xmlDoc) {
                        console.log(szDeviceIdentify + " 登录失败！", status, xmlDoc);
                        qcxt.video.playRtsp(elementId, width, height, data, pluginVideoId);
                    }
                });
        },
        /**
        * 播放RTSP的
        * @param {any} elementId 
        * @param {*} width 
        * @param {*} height 
        * @param {*} data 
        * @param {*} pluginVideoId 
        */
        playRtsp: function (elementId, width, height, data, pluginVideoId) {
            var rtsp = data.rtsp || data.rtspUrl || data.rtspurl;
            if (qcxt.video.vlcPlugin) {
                $(elementId).html('<object type="application/x-vlc-plugin" id="vlc" events="True" width="' + width + '" height="' + height + '" pluginspage="http://www.videolan.org" codebase="npapi-vlc-2.0.6.tar.xz"><param name="mrl" value="' + rtsp + '" /><param name="autoplay" value="true" /><param name="ShowDisplay" value="false" /><param name="fullscreen" value="true" /> </object>');
            } else {
                qcxt.video.playRtspHtml5(elementId, width, height, data, pluginVideoId);
            }
        },
        /**
       * 播放RTSP的
       * @param {any} elementId 
       * @param {*} width 
       * @param {*} height 
       * @param {*} data 
       * @param {*} pluginVideoId 
       */
        playRtspHtml5: function (elementId, width, height, data, pluginVideoId) {
            $.getScript("/rtsp/js",function()
            {
                var rtsp = data.rtsp || data.rtspUrl || data.rtspurl;
                $(elementId).html('<video class="centeredVideo" controls autoplay width="' + width + '" height="' + height + '" data-type="rtsphtml5" data-channel="' + data.channel + '" id="' + pluginVideoId + '" muted>不支持html5 播放器</video></div>');
                if (flvjs.isSupported()) {
                    var flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        url: 'ws://' + top.location.host + '/rtsp/1/?url=' + encodeURIComponent(rtsp),
                        "isLive": true,//<====加个这个 
                        hasAudio: false,
                        hasVideo: true,
                        //withCredentials: false,
                        //cors: true
                    }, {
                        enableWorker: true,	// 开启多线程
                        enableStashBuffer: false,
                        lazyLoad: false,
                        lazyLoadMaxDuration: 0,
                        lazyLoadRecoverDuration: 0,
                        deferLoadAfterSourceOpen: false,
                        fixAudioTimestampGap: true,
                        autoCleanupSourceBuffer: true,
                    });
                    flvPlayer.attachMediaElement(document.getElementById(pluginVideoId));
                    flvPlayer.load(); //加载
                    document.getElementById(pluginVideoId).play();
                    return;
                }
            });
        },
        /**
         * 显示视频
         * @param {any} elementId 要显示的视频div id
         * @param {any} width 宽度
         * @param {any} height 高度
         * @param {any} data  deviceConfig 字段的值
         */
        show: function (elementId, width, height, data) {

            $.getScript("/rtsp/js");
            if (typeof (data) == "string") {
                data = JSON.parse(data);
            }
            var recordType = data.recordType;//dh 大华，hk=海康威视
            var pluginVideoId = "dhVideo" + new Date().getTime();
            var nothref = "/vlc-3.0.11-win32.exe";
            if (data.recordIP) {
                if (data.nethost1) {
                    if (top.location.host.indexOf(data.nethost1) >= 0) {
                        data.recordIP = data.recordIP1;
                        data.recordPort = data.recordPort1;
                    }
                } else if (data.nethost2) {
                    if (top.location.host.indexOf(data.nethost2) >= 0) {
                        data.recordIP = data.recordIP2;
                        data.recordPort = data.recordPort2;
                    }
                }
                else if (data.nethost3) {
                    if (top.location.host.indexOf(data.nethost3) >= 0) {
                        data.recordIP = data.recordIP3;
                        data.recordPort = data.recordPort3;
                    }
                }
            }
            switch (recordType) {
                case "dh"://大华
                    nothref = "/webplugin.exe";
                    data.rtspUrl = "rtsp://" + (data.username || "admin") + ":" + (data.password || "admin123") + "@" + data.recordIP + ":" + (data.RtspPort || 554) + "/cam/realmonitor?channel=1&subtype=0";
                    if (qcxt.video.dhPlugin) {
                        qcxt.video.playDH(elementId, width, height, data, pluginVideoId);
                        return;
                    }
                    break;
                case "hk"://海康
                    nothref = "/WebComponentsKit.exe";
                    data.rtspUrl = "rtsp://" + (data.username || "admin") + ":" + (data.password || "admin123") + "@" + data.recordIP + ":" + (data.RtspPort || 554) + "/h264/ch1/main/av_stream";
                    if (qcxt.video.hkPlugin) {
                        qcxt.video.playHK(elementId, width, height, data, pluginVideoId);
                        return;
                    }
                    break;
            }
            if (qcxt.video.vlcPlugin) {
                qcxt.video.playRtsp(elementId, width, height, data, pluginVideoId);
            } else {
                $(elementId).html('<div class="nop"  style="background-color: #000;position:relative;text-align:color: #FFF;min-height: 50px;text-align:center;width:' + width + 'px;height:' + height + 'px;line-height:' + height + 'px;" id="' + pluginVideoId + '"><a type="application/octet-stream" style="color:#FFF;" href="'+nothref+'">请安装控件包</a></div>');
                qcxt.video.playRtspHtml5(elementId, width, height, data, pluginVideoId);
            }
        }, dis: function (elementId) {
            var id = $(elementId).find("object")[0];
            if ($(id).data("type") == "dh") {
                id.DisConnectRealVideo(parseInt($(id).data("channel")) - 1);
            }
        }
    }
};
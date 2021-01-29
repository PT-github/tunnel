/// <reference path="jquery-1.7.1.min.js" />
var qcxt = {
    video: {
        checkPluginInstall: function (type) {
            var e = false;
            if (type == "dh") {
                //大华摄像头
                if (window.ActiveXObject || "ActiveXObject" in window) {
                    try {
                        new ActiveXObject("WebActiveEXE.Plugin.1");
                        e = true;
                    }
                    catch (n) {
                        e = false;
                    }
                }
                else {
                    for (var r = 0, s = navigator.mimeTypes.length; s > r; r++) {
                        if (navigator.mimeTypes[r].type.toLowerCase() == "application/media-plugin-version-3.1.0.2") {
                            e = true;
                        }
                    }
                }
            }else  if (type == "hk") {
                //大华摄像头
                if (window.ActiveXObject || "ActiveXObject" in window) {
                    try {
                        new ActiveXObject("WebActiveEXE.Plugin.1");
                        e = true;
                    }
                    catch (n) {
                        e = false;
                    }
                }
                else {
                    for (var r = 0, s = navigator.mimeTypes.length; s > r; r++) {
                        if (navigator.mimeTypes[r].type.toLowerCase() == "application/media-plugin-version-3.1.0.2") {
                            e = true;
                        }
                    }
                }
            }
            return e;
        },
        /**
         * 显示视频
         * @param {any} elementId 要显示的视频div id
         * @param {any} width 宽度
         * @param {any} height 高度
         * @param {any} data  deviceConfig 字段的值
         */
        show: function (elementId, width, height, data) {
            if (typeof (data) == "string") {
                data = JSON.parse(data);
            }
            console.log(JSON.stringify(data))
            var recordType = data.recordType;//dh 大华，hk=海康威视
            var pluginVideoId = "dhVideo" + new Date().getTime();
            switch (recordType) {
                case "dh"://大华
                var  dhip=top.location.hostname;
                var ddhPort=data.recordPort||65038;
                    if(data.nethost1){
                        if (top.location.host.indexOf(data.nethost1) >= 0) {
                            dhip=data.recordIP1;
                            ddhPort= data.recordPort1||ddhPort;
                        }
                    }else if(data.nethost2){
                        if (top.location.host.indexOf(data.nethost2) >= 0) {
                            dhip=data.recordIP2;
                            ddhPort= data.recordPort2||ddhPort;
                        }
                    }
                    else if(data.nethost3){
                        if (top.location.host.indexOf(data.nethost3) >= 0) {
                            dhip=data.recordIP3;
                            ddhPort= data.recordPort3||ddhPort;
                        }
                    }
                    data.recordIP =dhip;
                    data.recordPort =parseInt(ddhPort) ;
                    console.log(data)
                    if (qcxt.video.checkPluginInstall(recordType)) {
                        if ($(elementId).find("[data-channel]").length == 0) {
                            if (window.ActiveXObject || "ActiveXObject" in window) {
                                $(elementId).html('<object classid="CLSID:7F9063B6-E081-49DB-9FEC-D72422F2727F" codebase="webrec.cab"  width="' + width + '" height="' + height + '" data-type="dh" data-channel="' + data.channel + '" id="' + pluginVideoId + '"></object>');
                            } else {
                                $(elementId).html('<object type="application/media-plugin-version-3.1.0.2" width="' + width + '" height="' + height + '" data-type="dh" data-channel="' + data.channel + '" id="' + pluginVideoId + '"></object>');
                            }
                            var pluginObject = document.getElementById(pluginVideoId);

                            var ret = pluginObject.LoginDeviceEx(data.recordIP, data.recordPort, data.username || "admin", data.password || "admin123", data.protocol || 0);
                            pluginObject.ProtocolPluginWithWebCall('{"Protocol":"EnablePreviewDBClickFullSreen","Params":{"Enable":true}}');//双击放大
                            pluginObject.SetModuleMode(1);
                            pluginObject.ConnectRealVideo(data.channel - 1, 1);
                        } else {
                            var pluginObject = document.getElementById($(elementId).find("[data-channel]").attr("id"));
                            pluginObject.ConnectRealVideo(data.channel - 1, 1);
                        }

                    } else {
                        $(elementId).html('<div class="nop"  style="background-color: #000;position:relative;text-align:color: #FFF;min-height: 50px;center;width:' + width + 'px;height:' + height + 'px;line-height:' + height + 'px;" id="' + pluginVideoId + '"><a type="application/octet-stream" style="color:#FFF;position:absolute;" href="/webplugin.exe">请安装控件包</a></div>');
                    }
                    break;
                    case "rtsp":
                        var e=false;
                        for (var r = 0, s = navigator.mimeTypes.length; s > r; r++) {
                            if (navigator.mimeTypes[r].type.toLowerCase() == "application/x-vlc-plugin") {
                                e = true;
                            }
                        }
                        if(!e){
                            $(elementId).html('<div class="nop"  style="background-color: #000;position:relative;text-align:color: #FFF;min-height: 50px;center;width:' + width + 'px;height:' + height + 'px;line-height:' + height + 'px;" id="' + pluginVideoId + '"><a type="application/octet-stream" style="color:#FFF;position:absolute;" href="/vlc-3.0.11-win32.exe">请安装控件包</a></div>');
                            return;
                        }
                        var rtsp=data.rtsp||data.rtspUrl||data.rtspurl||"rtsp://"+data.username+":"+data.password+"@"+data.recordIP+":"+(data.iRtspPort||554)+"/ch1/main/av_stream";
                        //rtsp://admin:abcd1234@10.99.250.151:554/h264/ch1/main/av_stream
                        $(elementId).html('<object type="application/x-vlc-plugin" id="vlc" events="True" width="'+width+'" height="'+height+'" pluginspage="http://www.videolan.org" codebase="npapi-vlc-2.0.6.tar.xz"><param name="mrl" value="'+rtsp+'" /><param name="autoplay" value="true" /><param name="ShowDisplay" value="false" /><param name="fullscreen" value="true" /> </object>');
                        break;
                case "hk"://海康
                       var iRet = WebVideoCtrl.I_CheckPluginInstall();
                       if(iRet==-1){
                           //没有安装控件
                           $(elementId).html('<div class="nop"  style="background-color: #000;position:relative;text-align:color: #FFF;min-height: 50px;center;width:' + width + 'px;height:' + height + 'px;line-height:' + height + 'px;" id="' + pluginVideoId + '"><a type="application/octet-stream" style="color:#FFF;position:absolute;" href="/WebComponentsKit.exe">请安装控件包</a></div>');
                            return;
                        }
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
                                $(elementId).html('<div id="divPlugin'+$(elementId).attr("id")+'"  class="plugin"></div>');
                                WebVideoCtrl.I_InsertOBJECTPlugin('divPlugin'+$(elementId).attr("id"));
                                console.log($(elementId).attr("id"));
                            }
                        });
                        var szDeviceIdentify = data.recordIP+"_"+data.recordPort;
                        var iRet = WebVideoCtrl.I_Login(data.recordIP, 1, data.recordPort, data.username||"admin", data.password ||"abcd1234",
                        {
                            success: function (xmlDoc) {
                                console.log(szDeviceIdentify + " 登录成功！");
                                var startRealPlay = function () {
                                    console.log("准备预览"+JSON.stringify({
                                        iRtspPort: data.iRtspPort||554,
                                        iStreamType: 1,
                                        iChannelID: 1,
                                        bZeroChannel: false}))
                                    WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                                        iRtspPort: data.iRtspPort||554,
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
                                            console.log(szDeviceIdentify + " "+szInfo + JSON.stringify(arguments));
                                        }
                                    });
        
                                };
                                startRealPlay();
                            }
                            ,
                            error: function (status, xmlDoc) {
                                console.log(szDeviceIdentify + " 登录失败！", status, xmlDoc);
                            }
                        });
                    break;
            }
        }, dis: function (elementId) {
            var id = $(elementId).find("object")[0];
            if ($(id).data("type") == "dh") {
                id.DisConnectRealVideo(parseInt($(id).data("channel")) - 1);
            }
        }
    }
};
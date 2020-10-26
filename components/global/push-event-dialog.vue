<!-- 事件推送对话框 -->
<template>
    <popup :width="$getPx(1272)" title="事件处理" :show-popup="!!event" @handleClose="event=null">
        <event-alarm v-if="event" :detail="event" @cancelPopup="event = null"></event-alarm>
    </popup>
</template>

<script>
    import EventAlarm from '../alarm/event-alarm';

    export default {
        components: {EventAlarm},
        services: [ 'alarm' ],
        data () {
            return {
                event: null
            };
        },
        events: {
            'logout': 'disconnect',
            'login': 'connect'
        },
        mounted () {
            if (this.myUserInfo) {
                this.connect();
            }
        },
        methods: {
            disconnect () {
                console.log('---------退出登录，关闭ws连接---------');
                this.ws.close();
            },
            triggerVoice (eventContent) { // 语音播报
                this.$service.alarm.voiceAlarmTrigger(eventContent);
            },
            connect () {
                // let ws = new WebSocket(`ws://${top.window.location.host}/api/tunnel/webSocket/eventNotify/${this.myUserInfo.userId}`);
                let ws = new WebSocket(`ws://w8.qcxt.com:65036/api/tunnel/webSocket/eventNotify/${this.myUserInfo.userId}`);
                ws.onopen = e => {
                    console.log('---------ws已连接---------', e);
                };
                // 事件消息：isSoundRemind  是否语音提醒:0否,1是  eventContent 事件内容 tunnelId 隧道ID id  事件ID deviceId 设备ID
                ws.onmessage = msg => {
                    console.log('---------收到ws消息---------', msg.data);
                    if (msg.data === '欢迎加入连接！') return;
                    this.$em.$fire('onPushEvent');
                    if (this.event) {
                        return console.log('当前正在处理的事件，不再弹窗');
                    }
                    let eventMsg = JSON.parse(msg.data);
                    if (eventMsg && eventMsg.id && eventMsg.type === 'eventAccident') { // 事故的话要弹窗
                        if (eventMsg.isSoundRemind) {
                            this.triggerVoice(eventMsg.eventContent);
                        }
                        this.$service.alarm.queryAlarmDetail(eventMsg.id).then(res => {
                            this.$em.$fire('onShowEvent');
                            this.event = res;
                        });
                    }
                };
                ws.onerror = error => {
                    if (error) {
                        console.error('---------ws出现错误---------', error);
                    }
                };
                ws.onclose = e => {
                    console.error('---------ws断开连接---------', e);
                    this.connect();
                };
                this.ws = ws;
            }
        }
    };
</script>

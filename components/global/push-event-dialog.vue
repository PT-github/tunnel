<!-- 事件推送对话框 -->
<template>
  <popup :width="$getPx(1272)" title="事件处理" :show-popup="!!event" @handleClose="event=null">
    <event-alarm v-if="event" :detail="event" @cancelPopup="event = null"></event-alarm>
  </popup>
</template>

<script>
import EventAlarm from '../alarm/event-alarm';
import {SOCKET_SERVER} from "@/utils/constant";

export default {
  components: {EventAlarm},
  services: ['alarm'],
  data() {
    return {
      event: null,
      timer: null
    };
  },
  events: {
    'logout': 'disconnect',
    'login': 'connect'
  },
  mounted() {
    if (this.myUserInfo) {
      this.connect();
    }
  },
  methods: {
    disconnect() {
      console.log('---------退出登录，关闭ws连接---------');
      // this.ws.close();
    },

    triggerVoice(eventContent) {
      // 语音播报
      this.$service.alarm.voiceAlarmTrigger(eventContent);
    },
    connect() {
      let ws = new WebSocket(`ws://${SOCKET_SERVER}/tunnel/webSocket/eventNotify/${this.myUserInfo.userId}`);

      this.ws = ws;
      window._ws = ws

      ws.onopen = e => {
        console.log(`---------ws connect ${new Date()} ---------`, e)
      };


      ws.onerror = error => {
        // if (error) {
        console.error('---------ws出现错误---------', error);
        // }
      };

      ws.onclose = e => {
        console.error('---------ws断开连接---------', e);
      };

      //30秒钟后重新连接
      this.timer = setTimeout(() => {
        console.log(`重新连接 ${new Date()}`)
        this.ws = null;
        window._ws = null
        this.connect();
        clearTimeout(this.timer);
      }, 1000 * 30);

      console.log('连接时间', new Date())


      // 事件消息：isSoundRemind  是否语音提醒:0否,1是  eventContent 事件内容 tunnelId 隧道ID id  事件ID deviceId 设备ID
      ws.onmessage = msg => {
        if (msg.data === '欢迎加入连接！') return;
        this.$em.$fire('onPushEvent');
        if (this.event) {
          return console.log('当前正在处理的事件，不再弹窗');
        }

        try {
          let data = JSON.parse(msg.data);
          console.log(`---------收到ws消息 ${new Date()}---------`);
          console.log(data)

          if (data && data.id && data.type === 'eventAccident') { // 事故的话要弹窗
            if (data.isSoundRemind) {
              this.triggerVoice(data.eventContent);
            }
            this.$service.alarm.queryAlarmDetail(data.id).then(res => {
              this.$em.$fire('onShowEvent');
              this.event = res;
            });
          }

          if (data && data.tunnelId && data.type === 'deviceStatusChange') { // 设备状态更新，刷新隧道图
            //console.log('deviceStatusChange')
            this.$em.$fire('onDeviceStatusChange', data.tunnelId);
          }
        } catch (e) {

        }

      };


      // console.log(setInterval(() => {
      // console.log('连接时间', new Date())
      // }), 1000)
    }
  }
};
</script>

<template>
  <div>
    <el-button @click="connect">连接socket</el-button>
    <el-button @click="sendMessage">发送消息</el-button>
    <el-button @click="disconnect">断开链接socket</el-button>
    <div>
      <el-input type="textarea" :value="message" :autosize="{minRows: 10}"></el-input>
    </div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import RequestUtil from "../utils/RequestUtil";

export default {
  data() {
    return {
      message: undefined,
      websocket: undefined
    }
  },
  methods: {
    connect() {
      const websocket = new SockJS("http://192.168.0.102:18080/oflywork/ws")
      this.websocket = websocket
      const stompClient = Stomp.over(websocket);
      stompClient.debug = null //关闭控制台打印
      stompClient.heartbeat.outgoing = 20000;
      stompClient.heartbeat.incoming = 0;//客户端不从服务端接收心跳包
      stompClient.connect(
        {name: 'logan'},
        frame => {
          console.log('连接成功')
           stompClient.subscribe('/zentao/analysis', function (response) {
                debugger
            })
        },
        error => {
          console.error('连接失败， 重新尝试')
          setTimeout(()=>{
            this.connect()
          }, 1000)
        }
      )

      this.stompClient = stompClient
    },
    disconnect() {
      this.stompClient && this.stompClient.disconnect();
    },
    sendMessage() {
      return RequestUtil.get('/oflywork/cmz/ws/test')
    }
  }
}
</script>
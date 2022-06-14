import SockJS from "sockjs-client";
import Stomp from "stompjs";

class WebSocketUtil {
  url= process.env.NODE_ENV !== "production"?
    "http://127.0.0.1:18080/oflywork/ws":
    "http://127.0.0.1:12345/oflywork/ws";
  websocket = null;
  stompClient = null;
  isConnect = false;
  connect() {
    const websocket = new SockJS(this.url);
    this.websocket = websocket;
    const stompClient = Stomp.over(websocket);
    stompClient.debug = null //关闭控制台打印
    stompClient.heartbeat.outgoing = 20000;
    stompClient.heartbeat.incoming = 0;//客户端不从服务端接收心跳包
    stompClient.connect(
      {},
      frame => {
        console.log('连接成功')
        //  stompClient.subscribe('/zentao/analysis', function (response) {
        //       debugger
        //   })
        this.isConnect = true;
      },
      error => {
        this.isConnect = false;
        console.error(`连接失败， 重新尝试: ${this.url}`)
        setTimeout(()=>{
          this.connect()
        }, 1000)
      }
    )
    this.stompClient = stompClient;
  }
  subscribe() {
    if(this.isConnect) {
      this.stompClient.subscribe(...arguments)
    } else {
      console.error('还未连接websocket')
    }
  }
  disconnect() {
    this.stompClient && this.stompClient.disconnect();
  }

}
export default new WebSocketUtil()
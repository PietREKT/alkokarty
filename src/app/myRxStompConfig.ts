import {RxStompConfig} from "@stomp/rx-stomp";

export const myRxStompConfig : RxStompConfig = {
  brokerURL: 'wss://2a76-2a02-a315-41d3-4800-3477-eafa-672b-6b27.ngrok-free.app/ws',

  connectHeaders: {},

  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,

  reconnectDelay: 3000,

  debug: (msg : string) : void => {
    // console.log(new Date(), msg);
  }
}

import {RxStomp} from "@stomp/rx-stomp";
import {RxStompService} from "./rx-stomp.service";
import {myRxStompConfig} from "./myRxStompConfig";

export function RxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}

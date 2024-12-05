import {Injectable} from '@angular/core';
import {RxStomp} from "@stomp/rx-stomp";
import {catchError, concatMap, delay, firstValueFrom, map, Observable, of, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RxStompService extends RxStomp {
  constructor() {

    super();
  }
}

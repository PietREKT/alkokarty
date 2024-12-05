import { Injectable } from '@angular/core';
import {Room} from "./room";

@Injectable({
  providedIn: 'root'
})
export class TransferRoomDataService {
  public room : Room | null = null;
  constructor() { }
}

import { Routes } from '@angular/router';
import {CreatePlayerComponent} from "./create-player/create-player.component";
import {PlayerGuard} from "./PlayerGuard";
import {RoomChoiceComponent} from "./room-choice/room-choice.component";
import {CreateRoomComponent} from "./create-room/create-room.component";
import {JoinRoomComponent} from "./join-room/join-room.component";
import {RoomViewComponent} from "./room-view/room-view.component";

export const routes: Routes = [
  {path: '', component: CreatePlayerComponent},
  {path: 'roomChoice', component: RoomChoiceComponent, canActivate: [PlayerGuard]},
  {path: 'join', component: JoinRoomComponent, canActivate: [PlayerGuard]},
  {path: 'create', component: CreateRoomComponent, canActivate: [PlayerGuard]},
  {path: 'room/:code', component: RoomViewComponent, canActivate: [PlayerGuard]}
];

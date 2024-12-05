import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RxStompService} from "../rx-stomp.service";
import {TransferRoomDataService} from "../transfer-room-data.service";
import {Router} from "@angular/router";
import {routes} from "../app.routes";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css'
})
export class JoinRoomComponent implements OnDestroy{
  playerToken: string | null = null;
  subscriptions: Subscription[] = [];
  joinForm = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    password: new FormControl('')
  })


  constructor(private rxStomp: RxStompService, private dataTransfer: TransferRoomDataService, private router: Router) {
  }

  onSubmit() {
    this.playerToken = sessionStorage.getItem("cardsToken");
    let data = {
      roomCode: this.joinForm.controls.code.value,
      password: this.joinForm.controls.password.value,
      playerToken: this.playerToken
    }

    this.subscriptions.push(this.rxStomp.watch('/user/queue/reply/join').subscribe(msg => {
        let room = JSON.parse(msg.body);
        this.dataTransfer.room = room;
        this.router.navigate(['/room/' + room.code])
        this.unsubscribe();
      })
    )

    this.subscriptions.push(this.rxStomp.watch('/user/queue/error').subscribe(msg => {
      console.log(msg.body);
    }))

    this.rxStomp.publish({destination: '/app/rooms/join/' + data.roomCode, body: JSON.stringify(data)});
  }

  ngOnDestroy(): void {
      this.unsubscribe();
  }

  unsubscribe(){
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}

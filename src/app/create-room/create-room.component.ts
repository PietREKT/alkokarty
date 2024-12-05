import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {CreateRoomDto} from "../create-room-dto";
import {RxStompService} from "../rx-stomp.service";
import {Router} from "@angular/router";
import {Room} from "../room";
import {TransferRoomDataService} from "../transfer-room-data.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './create-room.component.html',
  styleUrls: [
    '../../styles.css',
    './create-room.component.css'
  ],
})
export class CreateRoomComponent implements OnInit, OnDestroy {

  showError : boolean = false;

  constructor(private rxStomp: RxStompService, private router: Router, private roomService: TransferRoomDataService) {
  }

  isChecked = false;
  submitPressed = false;
  subscriptions: Subscription[] = [];
  playerToken = window.sessionStorage.getItem("cardsToken") as string;
  createRoomForm = new FormGroup({
    password: new FormControl(''),
    maxPlayers: new FormControl('', [
      Validators.min(2),
      Validators.required
    ]),
    isChecked: new FormControl('')
  })


  onSubmit() {
    const roomData = new CreateRoomDto(
      +this.createRoomForm.controls.maxPlayers.value!,
      this.playerToken,
      this.createRoomForm.controls.password.value
    );
    this.submitPressed = true
    if (!this.createRoomForm.invalid) {
      this.rxStomp.publish({destination: '/app/rooms/create', body: JSON.stringify(roomData)});
    } else {
      this.showError = true;
    }

  }

  checkBoxChange(event: any) {
    this.isChecked = event.target.checked;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.rxStomp.watch('/user/queue/reply').subscribe({
        next: msg => {
          if (!msg.body.startsWith("Valid: ") && !msg.body.startsWith("Token: ")) {
            let room: Room = JSON.parse(msg.body);
            console.log(room);
            // this.roomService.room = room;
            this.router.navigate(['room/' + room.code])
            this.unsubscribe();
          }
        }
      })
    )
    this.subscriptions.push(this.rxStomp.watch('/user/queue/error').subscribe(msg => {
      console.log(msg.body);
    }))
  }

  unsubscribe() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}

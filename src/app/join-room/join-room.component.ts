import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RxStompService} from "../rx-stomp.service";
import {TransferRoomDataService} from "../transfer-room-data.service";
import {Router} from "@angular/router";
import {routes} from "../app.routes";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
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

  showError = false;
  error = "";


  constructor(private rxStomp: RxStompService, private dataTransfer: TransferRoomDataService, private router: Router) {
  }

  onSubmit() {
    this.playerToken = sessionStorage.getItem("cardsToken");

    if(this.checkErrors()) {
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
        this.showError = true;
        this.error = "";
      }))

      this.rxStomp.publish({destination: '/app/rooms/join/' + data.roomCode, body: JSON.stringify(data)});
    }
  }

  private checkErrors(){
    const codeControl = this.joinForm.controls.code;
      if (codeControl.errors){
        if (codeControl.errors['required']){
              this.error = "Musisz podać kod pokoju";
          } else if(codeControl.errors['minlength']){
              this.error = "Kod pokoju powinien mieć co najmniej 5 znaków";
          }
          this.showError = true;
          return false;
      }
      return true;
  }

  ngOnDestroy(): void {
      this.unsubscribe();
  }

  onInputClick(){
    this.showError = false;
  }

  unsubscribe(){
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}

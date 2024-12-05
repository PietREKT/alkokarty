import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Room} from "../room";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Subscription} from "rxjs";
import {TransferRoomDataService} from "../transfer-room-data.service";
import {routes} from "../app.routes";
import {NgForOf, NgIf} from "@angular/common";
import {RxStompService} from "../rx-stomp.service";
import {HttpClient, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-room-view',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './room-view.component.html',
  styleUrl: './room-view.component.css'
})
export class RoomViewComponent implements OnInit, OnDestroy {
  room: Room | null = null;
  playerToken: string | null = null;
  card: string | null = null;
  subscriptions : Subscription[] = [];
  showHowManyVoted : boolean = false;
  showError: boolean = false;
  error : any = '';


  constructor(private roomService: TransferRoomDataService, private rxStomp: RxStompService,
              private cd: ChangeDetectorRef, private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.playerToken = sessionStorage.getItem("cardsToken");
    if (this.room === null) {
      this.http.get<Room>('http://localhost:8080/room/getRoom',
        {params: new HttpParams().append('playerToken', this.playerToken!), observe: 'response'})
        .subscribe({next: res => {
            console.log(res.status)
            if (res.status == 200) {
              this.room = res.body;
              if (res.body?.playing){
                this.card = res.body.currentCard;
              }
              this.subscribeAndHandle();
            }
            if (res.status == 404) {
              this.router.navigate(['roomChoice']);
              this.leave();
            }
          }, error: err => {
            console.log(err);
            this.router.navigate(['roomChoice']);
            this.leave();
          }});
      this.http.post('http://localhost:8080/player/activate', this.playerToken).subscribe(res => {})
    } else {
      this.subscribeAndHandle();
    }
  }

  private updateRoom(room: any) {
    console.log('Updating room: ' + room);
    this.room = {...room};
    this.cd.markForCheck();
  }

  private subscribeAndHandle() {
    if (!this.room?.code) {
      console.log("RoomCode is null, can't subscribe!");
    } else {
      this.subscriptions.push(this.rxStomp.watch('/room/' + this.room?.code + "/card").subscribe(msg => {
        this.showError = false;
        let newRoom = JSON.parse(msg.body);
          this.updateRoom(newRoom);
          if (newRoom.currentCard === this.card){
            this.showHowManyVoted = true;
          } else {
            this.showHowManyVoted = false;
            this.card = this.room?.currentCard!;
          }
          this.cd.detectChanges();
        })
      );
      this.subscriptions.push(this.rxStomp.watch('/room/' + this.room?.code + "/join").subscribe(msg => {
          console.log("Player joined!!")
          this.updateRoom(JSON.parse(msg.body));
          console.log(this.room)
        })
      )
      this.subscriptions.push(this.rxStomp.watch('/room/' + this.room?.code + '/beginGame').subscribe(msg => {
        this.showError = false;
        console.log(msg.body)
          this.updateRoom(JSON.parse(msg.body));
        this.card = this.room?.currentCard!;
        })
      )
      this.subscriptions.push(this.rxStomp.watch('/user/queue/error').subscribe(msg => {
        this.error = msg.body;
        this.showError = true;
      }))
    }
  }


  beginGame() {
    this.rxStomp.publish({destination: '/app/room/' + this.room?.code + '/begin'})
  }

  voteForNextCard() {
    this.rxStomp.publish({destination: '/app/room/' + this.room?.code + '/next', body: this.playerToken!});
  }

  protected readonly JSON = JSON;

  leave() {
    if (this.subscriptions.length != 0) {
      for (let sub of this.subscriptions) {
        sub.unsubscribe();
      }
    }
    this.router.navigate(['roomChoice']);
  }

  ngOnDestroy(): void {
    this.leave();
  }
}

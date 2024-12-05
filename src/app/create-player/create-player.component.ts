import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RxStompService} from "../rx-stomp.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";
import {ToastModule} from 'primeng/toast';
import {MessageService} from "primeng/api";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {trigger, transition, style, animate} from '@angular/animations';


@Component({
  selector: 'app-create-player',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ToastModule,
  ],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(10px)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({opacity: 0, transform: 'translateY(10px)'}))
      ])
    ])
  ],
  templateUrl: './create-player.component.html',
})
export class CreatePlayerComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  showError: boolean = false;
  error = "";

  constructor(private rxStomp: RxStompService, private router: Router, private messageService: MessageService) {
  }

  createPlayerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ])
    }
  )

  ngOnInit() {
    this.subscriptions.push(this.rxStomp.watch('/user/queue/reply').subscribe((msg) => {
        if (msg.body.startsWith("Token: ")) {
          window.sessionStorage.setItem("cardsToken", msg.body.substring(7));
          this.unsubscribe();
          this.router.navigate(['roomChoice']);
        }
      })
    )
  }

  onSubmit() {
    let username = this.createPlayerForm.controls.name.value;
    if (this.checkErrors()) {
      this.rxStomp.publish({destination: '/app/users/addUser', body: username as string})
    }
  }

  private checkErrors() {
    const nameControl = this.createPlayerForm.controls.name;
    if (nameControl.errors) {
      if (nameControl.errors['required']) {
        this.showError = true;
        this.error = "Musisz podać swoją nazwę";
      }
      if (nameControl.errors['minlength']) {
        this.showError = true;
        this.error = "Twoja nazwa musi mieć co najmniej 2 znaki";
      }
      return false;
    }
    return true;
  }

  private showToast(severity: string, summary: string, detail: string) {
    console.log("Adding toast");
    this.messageService.add({severity, summary, detail})
  }

  private unsubscribe() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  onInputClick() {
    this.showError = false;
  }
}

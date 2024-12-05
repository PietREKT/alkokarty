import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-room-choice',
  standalone: true,
  imports: [],
  templateUrl: './room-choice.component.html',
  styleUrl: './room-choice.component.css'
})
export class RoomChoiceComponent {
  constructor(public router : Router) {
  }
}

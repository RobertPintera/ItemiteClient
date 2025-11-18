import { Component } from '@angular/core';
import {Chat} from '../chat/chat';

@Component({
  selector: 'app-test',
  imports: [
    Chat
  ],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {

}

import { Component } from '@angular/core';
import {Chat} from '../chat/chat';
import {ChatList} from '../chat/chat-list/chat-list';

@Component({
  selector: 'app-test',
  imports: [
    ChatList
  ],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {

}

import {AfterViewInit, Component, computed, inject, OnInit, signal} from '@angular/core';
import {Chat} from '../chat/chat/chat';
import {ChatList} from '../chat/chat-list/chat-list';
import {MessageService} from '../../../core/services/message-service/message.service';
import {ChatListResponseDTO} from '../../../core/models/chat/ChatListResponseDTO';
import {ChatInfoResponse} from '../../../core/models/chat/ChatInfoResponse';

@Component({
  selector: 'app-test',
  imports: [
    ChatList
  ],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test  {

}

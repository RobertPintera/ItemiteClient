import {Component, input, signal} from '@angular/core';
import {Chat} from '../chat';
import {ChatPreviewCard} from './chat-preview-card/chat-preview-card';
import {ChatListResponseDTO} from '../../../../core/models/chat/ChatListResponseDTO';

@Component({
  selector: 'app-chat-list',
  imports: [
    Chat,
    ChatPreviewCard
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
})
export class ChatList {
  _showMessagesOnly = signal(false);
  showMessagesOnly = this._showMessagesOnly.asReadonly();

  chatList = input<ChatListResponseDTO>();



  // region testing



  // endregion

  SwitchShowMessagesOnly() {
    this._showMessagesOnly.set(!this._showMessagesOnly());
  }
}

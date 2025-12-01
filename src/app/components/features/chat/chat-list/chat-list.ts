import {Component, computed, effect, input, signal} from '@angular/core';
import {Chat} from '../chat';
import {ChatPreviewCard} from './chat-preview-card/chat-preview-card';
import {ChatListResponseDTO} from '../../../../core/models/chat/ChatListResponseDTO';
import {ChatInfoResponse} from '../../../../core/models/chat/ChatInfoResponse';

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
  chatList = input<ChatInfoResponse[]>([]);

  private _showMessagesOnly = signal(false);
  showMessagesOnly = this._showMessagesOnly.asReadonly();

  private _selected = signal(-1);
  readonly selected = this._selected.asReadonly();
  readonly selectedMembers = computed(() => {
    if(this.chatList().length > 0 && this._selected() >= 0) {
      return this.chatList()[this._selected()].members;
    }
    return undefined;
  });
  readonly selectedListingId = computed(() => {
    if(this.chatList().length > 0 && this._selected() >= 0) {
      console.log(this.chatList()[this._selected()].listing.id);
      return this.chatList()[this._selected()].listing.id;
    }
    return undefined;
  });

  constructor() {
    effect(() => {
      this.chatList();
      this._selected.set(-1);
    });
  }

  OnCardClicked(index:number) {
    this._selected.set(index);
  }

}

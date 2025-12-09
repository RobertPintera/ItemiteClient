import {AfterViewInit, Component, computed, effect, inject, input, signal} from '@angular/core';
import {Chat} from '../chat/chat';
import {ChatPreviewCard} from './chat-preview-card/chat-preview-card';
import {ChatListResponseDTO} from '../../../../core/models/chat/ChatListResponseDTO';
import {ChatInfoResponse} from '../../../../core/models/chat/ChatInfoResponse';
import {MessageService} from '../../../../core/services/message-service/message.service';

@Component({
  selector: 'app-chat-list',
  imports: [
    Chat,
    ChatPreviewCard
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
})
export class ChatList implements AfterViewInit {
  readonly perspective = input.required<"Buyer" | "Seller">();

  chatList = signal<ChatInfoResponse[]>([]);
  private messageService = inject(MessageService);

  hasChats = computed(() => {
    return this.chatList().length != 0
  });

  async ngAfterViewInit() {
    this.messageService.GetAllChats(1, this.perspective()).subscribe(data => {
      this.chatList.set(data.items);
    })
  }

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

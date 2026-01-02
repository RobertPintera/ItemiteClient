import {AfterViewInit, Component, computed, effect, ElementRef, inject, input, signal, ViewChild} from '@angular/core';
import {Chat} from '../chat/chat';
import {ChatPreviewCard} from './chat-preview-card/chat-preview-card';
import {ChatListResponseDTO} from '../../../../core/models/chat/ChatListResponseDTO';
import {ChatInfoResponse} from '../../../../core/models/chat/ChatInfoResponse';
import {MessageService} from '../../../../core/services/message-service/message.service';
import {ErrorHandlerService} from '../../../../core/services/error-handler-service/error-handler-service';
import {LoadingCircle} from '../../../shared/loading-circle/loading-circle';
import {MessageResponse} from '../../../../core/models/chat/MessageResponse';
import {NotificationService} from '../../../../core/services/notification-service/notification.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-chat-list',
  imports: [
    Chat,
    ChatPreviewCard,
    LoadingCircle,
    TranslatePipe
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
})
export class ChatList implements AfterViewInit {
  readonly specificListingId = input<number>();
  readonly perspective = input.required<"Buyer" | "Seller">();

  private readonly PAGE_SIZE = 10;

  private _messageService = inject(MessageService);
  private _errorService = inject(ErrorHandlerService);
  private _notificationService = inject(NotificationService);

  private _chatList = signal<ChatInfoResponse[]>([]);
  readonly chatList = this._chatList.asReadonly();

  private _currentPage = signal(1);
  private _totalPages = signal(1);
  readonly hasManyPages = computed(() => this._totalPages() > 1);
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();

  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();

  private _showMessagesOnly = signal(false);
  showMessagesOnly = this._showMessagesOnly.asReadonly();

  private _selected = signal(-1);
  readonly selected = this._selected.asReadonly();
  readonly selectedMembers = computed(() => {
    if(this._chatList().length > 0 && this._selected() >= 0) {
      return this._chatList()[this._selected()].members;
    }
    return undefined;
  });
  readonly selectedListingId = computed(() => {
    if(this._chatList().length > 0 && this._selected() >= 0) {
      return this._chatList()[this._selected()].listing.id;
    }
    return undefined;
  });
  readonly listingBasicInfo = computed(() => {
    if(this._chatList().length > 0 && this._selected() >= 0) {
      return this._chatList()[this._selected()].listing;
    }
    return undefined;
  });


  constructor() {
    this._notificationService.onMessageReceived.subscribe((message: MessageResponse) => {
      this.UpdateLastMessage(message, "new");
    });

    this._notificationService.onMessageUpdated.subscribe((message: MessageResponse) => {
      this.UpdateLastMessage(message, "edition");
    });

    this._notificationService.onMessageDeleted.subscribe((messageId) => {
      this.UpdateLastMessageByDeletion(messageId);
    });
  }

  async ngAfterViewInit() {
    // wait for cookies to load
    await new Promise(resolve => setTimeout(resolve, 200));

    // this is used when seller wants to preview all chats with clients regarding specific product
    if(this.specificListingId()) {
      this.GetChatsByListing(1, 1);
      return;
    }

    this.GetChats(1, 1);
  }

  // previousPageVal parameter is to undo the effect of changing page
  //  - it should be undone when api call fails
  GetChatsByListing(pageNumber: number, previousPageVal: number) {
    this._loading.set(true);
    this._messageService.GetChatsByListing(this.specificListingId()!, pageNumber, this.PAGE_SIZE).subscribe({
      next: (data) => {
        this._chatList.set(data.items);
        this._loading.set(false);
      },
      error: (err) => {
        this._errorService.SendErrorMessage(err);
        this._currentPage.set(previousPageVal);
        this._loading.set(false);
      }
    })
  }

  // previousPageVal parameter is to undo the effect of changing page
  //  - it should be undone when api call fails
  GetChats(pageNumber: number, previousPageVal: number) {
    this._loading.set(true);
    this._messageService.GetAllChats(pageNumber, this.perspective(), this.PAGE_SIZE).subscribe({
      next: (data) => {
        this._chatList.set(data.items);
        this._loading.set(false);
      },
      error: (err) => {
        this._errorService.SendErrorMessage(err);
        this._currentPage.set(previousPageVal);
        this._loading.set(false);
      }
    })
  }

  ChangePageLeft() {
    const previousVal = this._currentPage();
    this._currentPage.set(
      this._currentPage() === 1 ? this._totalPages() : this.currentPage() - 1
    );

    if(this.specificListingId()) {
      this.GetChatsByListing(this.currentPage(), previousVal);
      return;
    }

    this.GetChats(this.currentPage(), previousVal);
  }

  ChangePageRight() {
    const previousVal = this._currentPage();
    this._currentPage.set(
      this._currentPage() === this._totalPages() ? 1 : this.currentPage() + 1
    );

    if(this.specificListingId()) {
      this.GetChatsByListing(this.currentPage(), previousVal);
      return;
    }

    this.GetChats(this.currentPage(), previousVal);
  }

  hasChats = computed(() => {
    return this._chatList().length !== 0
  });

  OnCardClicked(index:number) {
    this._selected.set(index);
  }

  ClearNewMessages(index: number) {
    this._chatList.update(chats => {
      const newChats = [...chats];
      newChats[index].unreadMessagesCount = 0;
      return newChats;
    });
  }

  UpdateLastMessageByDeletion(messageId: number) {
    const index = this._chatList().findIndex(chat => chat.lastMessage.messageId === messageId);
    if (index < 0) return;

    const foundChatInfo = this.chatList()[index];

    foundChatInfo.lastMessage.content = "User deleted the message";

    this._chatList.update(chats => {
      const newChats = [...chats];
      newChats[index] = foundChatInfo;
      return newChats;
    });
  }

  UpdateLastMessage(message: MessageResponse, reason: "new" | "edition") {
    const index = this._chatList().findIndex(chat => chat.listing.id === message.listingId);
    if (index < 0) return;

    // don't update last message after edition if the id of message is different
    if(reason === "edition" && this._chatList()[index].lastMessage.messageId !== message.messageId) return;

    const foundChatInfo = this.chatList()[index];
    const sender = foundChatInfo.members.find((member) =>
      member.id === message.senderId
    );
    if(!sender) return;

    foundChatInfo.lastMessage = {
      messageId: message.messageId,
      userName: sender.userName,
      dateSent: message.dateSent,
      content: message.content ?? "Sent images"
    };

    // update unread messages count only if selected listing is NOT currently viewed
    if(reason === "new" && this.selectedListingId() !== message.listingId) {
      foundChatInfo.unreadMessagesCount += 1;
    }

    this._chatList.update(chats => {
      const newChats = [...chats];
      newChats[index] = foundChatInfo;
      return newChats;
    });

  }

  OnChatLoaded(chatComp: any) {
    this.ClearNewMessages(this.selected());
    this.ScrollToChat(chatComp);
  }

  @ViewChild('scrollContainer', { read: ElementRef })
  scrollContainer!: ElementRef<HTMLDivElement>;

  ScrollToChat(chatComp: any) {

    const chatElement = chatComp.chatWrapper.nativeElement;

    this.scrollContainer.nativeElement.scrollTo({
      left: chatElement.offsetLeft,
      behavior: 'smooth',
    });

  }
}

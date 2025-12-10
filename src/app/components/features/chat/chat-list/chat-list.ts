import {AfterViewInit, Component, computed, effect, inject, input, signal} from '@angular/core';
import {Chat} from '../chat/chat';
import {ChatPreviewCard} from './chat-preview-card/chat-preview-card';
import {ChatListResponseDTO} from '../../../../core/models/chat/ChatListResponseDTO';
import {ChatInfoResponse} from '../../../../core/models/chat/ChatInfoResponse';
import {MessageService} from '../../../../core/services/message-service/message.service';
import {ErrorHandlerService} from '../../../../core/services/error-handler-service/error-handler-service';
import {LoadingCircle} from '../../../shared/loading-circle/loading-circle';

@Component({
  selector: 'app-chat-list',
  imports: [
    Chat,
    ChatPreviewCard,
    LoadingCircle
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

  private _chatList = signal<ChatInfoResponse[]>([]);
  readonly chatList = this._chatList.asReadonly();

  private _currentPage = signal(1);
  private _totalPages = signal(1);
  readonly hasManyPages = computed(() => this._totalPages() > 1);
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();

  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();

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

  async ngAfterViewInit() {
    // wait for cookies to load
    await new Promise(resolve => setTimeout(resolve, 1000));

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

  constructor() {
    effect(() => {
      this._chatList();
      this._selected.set(-1);
    });
  }

  OnCardClicked(index:number) {
    this._selected.set(index);
  }

}

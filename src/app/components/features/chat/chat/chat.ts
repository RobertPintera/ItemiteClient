import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  computed, effect,
  ElementRef,
  HostListener,
  inject,
  input, OnInit, output, PLATFORM_ID,
  signal,
  Signal, ViewChild, WritableSignal
} from '@angular/core';
import {MessageResponse} from '../../../../core/models/chat/MessageResponse';
import {PhotoResponseDTO} from '../../../../core/models/graphics/PhotoResponseDTO';
import {Message} from './message/message';
import {AuthService} from '../../../../core/services/auth-service/auth.service';
import {ChatMemberInfo} from '../../../../core/models/chat/ChatMemberInfo';
import {FileUpload} from "../../../shared/file-upload/file-upload";
import {LoadingCircle} from '../../../shared/loading-circle/loading-circle';
import {ConfirmDialog} from '../../../shared/confirm-dialog/confirm-dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {ImagePreview} from '../../../shared/image-preview/image-preview';
import {AttachedFiles} from '../attached-files/attached-files';
import {MessageService} from '../../../../core/services/message-service/message.service';
import {ErrorHandlerService} from '../../../../core/services/error-handler-service/error-handler-service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotificationService} from '../../../../core/services/notification-service/notification.service';
import {UserService} from '../../../../core/services/user-service/user.service';
import {ListingBasicInfo} from '../../../../core/models/product-listings/ListingBasicInfo';
import {ProductListingService} from '../../../../core/services/product-listing-service/product-listing.service';
import {isPlatformServer} from '@angular/common';
import {IndividualPricingDialog} from '../../product-details/individual-pricing-dialog/individual-pricing-dialog';
import {OtherUserSettings} from '../../other-user-settings/other-user-settings';
import {
  DeleteIndividualPricingDialog
} from '../../product-details/delete-individual-pricing-dialog/delete-individual-pricing-dialog';

@Component({
  selector: 'app-chat',
  imports: [
    Message,
    FileUpload,
    LoadingCircle,
    ConfirmDialog,
    TranslatePipe,
    ImagePreview,
    AttachedFiles,
    FormsModule,
    ReactiveFormsModule,
    IndividualPricingDialog,
    OtherUserSettings,
    DeleteIndividualPricingDialog
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements AfterViewInit, OnInit {
  private userService: UserService = inject(UserService);
  private messageService: MessageService = inject(MessageService);
  private errorService: ErrorHandlerService = inject(ErrorHandlerService);
  private notificationService: NotificationService = inject(NotificationService);
  private productListingService = inject(ProductListingService);

  private readonly LIMIT = 20;

  readonly currentUserId = computed(() => this.userService.userBasicInfo().id);

  // This needs to be filled in parent component - s
  readonly chatMembers = input.required<ChatMemberInfo[]>();
  readonly listingId = input.required<number>();
  readonly inputListing = input<ListingBasicInfo>();
  private _fetchedListing = signal<ListingBasicInfo|undefined>(undefined);
  readonly listing = computed(() =>
    this.inputListing() === undefined ? this._fetchedListing() : this.inputListing()
  );

  updateLastMessageByDeletion = output<number>();
  updateLastMessageBySending = output<MessageResponse>();
  updateLastMessageByEdition = output<MessageResponse>();
  onListingLoaded = output<number>();

  readonly currentUsername = computed(() => this.userMemberInfo().userName);
  readonly currentProfileImg = computed(() => this.userMemberInfo().photoUrl ??
    "../../../../assets/images/default_profile_pic.png");
  readonly userMemberInfo: Signal<ChatMemberInfo> = computed(() =>
    this.chatMembers().find((member) => member.id === this.currentUserId())!
  );

  readonly otherMemberInfo: Signal<ChatMemberInfo> = computed(() =>
    this.chatMembers().find((member) => member.id !== this.currentUserId())!
  );

  readonly otherUsername = computed(() => this.otherMemberInfo().userName);
  readonly otherProfileImg = computed(() => this.otherMemberInfo().photoUrl ??
    "../../../../assets/images/default_profile_pic.png");

  private _messages = signal<MessageResponse[]>([]);
  readonly messages:Signal<MessageResponse[]> = this._messages.asReadonly();
  private _cursor : string | undefined;
  private _hasMore = signal<boolean>(false);
  readonly hasMore = this._hasMore.asReadonly();

  private _showFileInputDialog = signal(false);
  readonly showFileInputDialog = this._showFileInputDialog.asReadonly();
  private _showDeletionDialog = signal(false);
  readonly showDeletionDialog = this._showDeletionDialog.asReadonly();
  private _editingMessage = signal(false);
  readonly editingMessage = this._editingMessage.asReadonly();
  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();
  private _imagePreview: WritableSignal<undefined | string> =  signal(undefined);
  readonly imagePreview = this._imagePreview.asReadonly();
  readonly previewImage = computed(() => !!this._imagePreview());
  private _showCustomPriceDialog = signal(false);
  readonly showCustomPriceDialog = this._showCustomPriceDialog.asReadonly();
  private _showDeletePriceDialog = signal(false);
  readonly showDeletePriceDialog = this._showDeletePriceDialog.asReadonly();
  private _showUserSettingDialog = signal(false);
  readonly showUserSettingDialog = this._showUserSettingDialog.asReadonly();

  private _messageInput = signal("");
  readonly messageInput = this._messageInput.asReadonly();

  private _attachments = signal<File[]>([]);
  readonly attachments = this._attachments.asReadonly();
  private _hasAttachments = signal(false);
  readonly hasAttachments = this._hasAttachments.asReadonly();
  private _showAttachments = signal(false);
  readonly showAttachments = this._showAttachments.asReadonly();

  private _resultCode = signal<number>(-1);
  readonly resultCode = this._resultCode.asReadonly();
  readonly success = computed(()=> this._resultCode() === 200);
  private _awaitingUpdate = signal<number>(-1);
  readonly awaitingUpdate = this._awaitingUpdate.asReadonly();

  readonly isUserClickable = computed(() =>
    this.listing() !== undefined &&
    this.listing()?.ownerId === this.currentUserId()
  );

  // stores id of currently edited
  private _selectedEditMessage: number = -1;

  // stores id of message to delete
  private _selectedDeleteMessage: number = -1;

  form: FormGroup;

  constructor() {
    this.notificationService.onMessageReceived.subscribe((message: MessageResponse) => {
      if(message.listingId !== this.listingId()) return;
      this._messages.update(messages => [...messages, message]);
    });

    this.notificationService.onMessageDeleted.subscribe((messageId) => {
      this.LocalDelete(messageId);
    });

    this.notificationService.onMessageUpdated.subscribe((message) => {
      if(message.listingId !== this.listingId()) return;
      this.EditMessage(message);
    });

    effect(() => {
      if(this.listingId() === undefined
        || this.currentUserId() < 0
        || !this.otherMemberInfo()) return;
      this.LoadMessages(this.listingId(), this.LIMIT);
    });

    this.form = new FormGroup({
      messageInput: new FormControl('')
    });
  }

  private _platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // Fetch listing info if it wasn't passed manually via input
    if(this.inputListing() || isPlatformServer(this._platformId)) return;

    this.productListingService.loadProductListingPublic(
      this.listingId()
    ).subscribe({
      next: (result) => {
        this._fetchedListing.set(
          {
            id: result.id,
            name: result.name,
            mainImageUrl: result.mainImageUrl,
            isArchived: result.isArchived,
            ownerId: result.owner.id,
            listingType: "Product",
            price: result.price
          }
        );
      },
      error:(error) => {
        // listing might be auction, not product
        //  or other error might happen
        //  either way, it will work as intended
      }
    });
  }

  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('chatWrapper') chatWrapper: ElementRef | undefined;

  LoadMessages(listingId: number, limit: number, cursor: string | undefined = undefined) {

    const el = this.chatContainer?.nativeElement;
    const prevScrollHeight = el?.scrollHeight;

    this.messageService.GetChat(listingId, this.otherMemberInfo().id, limit, cursor).subscribe({
        next: chat => {
          this._messages.set([...chat.items, ...this._messages()]);
          this._resultCode.set(200);
          this._loading.set(false);
          this._cursor = chat.nextCursor;
          this._hasMore.set(chat.hasMore);
          this.onListingLoaded.emit(listingId);

          // this.adjustHeight();

          /*setTimeout(() => {
            const scrollContainer = this.scrollContainer.nativeElement as HTMLElement;
            scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
          }, 50);*/
        },
        error: error => {
          console.log(error);
          this._loading.set(false);
        }
      }
    );
  }

  OnLoadMessagesClicked() {
    this.LoadMessages(this.listingId(), this.LIMIT, this._cursor);
  }

  // region Submit
  OnSubmit() {
    const input = this.form.value.messageInput.trim();

    if(this.editingMessage()) {
      this.OnEditMessageSubmit(input);
      return;
    }

    // user didn't pass any input
    if(input === "" && this.attachments().length === 0 ) return;
    this.LoadTextIntoInput("");

    const attachments = this.attachments();
    this.ClearAttachments();

    this.messageService.SendMessage(
      this.otherMemberInfo().id,
      this.listingId(),
      input === "" ? undefined : input,
      attachments.length === 0 ? undefined : attachments
    ).subscribe({
      next: message => {
        this._messages.update(messages => [...messages, message.message]);
        this.updateLastMessageBySending.emit(message.message);
      },
      error: error => {
        this.errorService.SendErrorMessage(error);
      }
    });
  }
  // endregion

  // region Message Input

  private LoadTextIntoInput(text: string) {
    this._messageInput.set(text);
    if(text === "") {
      this.form.get("messageInput")?.setValue("");
      setTimeout(() => {
        const el = document.getElementById("messageInput") as HTMLTextAreaElement;
        if (el) {
          el.selectionStart = el.selectionEnd = 0;
        }
      });
    }
    this.AdjustHeight();
  }

  OnAttachmentIconClicked() {
    if(this.hasAttachments()) {
      this._showAttachments.set(!this._showAttachments());
      return;
    }
    this.SwitchShowFileInputDialog();
  }

  SwitchShowFileInputDialog() {
    if(this.showDeletionDialog()) {
      this._showFileInputDialog.set(false);
    }
    this._showFileInputDialog.set(!this._showFileInputDialog());
  }
  // endregion

  // region Message edition
  OnEditionRequested(messageId: number) {
    if(this._selectedEditMessage === messageId) {
      this.OnEditionClosed();
      return;
    }
    this._editingMessage.set(true);
    this._hideInput.set(false);
    this._selectedEditMessage = messageId;
    this._showAttachments.set(false);

    const m = this.messages().find(message => message.messageId === messageId);
    if(m) {
      this.LoadTextIntoInput(
        m.content ?? ""
      );
    }
  }

  OnEditionClosed() {
    this.LoadTextIntoInput("");
    this._editingMessage.set(false);
    this._selectedEditMessage = -1;
  }

  private EditMessage(message: MessageResponse) {
    const index = this.messages().findIndex(messageResponse =>
      message.messageId === messageResponse.messageId
    );

    if (index === -1) return;

    this._messages.update(messages => {
      const newMessages = [...messages];
      newMessages[index] = message;
      return newMessages;
    });
  }

  OnEditMessageSubmit(input: string) {
    // ! editing message only allows editing text
    const message = this._messages().find(message => message.messageId === this._selectedEditMessage)
    if(!message) return;

    if(input === "" && message.photos.length === 0) return;

    this.LoadTextIntoInput("");

    // don't call api if nothing changed
    if(message.content === input) return;
    this.ClearAttachments();

    const content = input;

    this._awaitingUpdate.set(message.messageId);
    this.messageService.EditMessage(this._selectedEditMessage, input).subscribe({
      next: message => {
        this._editingMessage.set(false);
        this.EditMessage(message);
        this.updateLastMessageByEdition.emit(message);
        this._selectedEditMessage = -1;
        this._awaitingUpdate.set(-1);
      },
      error: error => {
        this.LoadTextIntoInput(content);
        this.errorService.SendErrorMessage(error);
        this._awaitingUpdate.set(-1);
      }
    });
  }
  // endregion

  // region Message deletion
  OnDeletionRequested(messageId: number) {
    this._selectedDeleteMessage = messageId;
    this._showFileInputDialog.set(false);
    this._showDeletionDialog.set(true);
  }

  async OnDeletionConfirmed() {
    await this.DeleteMessage();
    this.OnDeletionClosed();
  }

  OnDeletionClosed() {
    this._showDeletionDialog.set(false);
    this._selectedDeleteMessage = -1;
  }

  IsOwnMessage(senderId: number) {
    return this.currentUserId() === senderId;
  }

  async DeleteMessage() {
    if(this._selectedDeleteMessage === -1) return;
    this._awaitingUpdate.set(this._selectedDeleteMessage);
    const success = await this.messageService.DeleteMessage(this._selectedDeleteMessage);
    this._awaitingUpdate.set(-1);
    if(!success) return;

    this.LocalDelete(this._selectedDeleteMessage);
    this.updateLastMessageByDeletion.emit(this._selectedDeleteMessage);

    this._selectedDeleteMessage = -1;
  }

  private LocalDelete(messageId:number) {
    const index = this.messages().findIndex(message => message.messageId === messageId);
    if (index === -1) return;

    this._messages.update(messages => {
      const newMessages = [...messages];
      newMessages[index].photos = [];
      newMessages[index].isDeleted = true;
      return newMessages;
    });
  }

  // endregion

  // region Attachments
  OnAttachmentAdded(file: File) {
    this._attachments.update((attachments) => {
      attachments.push(file); return attachments;
    });
    this._hasAttachments.set(this.attachments().length !== 0);
    this._showFileInputDialog.set(false);
  }

  OnAttachmentDeleted(index: number) {
    this._attachments.update(attachments => {
        attachments.splice(index, 1);
        return attachments;
      }
    );
    this._hasAttachments.set(this.attachments().length !== 0);
  }

  ClearAttachments() {
    this._attachments.set([]);
    this._hasAttachments.set(false);
  }
  // endregion

  // region Image Preview
  OnPreviewClicked(url: string) {
    if(this.editingMessage()) return;
    this._imagePreview.set(url);
  }

  OnPreviewClosed() {
    this._imagePreview.set(undefined);
  }
  // endregion

  // region Messages scroll

  private _lastScrollPos: number = 0;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  OnMessagesScroll(event:any) {
    const scrollContainer = event.srcElement as HTMLElement;


/*    this._hideInput.set(
      scrollContainer.scrollTop < this._lastScrollPos
      // The following line will show message input only when scroll is at the end
      // scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight > 30
    )
    this._lastScrollPos = scrollContainer.scrollTop;*/
  }
  // endregion

  SwitchCustomPriceDialog(show: boolean) {
    this._showCustomPriceDialog.set(show);
    this._showDeletePriceDialog.set(false);
    this._showUserSettingDialog.set(false);
  }
  SwitchDeletePriceDialog(show: boolean) {
    this._showDeletePriceDialog.set(show);
    this._showCustomPriceDialog.set(false);
    this._showUserSettingDialog.set(false);
  }
  SwitchUserSettingsDialog() {
    this._showUserSettingDialog.set(!this._showUserSettingDialog());
  }

  // region Message input formatting
  private _hideInput = signal(false);
  readonly hideInput = this._hideInput.asReadonly();

  private maxHeight = 0;
  private el: ElementRef<HTMLTextAreaElement> = inject(ElementRef<HTMLTextAreaElement>);
  private _parent : Element | null = null

  ngAfterViewInit(): void {
    this._parent = this.el.nativeElement.querySelector('#message_window');
    if (this._parent) {
      this.maxHeight = this._parent.clientHeight * 0.33; // 50% max height
      this.el.nativeElement.style.maxHeight = `${this.maxHeight}px`;

    }
    this._loading.set(true);
  }

  @HostListener('input')
  onInput() {
    this.AdjustHeight();
  }

  private AdjustHeight() {
    if(!this._parent) return;

    this.maxHeight = this._parent.clientHeight * 0.33; // 50% max height
    const textarea = this.el.nativeElement.querySelector('textarea')!;

    textarea.style.height = 'auto'; // reset height for accurate measurement
    const newHeight = textarea.scrollHeight;

    if (newHeight <= this.maxHeight) {
      textarea.style.overflow = 'hidden';
      textarea.style.height = `${newHeight}px`;
    } else {
      textarea.style.overflow = 'auto'; // allow scroll once max reached
      textarea.style.height = `${this.maxHeight}px`;
    }
  }
  // endregion
}

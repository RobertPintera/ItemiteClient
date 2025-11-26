import {
  AfterViewInit,
  Component,
  computed, effect,
  ElementRef,
  HostListener,
  inject, Input,
  input,
  signal,
  Signal, ViewChild, WritableSignal
} from '@angular/core';
import {MessageResponse} from '../../../core/models/chat/MessageResponse';
import {PhotoResponseDTO} from '../../../core/models/PhotoResponseDTO';
import {Message} from './message/message';
import {UserService} from '../../../core/services/user-service/user.service';
import {ChatMemberInfo} from '../../../core/models/chat/ChatMemberInfo';
import {sign} from "node:crypto";
import {FileUpload} from "../../shared/file-upload/file-upload";
import {LoadingCircle} from '../../shared/loading-circle/loading-circle';
import {ConfirmDialog} from '../../shared/confirm-dialog/confirm-dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {ImagePreview} from '../../shared/image-preview/image-preview';
import {AttachedFiles} from './attached-files/attached-files';

@Component({
  selector: 'app-chat',
  imports: [
    Message,
    FileUpload,
    LoadingCircle,
    ConfirmDialog,
    TranslatePipe,
    ImagePreview,
    AttachedFiles
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements AfterViewInit {
  // todo grab current and other user data from the service (Chat Member Info)
  //  name, profile photo, profile pic
  //  - ?use the | async pipe?
  userService: UserService = inject(UserService);

  //////////////////////////////////////////
  // TESTING DELETE AFTER API INTEGRATION //
  //////////////////////////////////////////
  // region Testing
  testP1Vertical: PhotoResponseDTO = {
    photoId: 0,
    url: 'https://images.pexels.com/photos/1082663/pexels-photo-1082663.jpeg'
  };
  testP2Horizontal: PhotoResponseDTO = {
    photoId: 1,
    url: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg'
  };
  testP3SquareLowRes: PhotoResponseDTO = {
    photoId: 2,
    url: 'https://opengameart.org/sites/default/files/styles/medium/public/dirt_13.png'
  }
  testP4Vertical: PhotoResponseDTO = {
    photoId: 3,
    url: 'https://images.pexels.com/photos/1082663/pexels-photo-1082663.jpeg'
  };

  testM1: MessageResponse = {
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    dateModified: undefined,
    dateRead: undefined,
    dateSent: '12:30 21.02.2024',
    listingId: 0,
    messageId: 1,
    photos: [],
    recipientId: 2,
    senderId: 1
  };
  testM2: MessageResponse = {
    content: "Short text",
    dateModified: "now",
    dateRead: "12.31 21.02.2024",
    dateSent: '12:30 21.02.2024',
    listingId: 0,
    messageId: 2,
    photos: [],
    recipientId: 2,
    senderId: 1
  };
  testM3: MessageResponse = {
    content: undefined,
    dateModified: "23:30 21.02.2025",
    dateRead: "12.31 21.02.2024",
    dateSent: '12:30 21.02.2024',
    listingId: 0,
    messageId: 3,
    photos: [this.testP1Vertical, this.testP4Vertical],
    recipientId: 2,
    senderId: 2
  };
  testM4: MessageResponse = {
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    dateModified: undefined,
    dateRead: undefined,
    dateSent: '12:30 21.02.2024',
    listingId: 0,
    messageId: 4,
    photos: [this.testP2Horizontal, this.testP3SquareLowRes],
    recipientId: 2,
    senderId: 1
  };
  testM5: MessageResponse = {
    content: "All we had to do was to follow that damn train CJ.",
    dateModified: "23:30 21.02.2025",
    dateRead: "12.31 21.02.2024",
    dateSent: '12:30 21.02.2024',
    listingId: 0,
    messageId: 5,
    recipientId: 2,
    photos: [],
    senderId: 2
  };

  member1: ChatMemberInfo = {
    id: 1,
    username: "Dawid Pacisław",
    email: "robert@kozyra.pl",
    photoUrl: undefined
  }
  member2: ChatMemberInfo = {
    id: 2,
    username: "Filip Wójcisław",
    email: "robert2@kozyslaw.com",
    photoUrl: "https://cdn.prod.website-files.com/6859950a6a6d8258bcbc0c0f/68bf01df23fc967698fc204b_7485debfd9004eca65bebd1ee9c6a791_Mateusz%20Chrobok.webp"
  }
  testMembers:ChatMemberInfo[] = [
    this.member1, this.member2
  ];

  readonly currentUserId = signal(2);
  readonly chatMembers = input<ChatMemberInfo[]>(this.testMembers);

  async CallApiTest() {
    // simulate messages loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    this._messages.set([this.testM1, this.testM2, this.testM3, this.testM4, this.testM5]);
  }
  // endregion


  // TODO Uncomment when api ready
/*  readonly currentUserId = computed(() => this.userService.userBasicInfo().id);
 */


  readonly currentUsername = computed(() => this.userMemberInfo().username);
  readonly currentProfileImg = computed(() => this.userMemberInfo().photoUrl ??
    "../../../../assets/images/default_profile_pic.png");
  readonly userMemberInfo: Signal<ChatMemberInfo> = computed(() =>
    this.chatMembers().find((member) => member.id === this.currentUserId())!
  );

  readonly otherMemberInfo: Signal<ChatMemberInfo> = computed(() =>
    this.chatMembers().find((member) => member.id !== this.currentUserId())!
  );
  readonly otherUsername = computed(() => this.otherMemberInfo().username);
  readonly otherProfileImg = computed(() => this.otherMemberInfo().photoUrl ??
    "../../../../assets/images/default_profile_pic.png");

  // todo grab messages from the api
  private _messages = signal<MessageResponse[]>([]);
  readonly messages:Signal<MessageResponse[]> = this._messages.asReadonly();

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

  private _messageInput = signal("");
  readonly messageInput = this._messageInput.asReadonly();

  private _attachments = signal<File[]>([]);
  readonly attachments = this._attachments.asReadonly();
  private _hasAttachments = signal(false);
  readonly hasAttachments = this._hasAttachments.asReadonly();
  private _showAttachments = signal(false);
  readonly showAttachments = this._showAttachments.asReadonly();

  // stores id of currently edited
  private _selectedEditMessage: number = -1;

  // stores id of message to delete
  private _selectedDeleteMessage: number = -1;

  constructor() {
    // todo remove - TESTING
    this.CallApiTest().then((value) =>
      this._loading.set(false)
    );
  }

  // Message Input

  OnInputChanged(ev: Event) {
    const event = ev as InputEvent;
    if(event.data === null) return;
    this._messageInput.set(event.data);
  }

  private LoadTextIntoInput(text: string) {
    this._messageInput.set(text);
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

  async OnSubmit() {
    if(this.editingMessage()) {
      return;
    }
  }

  // Message edition

  OnEditionRequested(messageId: number) {
    if(this._selectedEditMessage === messageId) {
      this.OnEditionClosed();
      return;
    }
    this._editingMessage.set(true);
    this._hideInput.set(false);
    this._selectedEditMessage = messageId;

    const m = this.messages().find(message=> message.messageId === messageId);
    if(m) {
      this.LoadTextIntoInput(
        m.content ?? ""
      );
    }
  }

  async OnEditionConfirmed() {
  }

  OnEditionClosed() {
    this.LoadTextIntoInput("");
    this._editingMessage.set(false);
    this._selectedEditMessage = -1;
  }

  private LocalEdit(editedMessage: MessageResponse) {
    this._messages.update((messages) => {
      const index =  messages.findIndex(message => message.messageId === this._selectedEditMessage);
      messages[index] = editedMessage;
      return messages;
    });
  }

  // Message deletion

  OnDeletionRequested(messageId: number) {
    this._selectedDeleteMessage = messageId;
    this._showFileInputDialog.set(false);
    this._showDeletionDialog.set(true);
  }

  async OnDeletionConfirmed() {
    this.LocalDelete();
    this.OnDeletionClosed();
  }

  OnDeletionClosed() {
    this._showDeletionDialog.set(false);
    this._selectedDeleteMessage = -1;
  }

  IsOwnMessage(senderId: number) {
    return this.currentUserId() === senderId;
  }

  private LocalDelete() {
    this._messages.update((messages) => {
      const index =  messages.findIndex(message => message.messageId === this._selectedDeleteMessage);
      if(index > -1) {
        messages.splice(index, 1);
      }
      return messages;
    });
  }

  // Attachments

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

  // Image Preview

  OnPreviewClicked(url: string) {
    this._imagePreview.set(url);
  }

  OnPreviewClosed() {
    this._imagePreview.set(undefined);
  }

  // Messages scroll

  private _lastScrollPos: number = 0;

  OnMessagesScroll(event:any) {
    const scrollContainer = event.srcElement as HTMLElement;


    this._hideInput.set(
      scrollContainer.scrollTop < this._lastScrollPos
      // scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight > 30
    )
    this._lastScrollPos = scrollContainer.scrollTop;
  }

  // region message input formatting

  private _hideInput = signal(false);
  readonly hideInput = this._hideInput.asReadonly();

  private maxHeight = 0;
  private el: ElementRef<HTMLTextAreaElement> = inject(ElementRef<HTMLTextAreaElement>);
  private _parent : Element | null = null

  ngAfterViewInit(): void {
    this._parent = this.el.nativeElement.querySelector('#message_window');
    if (this._parent) {
      this.maxHeight = this._parent.clientHeight * 0.5; // 50% max height
      this.el.nativeElement.style.maxHeight = `${this.maxHeight}px`;
      this.adjustHeight();
    }
    this._loading.set(true);
  }

  @HostListener('input')
  onInput() {
    this.adjustHeight();
  }

  private adjustHeight() {
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

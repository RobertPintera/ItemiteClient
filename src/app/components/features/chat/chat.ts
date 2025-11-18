import {
  AfterViewInit,
  Component,
  computed, effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  Signal
} from '@angular/core';
import {MessageResponse} from '../../../core/models/chat/MessageResponse';
import {PhotoResponseDTO} from '../../../core/models/PhotoResponseDTO';
import {Message} from './message/message';
import {UserService} from '../../../core/services/user-service/user.service';
import {ChatMemberInfo} from '../../../core/models/chat/ChatMemberInfo';
import {sign} from "node:crypto";
import {FileUpload} from "../../shared/file-upload/file-upload";

@Component({
  selector: 'app-chat',
  imports: [
    Message,
    FileUpload
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

  readonly userMemberInfo: Signal<ChatMemberInfo> = computed(() =>
    this.chatMembers().find((member) => member.id === this.currentUserId())!
  );

  readonly otherMemberInfo: Signal<ChatMemberInfo> = computed(() =>
    this.chatMembers().find((member) => member.id !== this.currentUserId())!
  );

  // todo grab messages from the api
  private _messages = signal<MessageResponse[]>([]);
  readonly messages:Signal<MessageResponse[]> = this._messages.asReadonly();

  readonly currentProfileImg = computed(() => this.userMemberInfo().photoUrl ??
    "../../../../assets/images/default_profile_pic.png");

  readonly otherUsername = computed(() => this.otherMemberInfo().username);
  readonly otherProfileImg = computed(() => this.otherMemberInfo().photoUrl ??
    "../../../../assets/images/default_profile_pic.png");

  private _showFileInputDialog = signal(false);
  readonly showFileInputDialog = this._showFileInputDialog.asReadonly();

  SwitchShowFileInputDialog() {
    this._showFileInputDialog.set(!this._showFileInputDialog());
  }

  constructor() {
    // todo remove - TESTING
    this.CallApiTest();
  }

  IsOwnMessage(senderId: number) {
    return this.currentUserId() === senderId;
  }

  private _editingMessage = signal(false);
  readonly editingMessage = this._editingMessage.asReadonly();

  // message input formatting
  private maxHeight = 0;
  private el: ElementRef<HTMLTextAreaElement> = inject(ElementRef<HTMLTextAreaElement>);

  ngAfterViewInit(): void {
/*    const parent = this.el.nativeElement.closest('#message_input');
    if (parent) {
      this.maxHeight = parent.clientHeight * 0.5; // 50% max height
      this.el.nativeElement.style.maxHeight = `${this.maxHeight}px`;
      this.adjustHeight();
    }*/
  }

  @HostListener('input')
  onInput() {
/*    this.adjustHeight();*/
  }

  private adjustHeight() {
    const textarea = this.el.nativeElement;

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
}

import {Component, inject, input, signal, Signal} from '@angular/core';
import {MessageResponse} from '../../../core/models/chat/MessageResponse';
import {PhotoResponseDTO} from '../../../core/models/PhotoResponseDTO';
import {Message} from './message/message';
import {UserService} from '../../../core/services/user-service/user.service';

@Component({
  selector: 'app-chat',
  imports: [
    Message
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  // todo grab current and other user data from the service (Chat Member Info)
  //  name, profile photo, profile pic
  //  - ?use the | async pipe?
  userService: UserService = inject(UserService);
  // readonly userId = signal(this.userService.userBasicInfo().id);
  private readonly currentUser = signal(2);
  readonly otherUserId = input(1);

  private _currentUserName = signal<string>("Filip Wójcisław");
  private _otherUserName = signal<string>("Dawid Pacisław");
  private _currentProfileImg = signal<string | undefined>(undefined);
  private _otherProfileImg = signal<string | undefined>(undefined);

  // todo grab messages from the api
  private _messages = signal<MessageResponse[]>([]);
  readonly messages:Signal<MessageResponse[]> = this._messages.asReadonly();



  constructor() {
    // TESTING
    this._messages.set([this.testM1, this.testM2, this.testM3, this.testM4]);
  }

  IsOwnMessage(senderId: number) {
    return this._userId() === senderId;
  }

  GetUsername(isOwnMessage: boolean) {
    return isOwnMessage ? this.
  }

  /////////////
  // TESTING //
  /////////////
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
    photos: [this.testP1Vertical],
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
  }
}

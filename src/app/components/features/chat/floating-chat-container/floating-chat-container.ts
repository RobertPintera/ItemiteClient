import {Component, computed, inject, input, Signal} from '@angular/core';
import {Chat} from '../chat/chat';
import {ChatMemberInfo} from '../../../../core/models/chat/ChatMemberInfo';
import {UserService} from '../../../../core/services/user-service/user.service';

@Component({
  selector: 'app-floating-chat-container',
  imports: [
    Chat
  ],
  templateUrl: './floating-chat-container.html',
  styleUrl: './floating-chat-container.css',
})
export class FloatingChatContainer {
  private _userService = inject(UserService);

  readonly productOwner = input.required<ChatMemberInfo>();

  private readonly _currentUser = computed(() => this._userService.userBasicInfo().id);
  readonly chatMembers: Signal<ChatMemberInfo[]> = computed(() =>
    [
      {
        email: this.,
        id: 0,
        photoUrl: undefined,
        userName: ''
      }
    ]
  );
  readonly canChat = computed(() =>
    this.chatMembers.length === 2
    && this._currentUser() !== this.
  );
}

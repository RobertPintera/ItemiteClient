import {Component, computed, ElementRef, inject, input, output, signal, Signal, ViewChild} from '@angular/core';
import {Chat} from '../chat/chat';
import {ChatMemberInfo} from '../../../../core/models/chat/ChatMemberInfo';
import {AuthService} from '../../../../core/services/auth-service/auth.service';
import {User} from "../../../../core/models/user/User";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {UserService} from '../../../../core/services/user-service/user.service';

@Component({
  selector: 'app-floating-chat-container',
  imports: [
    Chat,
    CdkDrag,
    CdkDragHandle
  ],
  templateUrl: './floating-chat-container.html',
  styleUrl: './floating-chat-container.css',
})
export class FloatingChatContainer {
  private _userService = inject(UserService);
  readonly onExitClicked = output<void>();

  private _maximize = signal(false);
  readonly maximize = this._maximize.asReadonly();

  readonly listingId = input.required<number>();
  readonly productOwner = input.required<User>();

  private readonly _currentUser = computed(() => this._userService.userInfo());
  readonly chatMembers: Signal<ChatMemberInfo[]> = computed(() =>
    [
      {
        email: this._currentUser().email,
        id: this._currentUser().id,
        photoUrl: this._currentUser().photoUrl,
        userName: this._currentUser().userName
      },
      {
        email: this.productOwner().email,
        id: this.productOwner().id,
        photoUrl: this.productOwner().photoUrl,
        userName: this.productOwner().userName
      }
    ]
  );
  readonly canChat = computed(() =>
    this.chatMembers().length === 2
    && this._currentUser() !== this.productOwner()
    && this.productOwner().id
    && this._currentUser().id > -1
    && this.productOwner().id > -1
  );

  dragPosition = {x: 0, y: 0};
  @ViewChild('dragElement', { static: false }) dragElement!: ElementRef;

  OnMaximizeClicked() {
    this.dragPosition = {x: 0, y: 0};
    this._maximize.set(!this._maximize());
  }

  OnExitClicked() {
    this.dragPosition = {x: 0, y: 0};
    this.onExitClicked.emit();
  }
}

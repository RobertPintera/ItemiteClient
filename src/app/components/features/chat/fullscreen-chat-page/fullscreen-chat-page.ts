import {Component, computed, effect, inject, input, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {Chat} from '../chat/chat';
import {ChatMemberInfo} from '../../../../core/models/chat/ChatMemberInfo';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformServer} from '@angular/common';
@Component({
  selector: 'app-fullscreen-chat-page',
  imports: [
    Chat
  ],
  templateUrl: './fullscreen-chat-page.html',
  styleUrl: './fullscreen-chat-page.css',
})
export class FullscreenChatPage implements OnInit {
  readonly listingId = input.required<number>();
  readonly chatMembers = signal<ChatMemberInfo[]>([]);

  private _platformId = inject(PLATFORM_ID);

  readonly isValid = computed(() =>
    this.chatMembers().length > 1 &&
    this.listingId() !== undefined &&
    this.listingId() > -1
  );

  ngOnInit(): void {
    if(isPlatformServer(this._platformId)) return;

    this.GetDataFromState();

  }

  private GetDataFromState() {
    const state = history.state;

    if (!state?.chatMembers) {
      return;
    }

    this.chatMembers.set(state.chatMembers);
  }
}

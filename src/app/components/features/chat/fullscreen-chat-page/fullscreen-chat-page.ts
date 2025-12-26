import {Component, computed, inject, input, OnInit, PLATFORM_ID, signal} from '@angular/core';
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
  readonly listingId = signal<number>(-1);
  readonly chatMembers = signal<ChatMemberInfo[]>([]);

  private _router = inject(Router);
  private _platformId = inject(PLATFORM_ID);

  readonly isValid = computed(() =>
    this.chatMembers().length > 1
  );

  ngOnInit(): void {
    if(isPlatformServer(this._platformId)) return;

    const state = history.state;
    console.log(state);

    if (!state?.listingId || !state?.chatMembers) {
      return;
    }

    this.listingId.set(state.listingId);
    this.chatMembers.set(state.chatMembers);
  }

}

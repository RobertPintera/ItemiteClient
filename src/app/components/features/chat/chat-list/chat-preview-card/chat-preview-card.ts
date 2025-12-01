import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-chat-preview-card',
  imports: [],
  templateUrl: './chat-preview-card.html',
  styleUrl: './chat-preview-card.css'
})
export class ChatPreviewCard {
  onChatClicked = output<number>();

  index = input.required<number>();
  listingName = input.required<string>();
  mainImageUrl = input.required<string>();
  price = input.required<string>();
  isArchived = input.required<boolean>();
  selected = input.required<boolean>();

  lastMessageAuthor = input<string>();
  lastMessage = input<string>();
  dateSent = input<string>();
  otherMember = input<string>();
  unreadMessages = input<number>(0);

  OnClicked() {
    this.onChatClicked.emit(this.index());
  }

}

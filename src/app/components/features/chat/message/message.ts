import {AfterViewInit, Component, computed, input, InputSignal} from '@angular/core';
import {MessageResponse} from '../../../../core/models/chat/MessageResponse';
import {PhotoResponseDTO} from '../../../../core/models/PhotoResponseDTO';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class Message implements AfterViewInit {
  readonly username = input.required<string>();
  readonly content = input<string>();
  readonly dateModified = input<string>();
  readonly dateRead = input<string>();
  readonly dateSent = input.required<string>();
  readonly photos = input<PhotoResponseDTO[]>([]);
  readonly isOwnMessage = input.required<boolean>();
  readonly profileImage = input<string>("");
  readonly backgroundImage = input<string>();

  readonly hasPhotos = computed(() => this.photos().length !== 0);

  ngAfterViewInit(): void {
    console.log(this.username());
  }
}

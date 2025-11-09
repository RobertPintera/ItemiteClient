import {Component, computed, input, InputSignal} from '@angular/core';
import {MessageResponse} from '../../../../core/models/MessageResponse';
import {PhotoResponseDTO} from '../../../../core/models/PhotoResponseDTO';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class Message {
  readonly username = input.required<string>();
  readonly content = input<string>();
  readonly dateModified = input<string>();
  readonly dateRead = input<string>();
  readonly dateSent = input.required<string>();
  readonly photos = input<PhotoResponseDTO[]>([]);
  readonly isOwnMessage = input.required<boolean>();
  readonly profileImage = input<string>("");
  readonly backgroundImage = input<string>();

}

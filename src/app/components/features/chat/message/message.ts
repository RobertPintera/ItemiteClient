import {AfterViewInit, Component, computed, input, InputSignal, output} from '@angular/core';
import {MessageResponse} from '../../../../core/models/chat/MessageResponse';
import {PhotoResponseDTO} from '../../../../core/models/PhotoResponseDTO';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-message',
  imports: [
    DatePipe
  ],
  templateUrl: './message.html',
  styleUrl: './message.css',
  providers: [DatePipe]
})
export class Message {

  readonly onDeleteClicked = output<number>();
  readonly onEditClicked = output<number>();
  readonly onImageClicked = output<string>();

  readonly id = input.required<number>();
  readonly username = input.required<string>();
  readonly content = input<string>();
  readonly dateModified = input<string>();
  readonly dateRead = input<string>();
  readonly dateSent = input.required<string>();
  readonly photos = input<PhotoResponseDTO[]>([]);
  readonly isOwnMessage = input.required<boolean>();
  readonly profileImage = input<string>("");
  readonly backgroundImage = input<string>();
  readonly isDeleted = input<boolean>(false);

  readonly hasPhotos = computed(() => this.photos().length !== 0);

  OnDeleteClicked() {
    this.onDeleteClicked.emit(this.id());
  }

  OnEditClicked() {
    this.onEditClicked.emit(this.id());
  }

  OnImageClicked(url: string): void {
    this.onImageClicked.emit(url);
  }


}
